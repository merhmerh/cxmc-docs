<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { theme } from "$comp/theme.store.js";
import { uuid } from "$fn/helper";
import { createEventDispatcher } from "svelte";
import { page } from "$app/stores";
import { decode } from "base64-arraybuffer";

const dispatch = createEventDispatcher();

let { supabase } = $page.data;

export let IdentifiedComponent;
let content, editing, viewerHTML, ready;

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
        console.log("!");
        return (viewerHTML = noGuideMessage);
    }
    viewerHTML = content.html.replace(/<p>(<img src.+?)<\/p>/g, `<div class="image">$1</div>`);
    viewerHTML = viewerHTML.replace(
        /<div .+?(<img src.+?>).*?<\/div><p>{{(.+?)}}<\/p>/g,
        `<div class="image">$1<div class="caption">$2</div></div>`,
    );
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

{#if !editing}
    <div class="viewer">
        <div class="content">
            {#if ready}
                {#if content}
                    {@html viewerHTML}
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
}
</style>
