<script>
import { createEventDispatcher } from "svelte";
import { toURLPath } from "$fn/helper";

import { page } from "$app/stores";

export let data;

let selected = $page.url.searchParams.get("q") || "residential-(non-landed)";
const dispatch = createEventDispatcher();

let list = mutateData(data);

function mutateData(data) {
    const categories = [...data, "All Spaces"];
    return categories;
}
</script>

<!-- <svelte:window on:keydown={handleKeyDown} /> -->

<div class="container">
    <div class="scrollable">
        {#each list as name}
            <button
                class="none"
                class:selected={selected == toURLPath(name.trim())}
                on:click={() => {
                    selected = toURLPath(name.trim());
                    dispatch("onNavigate", toURLPath(name.trim()));
                }}
                >{name}
            </button>
        {/each}
    </div>
</div>

<style lang="scss">
.container {
    display: flex;
    flex-direction: column;
    padding-top: 1rem;
    // height: 100%;
    padding-inline: 1rem 0.5rem;
}

.scrollable {
    padding-right: 0.5rem;
    display: flex;
    flex-direction: column;
    scrollbar-gutter: stable;
    overflow-y: auto;
    padding-bottom: 6rem;

    button {
        width: 100%;
        font-size: 1rem;
        justify-content: space-between;
        align-items: center;
        display: flex;
        padding: 0.5rem;
        text-decoration: none;
        color: var(--main);
        transition: all 0.3s;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        background-color: var(--bg-s);
        border: 4px solid var(--bg-p);
        &:hover {
            color: $url;
        }
        &:hover {
            background-color: $bg-alt;
        }

        &.selected {
            background-color: var(--accent);
            color: var(--main-alt);
        }
    }
}
</style>
