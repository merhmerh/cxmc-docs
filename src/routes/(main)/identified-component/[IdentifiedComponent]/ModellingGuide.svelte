<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { theme } from "$comp/theme.store.js";
import { uuid } from "$fn/helper";
import { createEventDispatcher } from "svelte";
import { page } from "$app/stores";
import { decode } from "base64-arraybuffer";
import { timeout } from "$fn/helper";
import { fade, fly } from "svelte/transition";
import Image from "$routes/(main)/area-requirements/Image.svelte";
import { Modal } from "merh-forge-ui";

const dispatch = createEventDispatcher();

let { supabase } = $page.data;

export let IdentifiedComponent;
let content, editing, viewerHTML, ready, viewerJSON, modal_img_src, modal;

const noGuideMessage = "This identified component does not have a specified modelling guide.";

$: $theme, toggleTheme();

async function toggleTheme() {
    let el = document.getElementsByClassName("toastui-editor-defaultUI")[0];
    if (!el) return;
    if (el.classList.contains("toastui-editor-dark")) {
        el.classList.remove("toastui-editor-dark");
    } else {
        el.classList.add("toastui-editor-dark");
    }
}

let editor;

async function startEditor() {
    const Editor = toastui.Editor;
    editor = new Editor({
        usageStatistics: false,
        height: "100%",
        el: document.querySelector("#editor"),
        initialEditType: "wysiwyg",
        previewStyle: "tab",
        isMarkdownMode: false,
        isWysiwygMode: true,
        theme: $theme,
    });

    editor.setPlaceholder("Start writing...");
    content = await load();
    if (!content) {
        ready = true;
        return;
    }

    editor.setHTML(content.html);
    renderViewerHTML();
    ready = true;
}

export function showEditor() {
    editing = true;
}

export function showViewer() {
    editing = false;
}

export async function save() {
    let html = editor.getHTML();
    let markdown = editor.getMarkdown();

    const regex_imagesURI = new RegExp(/\<img src="(.*?)"/g);
    const matches = html.matchAll(regex_imagesURI);
    const promises = [];
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

    //center images
    const { data, error } = await supabase
        .from("modelling-guide")
        .upsert({
            identifiedComponent: IdentifiedComponent,
            html,
            markdown,
        })
        .select()
        .single();

    if (error) {
        return console.log(error);
    }

    content = data;
    renderViewerHTML();
    editing = false;
    viewerHTML = viewerHTML;
    dispatch("save");
}

function renderViewerHTML() {
    if (!content.html || content.html == "<p><br></p>") {
        return (viewerHTML = noGuideMessage);
    }
    viewerHTML = content.html.replace(/<p>(<img src.+?)<\/p>/g, `<div class="image">$1</div>`);
    viewerHTML = viewerHTML.replace(
        /<div .+?(<img src.+?>).*?<\/div><p>{{(.+?)}}<\/p>/g,
        `<div class="image">$1<div class="caption">$2</div></div>`,
    );
    let html = document.createElement("div");

    html.innerHTML = viewerHTML;
    viewerJSON = [];
    html.childNodes.forEach((node) => {
        if (node.classList.contains("image")) {
            console.log("is an image", node);
            viewerJSON.push({
                type: "image",
                src: node.querySelector("img")?.src,
                html: node.outerHTML,
            });
        } else {
            viewerJSON.push({
                type: "html",
                html: node.outerHTML,
            });
        }
    });

    console.log(viewerJSON);
}

async function load() {
    const { data, error } = await supabase
        .from("modelling-guide")
        .select()
        .eq("identifiedComponent", IdentifiedComponent)
        .single();

    if (error) {
        return false;
    }
    return data;
}
</script>

<svelte:head>
    <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js" on:load={startEditor}></script>
</svelte:head>

<div class="editor-container" class:hide={!editing}>
    <div id="editor" />
</div>

<Modal bind:this={modal}>
    <div class="modal">
        <img src={modal_img_src} alt="" />
    </div>
</Modal>

{#if !editing}
    <div class="viewer">
        <div class="content">
            {#if ready}
                {#if content}
                    {#each viewerJSON as { type, html, src }}
                        {#if type == "html"}
                            {@html html}
                        {:else}
                            <button
                                class=" image_container none noHover"
                                on:keyup={(e) => {
                                    if (e.key === "Enter") {
                                        modal_img_src = src;
                                        modal.show();
                                    }
                                }}
                                on:click={() => {
                                    modal_img_src = src;
                                    modal.show();
                                }}>
                                {@html html}
                            </button>
                        {/if}
                    {/each}
                {:else}
                    <span>{noGuideMessage}</span>
                {/if}
            {:else}
                <span>Loading...</span>
            {/if}
        </div>
    </div>
{/if}

<style lang="scss">
.editor-container {
    height: 1000px;
    & :global(.toastui-editor-contents) {
        font-size: 16px;
        font-family: var(--font);
    }
    &.hide {
        display: none;
    }
}

.viewer {
    // margin-inline: auto;
    // border: 1px solid var(--mono-100);
    // border-radius: 0.25rem;
    border-left: 8px solid var(--mono-100);
    .content {
        // margin-left: 2rem;
        margin-inline: auto;
        width: 840px;
    }
    :global(p) {
        margin-block: 12px;
    }
    .image_container {
        text-align: center;
        display: grid;
        justify-content: center;
        gap: 4px;
        width: 100%;

        :global(img) {
            padding: 1rem;
            background-color: white;
            border-radius: 0.25rem;
            margin-inline: auto;
            width: 100%;
        }
        :global(.caption) {
            font-size: 0.875rem;
            color: var(--mono);
        }
    }
}

.modal {
    max-width: calc(80vw);
    max-height: calc(100svh - 4rem);
    max-height: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: $mobile) {
        width: 100%;
        height: 100svh;
    }
    img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
}
</style>
