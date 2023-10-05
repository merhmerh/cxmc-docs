<script>
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import Icon from '@iconify/svelte';
import { theme } from '$comp/theme.store.js';
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

export let content;
content = content;
let editor,
    autoSlug = false;

$: $theme, toggleDarkMode();
$: content.title, updateSlug();
function updateSlug() {
    if (!autoSlug) return;
    content.slug = content.title.replace(/[\s_-]/g, '-').toLowerCase();
}

async function toggleDarkMode() {
    let el = document.getElementsByClassName('toastui-editor-defaultUI')[0];
    if (!el) return;
    console.log(el);
    if (el.classList.contains('toastui-editor-dark')) {
        el.classList.remove('toastui-editor-dark');
    } else {
        el.classList.add('toastui-editor-dark');
    }
}

function startEditor() {
    const Editor = toastui.Editor;
    editor = new Editor({
        usageStatistics: false,
        height: '100%',
        el: document.querySelector('#editor'),
        initialEditType: 'wysiwyg',
        previewStyle: 'tab',
        isMarkdownMode: false,
        isWysiwygMode: true,
        theme: $theme,
    });

    editor.setPlaceholder('Start writing...');

    if (content) {
        editor.setHTML(content.html);
    }
}

export function save() {
    content.html = editor.getHTML();
    content.md = editor.getMarkdown();
    const guide = {
        id: content.id,
        title: content.title,
        slug: content.slug,
    };
    dispatch('save', { content, guide });
}

function close() {
    dispatch('close');
}
</script>

<svelte:head>
    <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js" on:load={startEditor}></script>
</svelte:head>

<div class="top">
    <input class="title" type="text" placeholder="Enter Title" bind:value={content.title} />
    <div class="inputBox" disabled={autoSlug}>
        <span class="prefix">/modellingguide/</span>
        <input type="text" placeholder="{'{'}slug{'}'}" bind:value={content.slug} disabled={autoSlug} />
        <button
            class="none autoSlug"
            class:off={!autoSlug}
            on:click={() => {
                autoSlug = !autoSlug;
                if (autoSlug) {
                    updateSlug();
                }
            }}>
            {#if autoSlug}
                <Icon icon="tabler:link" height="20" />
            {:else}
                <Icon icon="tabler:link-off" height="20" />
            {/if}
        </button>
    </div>
</div>

<div class="editor-container">
    <div id="editor" />
</div>

<slot name="belowEditor" />

<style lang="scss">
.top {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    input {
        &.title {
            font-weight: 600;
            font-size: 1.5rem;
        }
        width: 100%;
    }
    button.autoSlug {
        color: $accent;
        &.off {
            color: $grey;
        }
    }
}

.editor-container {
    height: 100%;
    & :global(.toastui-editor-contents) {
        font-size: 15px;
        font-family: Inter, Helvetica Neue, Helvetica, Arial, sans-serif !important;
    }
}
</style>
