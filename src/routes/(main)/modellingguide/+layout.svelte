<script>
import { uuid } from "$fn/helper";
import Icon from "@iconify/svelte";
import { Modal } from "merh-forge-ui";
import { page } from "$app/stores";
import { listOfGuides } from "./aside.store";

export let data;
listOfGuides.set(data.modellingGuide);
let { supabase } = data;
let showNewGuideModal,
    newGuideTitle = "",
    slug,
    autoSlug = true;

async function createNewGuide() {
    const data = {
        id: uuid(),
        title: newGuideTitle,
        slug: slug,
    };
    const { error } = await supabase.from("modellingGuide").insert(data);
    if (error) {
        alert(error.message);
    }
    $listOfGuides = [data, ...$listOfGuides].sort((a, b) => {
        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();

        if (titleA < titleB) {
            return -1;
        }
        if (titleA > titleB) {
            return 1;
        }
        return 0;
    });
    showNewGuideModal = false;
}

$: newGuideTitle, updateSlug();

function updateSlug() {
    if (!autoSlug) return;
    slug = newGuideTitle.replace(/[\s_-]/g, "-").toLowerCase();
}
</script>

<aside>
    <div class="list">
        {#each $listOfGuides as doc}
            <a class:selected={$page.params.slug == doc.slug} href="/modellingguide/{doc.slug}">{doc.title}</a>
        {/each}
    </div>

    <button
        class="add"
        on:click={() => {
            newGuideTitle = "";
            showNewGuideModal = true;
        }}>Add New Guide</button>
</aside>

<div class="content">
    <slot />
</div>

{#if showNewGuideModal}
    <Modal
        exitOutside={false}
        on:close={() => {
            showNewGuideModal = false;
        }}>
        <div class="newGuideModal">
            <h2>Create New Guide</h2>
            <input
                class="title"
                type="text"
                placeholder="Enter Title"
                bind:value={newGuideTitle}
                on:keydown={(e) => {
                    if (e.key == "Enter") {
                        createNewGuide();
                    }
                }} />
            <div class="inputBox" disabled={autoSlug}>
                <span class="prefix">/modellingguide/</span>
                <input type="text" placeholder="{'{'}slug{'}'}" bind:value={slug} disabled={autoSlug} />
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

            <div class="buttonRows">
                <button on:click={createNewGuide}>Save</button>
                <button
                    class="alt"
                    on:click={() => {
                        showNewGuideModal = false;
                    }}>Cancel</button>
            </div>
        </div>
    </Modal>
{/if}

<style lang="scss">
.newGuideModal {
    width: 600px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
aside {
    position: sticky;
    top: 70px;
    height: calc(100svh - 70px);
    overflow-y: auto;
    border-right: 1px solid $grey-lighter;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    .list {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 0.5rem;
        a {
            background-color: $bg-s;
            border-radius: 0.5rem;
            padding: 0.5rem;
            font-size: 1rem;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            color: $main;
            text-decoration: none;
            height: auto;
            &.selected {
                background-color: $accent;
                color: $main-alt;
            }
        }
    }
    button.add {
        margin-top: auto;
        height: auto;
    }
}
.content {
    position: relative;
    padding-top: 2rem;
    margin-inline: auto;
    width: 1100px;
    min-height: calc(100svh - 70px);
    padding-bottom: 100px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>
