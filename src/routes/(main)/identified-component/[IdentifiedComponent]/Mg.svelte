<script>
import { page } from "$app/stores";
import Icon from "@iconify/svelte";
import ModellingGuide from "./ModellingGuide.svelte";
import { getPermission } from "$comp/supabase.store";

const { permission } = getPermission();

export let identifiedComponent;

console.log(identifiedComponent);
let isEditing = false;
let editor;
let selected = "General";

const tabs = ["General", "REVIT", "ArchiCAD", "OpenBuildings Designer"];

function switchTab() {
    //
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
    <ModellingGuide
        bind:this={editor}
        IdentifiedComponent={identifiedComponent}
        on:save={() => {
            isEditing = false;
        }} />
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
