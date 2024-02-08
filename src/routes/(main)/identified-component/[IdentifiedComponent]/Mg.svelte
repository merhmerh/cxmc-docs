<script>
import { page } from "$app/stores";
import Icon from "@iconify/svelte";
import Editor from "./Editor.svelte";
import { getPermission } from "$comp/supabase.store";
import { onMount } from "svelte";
import { Select, notify } from "merh-forge-ui";
import Error from "$routes/+error.svelte";
import dayjs from "dayjs";
import { decode } from "base64-arraybuffer";
import { uuid } from "$fn/helper.js";

const { permission } = getPermission();

let { supabase } = $page.data;
export let identifiedComponent;

let isEditing = false;
let editor;
let mg_data;
let list_html = {};
let editor_html;
let content;
let currentTab = "General";
let isDownloading;
let versions;
let awaiting;
const tabs = ["General", "REVIT", "ArchiCAD", "OpenBuildings Designer"];

onMount(async () => {
    await load();
});

async function load() {
    const { data, error } = await supabase
        .from("modelling-guide")
        .select()
        .eq("identifiedComponent", identifiedComponent)
        .single();

    if (error || !data.html) {
        //guide does not exist
        console.log("no content");
        mg_data = {
            html: "",
            identifiedComponent: identifiedComponent,
            version: 0,
        };
        content = initHTML("");
        return;
    }

    mg_data = data;

    content = initHTML(data.html);
    console.log(mg_data);
    getVersion();
}

//migration
function initHTML(html) {
    const doc = document.createElement("div");
    doc.insertAdjacentHTML("afterbegin", html);

    const categories = doc.querySelectorAll("h1");

    for (const tab of tabs) {
        const category = Array.from(categories).find((c) => c.innerText == `#-#${tab}#-#`);

        if (tab == "General") {
            if (!category) {
                doc.innerHTML = `<h1>#-#${tab}#-#</h1>${html}`;
            }
        }
        if (!category) {
            doc.insertAdjacentHTML("beforeend", `<h1>#-#${tab}#-#</h1>`);
        }
    }

    const rawHtml = doc.innerHTML;

    //split content to tabs
    for (const [i, tab] of tabs.entries()) {
        if (i == tabs.length - 1) {
            const re = new RegExp(`<h1>#-#${tab}#-#<\/h1>(.*?)$`);
            const match = rawHtml.match(re);
            list_html[tab] = match[1];
            break;
        }

        const re = new RegExp(`<h1>#-#${tab}#-#<\/h1>(.*?)<h1>#-#`);
        const match = rawHtml.match(re);
        list_html[tab] = match[1];
    }

    return list_html;
}

async function saveToDB(content) {
    awaiting = true;
    let contentHTML = "";
    //create section for each category
    for (const category in content) {
        contentHTML += `<h1>#-#${category}#-#</h1>${content[category]}`;
    }

    if (mg_data.html == contentHTML) {
        console.log("Same content, skip saving to db");
        isEditing = false;
        awaiting = false;

        return;
    }

    console.log(contentHTML);

    //save images to db
    const regex_imagesURI = new RegExp(/\<img src="(.*?)"/g);
    const matches = contentHTML.matchAll(regex_imagesURI);
    const promises = [];
    // return;
    const ic = mg_data.identifiedComponent;
    for (const match of matches) {
        const dataURI = match[1];
        if (!dataURI.startsWith("data:image/")) {
            console.log("Existing Image, skip saving to db");
            continue;
        }

        const uploadTask = new Promise(async (resolve) => {
            const [data, base64] = dataURI.split(",");
            const contentType = /data:(.*);/.exec(data)[1];
            const ext = contentType.split("/")[1];
            const imageId = uuid();
            const { data: path, error } = await supabase.storage
                .from("public")
                .upload(`modellingGuide/${ic}/${imageId}.${ext}`, decode(base64), {
                    contentType: contentType,
                });

            const { data: url } = supabase.storage.from("public").getPublicUrl(path.path);

            contentHTML = contentHTML.replace(dataURI, url.publicUrl);
            resolve(imageId);
        });

        promises.push(uploadTask);
    }

    await Promise.all(promises);

    const { data: new_mg_data, error } = await supabase
        .from("modelling-guide")
        .upsert({
            identifiedComponent: identifiedComponent,
            html: contentHTML,
            version: mg_data.version + 1,
        })
        .select()
        .single();

    if (error) {
        return console.log(error);
    }

    console.log("Saved to DB version", new_mg_data.version);
    editor_html = list_html[currentTab];

    //create backup to storage
    const { data: backup, error: backupError } = await supabase.storage
        .from("public")
        .upload(
            `modellingGuide/${mg_data.identifiedComponent}/backup/${mg_data.identifiedComponent}_v${new_mg_data.version}.html`,
            contentHTML,
            {
                contentType: "text/html",
            },
        );

    if (backupError) {
        console.log(backupError);
    }

    isEditing = false;
    mg_data = new_mg_data;
    getVersion();
    content = initHTML(mg_data.html);
    awaiting = false;
}

async function changeVersion(version) {
    console.log(version);
    awaiting = true;
    const ic = mg_data.identifiedComponent;
    const { data: file, error } = await supabase.storage
        .from("public")
        .getPublicUrl(`modellingGuide/${ic}/backup/${ic}_${version}.html`);

    if (error) {
        isDownloading = false;
        console.log(error);
        return;
    }

    console.log(file);
    try {
        const resp = await fetch(file.publicUrl);
        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
        const result = await resp.text();
        mg_data.html = result;

        if (version !== `v${mg_data.version}`) {
            mg_data.isPreviousVersion = true;
        } else {
            mg_data.isPreviousVersion = false;
        }

        content = initHTML(result);
    } catch (error) {
        console.log(error);
        notify.add("Failed to retrieve version");
    } finally {
        isDownloading = false;
        awaiting = false;
    }
}

async function getVersion() {
    const ic = mg_data.identifiedComponent;

    const { data, error } = await supabase.storage
        .from("public")
        .list(`modellingGuide/${ic}/backup`, {
            limit: 100,
            offset: 0,
            sortBy: { column: "created_at", order: "asc" },
        });

    if (error) {
        console.log(error);
        return;
    }

    if (!data.length) {
        console.log(mg_data);
        versions = [`v1: ${dayjs(mg_data.updated_at).format("DD MMM YYYY, HH:mm")}`];
        return;
    }

    versions = data
        .reduce((acc, x) => {
            const date = dayjs(x.created_at).format("DD MMM YYYY, HH:mm");
            const v = `v${acc.length + 1}: ${date}`;
            return [...acc, v];
        }, [])
        .reverse();
}

function switchTab(tab) {
    editor.onSwitchTab(currentTab, tab);
    currentTab = tab;
}
</script>

<div class="container">
    {#if awaiting}
        <div class="awaiting">
            <div class="icon">
                <Icon icon="svg-spinners:3-dots-move" height={64} />
                <span>Please wait</span>
            </div>
        </div>
    {/if}
    <h3 id="modelling-guide">
        <a href="{$page.url.origin}{$page.url.pathname}#modelling-guide">Modelling Guide</a>
        <div class="buttonGroup">
            {#if permission.edit}
                {#if isEditing}
                    <button
                        on:click={() => {
                            editor.cancel();
                        }}>
                        <span>Cancel</span>
                    </button>
                    <button
                        on:click={() => {
                            editor.save();
                        }}>
                        <div class="icon"><Icon icon="material-symbols:save" width={16} /></div>
                        <span>Save</span>
                    </button>
                {:else if !mg_data?.isPreviousVersion}
                    <button
                        on:click={() => {
                            isEditing = true;
                            editor.showEditor();
                        }}>
                        <div class="icon"><Icon icon="ic:baseline-edit" width={14} /></div>
                        <span> Edit Guide</span>
                    </button>
                {/if}
            {/if}
        </div>
    </h3>

    {#if mg_data}
        <div class="menu">
            <div class="tabs">
                {#each tabs as tab}
                    <button
                        class="tab none"
                        class:selected={currentTab == tab}
                        on:click={() => {
                            switchTab(tab);
                        }}>
                        {tab}
                    </button>
                {/each}
            </div>
            <div class="version">
                {#if versions && !isEditing}
                    {#key versions}
                        <Select
                            items={versions}
                            rows={Math.min(versions.length, 5)}
                            defaultValue={versions[0]}
                            style={{ borderRadius: "0.25rem", padding: ".5rem" }}
                            on:change={(e) => {
                                const v = e.detail.value.split(/:/)[0];
                                if (v == "v1") {
                                    console.log("latest version");
                                    return;
                                }
                                changeVersion(e.detail.value.split(/:/)[0]);
                            }} />
                    {/key}
                {/if}
            </div>
        </div>
    {/if}

    {#if content}
        {#key mg_data}
            <div class="guide">
                <Editor
                    bind:this={editor}
                    bind:isEditing
                    {currentTab}
                    {content}
                    on:save={(e) => {
                        saveToDB(e.detail);
                    }} />
            </div>
        {/key}
    {/if}
</div>

<style lang="scss">
.container {
    position: relative;

    .awaiting {
        position: absolute;
        z-index: 2;
        width: calc(100% + 2rem);
        margin-left: -1rem;
        height: calc(100% + 2rem);
        margin-top: -1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0.5rem;
        background-color: color-mix(in srgb, var(--mono-100) 50%, transparent);
        backdrop-filter: blur(2px);
        overflow: hidden;
        .icon {
            flex-direction: column;
        }
    }
}
h3 {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 1px solid var(--mono-100);
    ont-weight: 600;
    margin-block: 2rem 1rem;
    padding-bottom: 0.5rem;
    a {
        text-decoration: none;
        color: inherit;
        &:hover {
            color: $url;
        }
    }
    .buttonGroup {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        button {
            min-width: 80px;
            font-size: 0.875rem;
            padding: 0.5rem 0.5rem;
            border-radius: 0.5rem;
            gap: 0.5rem;
        }
    }
}

.menu {
    display: flex;
    justify-content: space-between;
    .tabs {
        button.tab {
            padding: 1rem;
            border-radius: 0;
            border: 1px solid var(--mono-200);
            border-right: 0;
            &:first-child {
                border-radius: 0.25rem 0 0 0.25rem;
            }
            &:last-child {
                border-radius: 0 0.25rem 0.25rem 0;
                border-right: 1px solid var(--mono-200);
            }
            &.selected {
                color: var(--accent);
                background-color: color-mix(in srgb, var(--mono-400) 12%, transparent);
            }
        }
    }
    .version {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
}

.guide {
    margin-top: 2rem;
}

.version {
    font-size: 0.875rem;
}
</style>
