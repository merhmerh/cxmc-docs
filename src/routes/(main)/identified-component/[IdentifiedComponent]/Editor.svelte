<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { theme } from "$comp/theme.store.js";
import { createEventDispatcher, onMount, tick } from "svelte";
import { Modal, notify } from "merh-forge-ui";

const dispatch = createEventDispatcher();

export let isEditing;
export let content;
export let currentTab = "General";
let viewerHTML,
    ready,
    viewerContentJSON = [],
    modal,
    modal_img_src,
    currentHTML,
    originalContent,
    confirmationModal,
    editor;

const noGuideMessage =
    "This identified component does not have a specified modelling guide for this category.";

$: $theme, toggleTheme();

onMount(() => {
    console.log("init");
    console.log(content);
    onSwitchTab(null, currentTab);
});

export async function cancel() {
    console.log("cancel do not save");
    const temp = structuredClone(content);
    temp[currentTab] = editor.getHTML();

    for (const tab in temp) {
        if (temp[tab] === "<p><br></p>") {
            temp[tab] = "";
        }
    }

    console.log(temp, originalContent);
    if (JSON.stringify(temp) !== JSON.stringify(originalContent)) {
        console.log(confirmationModal);
        confirmationModal.show();
        await tick();
        document.querySelector("#confirmationModal button:first-child").focus();
        return;
    }

    content = originalContent;
    isEditing = false;
}

function revert() {
    content = originalContent;
    isEditing = false;
    confirmationModal.hide();
}

export function onSwitchTab(previousTab, nextTab) {
    console.log("switching tab", previousTab, "==>", nextTab);

    if (isEditing) {
        content[previousTab] = editor.getHTML();
        if (content[previousTab] === "<p><br></p>") {
            content[previousTab] = "";
        }
        currentHTML = content[nextTab];

        editor.setHTML(currentHTML);
        currentTab = nextTab;
        return;
    }

    currentTab = nextTab;
    currentHTML = content[nextTab];
    viewerContentJSON = renderViewerHTML(currentHTML);
}

export function getContent() {
    return editor.getHTML();
}

async function toggleTheme() {
    let el = document.getElementsByClassName("toastui-editor-defaultUI")[0];
    if (!el) return;
    if (el.classList.contains("toastui-editor-dark")) {
        el.classList.remove("toastui-editor-dark");
    } else {
        el.classList.add("toastui-editor-dark");
    }
}

async function startEditor() {
    console.log("editor init");
    originalContent = structuredClone(content);
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
    ready = true;
}

export function showEditor() {
    isEditing = true;
    editor.setHTML(currentHTML);
}

export async function save() {
    console.log(currentTab);
    content[currentTab] = editor.getHTML();
    dispatch("save", content);
}

function renderViewerHTML(html) {
    if (!html || html == "<p><br></p>") {
        return (currentHTML = "");
    }
    viewerHTML = html.replace(/<p>(<img src.+?)<\/p>/g, `<div class="image">$1</div>`);
    viewerHTML = viewerHTML.replace(
        /<div .+?(<img src.+?>).*?<\/div><p>{{(.+?)}}<\/p>/g,
        `<div class="image">$1<div class="caption">$2</div></div>`,
    );
    let outer = document.createElement("div");

    outer.innerHTML = viewerHTML;
    const result = [];
    outer.childNodes.forEach((node) => {
        if (node.classList.contains("image")) {
            result.push({
                type: "image",
                src: node.querySelector("img")?.src,
                html: node.outerHTML,
            });
        } else {
            result.push({
                type: "html",
                html: node.outerHTML,
            });
        }
    });
    return result;
}
</script>

<svelte:head>
    <script
        src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"
        on:load={startEditor}></script>
</svelte:head>

<Modal bind:this={confirmationModal}>
    <div id="confirmationModal" class="modal confirmation">
        <p>You have unsaved changes! Are you sure you want to leave?</p>
        <div class="buttonGroup focus">
            <button
                class=""
                on:click={() => {
                    confirmationModal.hide();
                }}>No</button>
            <button on:click={revert}>Yes</button>
        </div>
    </div>
</Modal>

<Modal bind:this={modal}>
    <div class="modal image">
        <img src={modal_img_src} alt="" />
    </div>
</Modal>

<div class="editor-container" class:hide={!isEditing}>
    <div id="editor" />
</div>

{#if !isEditing}
    <div class="viewer">
        <div class="content">
            {#if currentHTML}
                {#each viewerContentJSON as { type, html, src }}
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
    .content {
        // margin-left: 2rem;
        margin-inline: auto;
        width: 840px;
    }
    :global(p) {
        margin-block: 6px;
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
    &.image {
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
}
</style>
