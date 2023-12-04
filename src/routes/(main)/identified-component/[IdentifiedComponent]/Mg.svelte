<script>
import { page } from "$app/stores";
import Icon from "@iconify/svelte";
import Editor from "./Editor.svelte";
import { getPermission } from "$comp/supabase.store";
import { onMount } from "svelte";
import { browser } from "$app/environment";

const { permission } = getPermission();

let { supabase } = $page.data;
export let identifiedComponent;

let isEditing = false;
let editor;
let selected = "General";
let list_html = {};
let editor_html = "";
const tabs = ["General", "REVIT", "ArchiCAD", "OpenBuildings Designer"];

$: tabs, switchTab();

onMount(async () => {
    await load();
});

function switchTab() {
    if (!browser) return;

    editor_html = list_html[selected];
    console.log(editor_html);
}

async function load() {
    const { data, error } = await supabase
        .from("modelling-guide")
        .select()
        .eq("identifiedComponent", identifiedComponent)
        .single();

    if (error) {
        return false;
    }
    console.log(data);

    //migration
    const html = data.html;
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

    console.log(doc.innerHTML);
    const rawHtml = doc.innerHTML;

    //split
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

    // data.html = doc.outerHTML;
    console.log(list_html);
    editor_html = list_html[tabs[0]];
}

async function saveToDB(detail) {
    list_html[selected] = detail.html;
    let html = detail.html;
    console.log(list_html);

    const regex_imagesURI = new RegExp(/\<img src="(.*?)"/g);
    const matches = html.matchAll(regex_imagesURI);
    const promises = [];
    // return;
    for (const match of matches) {
        const dataURI = match[1];
        if (!dataURI.startsWith("data:image/")) {
            console.log("skip");
            continue;
        }

        const uploadTask = new Promise(async (resolve) => {
            const [data, base64] = dataURI.split(",");
            const contentType = /data:(.*);/.exec(data)[1];
            const ext = contentType.split("/")[1];
            const imageId = uuid();
            const { data: path, error } = await supabase.storage
                .from("public")
                .upload(`modellingGuide/${IdentifiedComponent}/${imageId}.${ext}`, decode(base64), {
                    contentType: contentType,
                });

            const { data: url } = supabase.storage.from("public").getPublicUrl(path.path);

            html = html.replace(dataURI, url.publicUrl);
            markdown = markdown.replace(dataURI, url.publicUrl);
            resolve(imageId);
        });

        promises.push(uploadTask);
    }

    await Promise.all(promises);

    //convert list_html to combinedHTML
    const combinedHTML = Object.entries(list_html)
        .map(([tab, html]) => {
            return `<h1>#-#${tab}#-#</h1>${html}`;
        })
        .join("");

    const { data, error } = await supabase
        .from("modelling-guide")
        .upsert({
            identifiedComponent: identifiedComponent,
            html: combinedHTML,
            markdown: "",
        })
        .select()
        .single();

    if (error) {
        return console.log(error);
    }

    editor_html = list_html[selected];
    isEditing = false;
}
</script>

<h3 id="modelling-guide">
    <a href="{$page.url.origin}{$page.url.pathname}#modelling-guide">Modelling Guide</a>
    <div class="buttonGroup">
        {#if permission.edit}
            {#if isEditing}
                <button
                    on:click={() => {
                        isEditing = false;
                        editor.showViewer();
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
            {:else}
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

<div class="tabs">
    {#each tabs as tab}
        <button
            class="tab none"
            class:selected={selected == tab}
            on:click={() => {
                selected = tab;
                switchTab();
            }}>
            {tab}
        </button>
    {/each}
</div>

<div class="guide">
    {#key editor_html}
        <Editor
            bind:this={editor}
            {isEditing}
            html={editor_html}
            on:save={(e) => {
                saveToDB(e.detail);
            }} />
    {/key}
</div>

<style lang="scss">
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

.guide {
    margin-top: 2rem;
}
</style>
