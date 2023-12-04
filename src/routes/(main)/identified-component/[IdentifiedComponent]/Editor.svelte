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

const dispatch = createEventDispatcher();

let { supabase } = $page.data;

export let html;
export let isEditing;
let content, viewerHTML, ready;

const noGuideMessage = "This identified component does not have a specified modelling guide for this category.";

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
    if (!html) {
        ready = true;
        return;
    }

    editor.setHTML(html);
    renderViewerHTML();
    ready = true;
}

export function showEditor() {
    isEditing = true;
}

export function showViewer() {
    isEditing = false;
}

export async function save() {
    let html = editor.getHTML();
    let markdown = editor.getMarkdown();
    dispatch("save", { html });
}

function renderViewerHTML() {
    if (!html || html == "<p><br></p>") {
        return (viewerHTML = noGuideMessage);
    }
    viewerHTML = html.replace(/<p>(<img src.+?)<\/p>/g, `<div class="image">$1</div>`);
    viewerHTML = viewerHTML.replace(
        /<div .+?(<img src.+?>).*?<\/div><p>{{(.+?)}}<\/p>/g,
        `<div class="image">$1<div class="caption">$2</div></div>`,
    );
}
</script>

<svelte:head>
    <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js" on:load={startEditor}></script>
</svelte:head>

<div class="editor-container" class:hide={!isEditing}>
    <div id="editor" />
</div>

{#if !isEditing}
    <div class="viewer">
        <div class="content">
            {#if html}
                {@html viewerHTML}
            {:else}
                {noGuideMessage}
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
    border-left: 8px solid var(--mono-100);
    padding-block: 1rem;
    .content {
        // margin-left: 2rem;
        margin-inline: auto;
        width: 840px;
    }
}
</style>
