<script>
import { createEventDispatcher } from "svelte";
import { page } from "$app/stores";
import { isMobile } from "$comp/device.store";

export let data;

const dispatch = createEventDispatcher();

const list_original = mutateData(data);
let list = list_original;

function mutateData(data) {
    const categories = ["All Spaces", ...new Set(data.map((x) => x.category.replace(/\n/, "")))];
    return categories;
}
</script>

<!-- <svelte:window on:keydown={handleKeyDown} /> -->

<div class="container">
    <div class="scrollable">
        {#each list as category}
            <div
                class="row"
                class:selected={$page.url.pathname.split("/").pop() ==
                    category.replace(/[\/,]/g, "").replace(/\s+/g, "-").toLowerCase()}>
                <a
                    href="/spacename/{category.replace(/[\/,]/g, '').replace(/\s+/g, '-').toLowerCase()}"
                    on:click={() => {
                        dispatch("onNavigate");
                    }}>{category}</a>
            </div>
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
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow-y: auto;
    padding-bottom: 6rem;

    .row {
        background-color: $bg-s;
        border-radius: 0.5rem;
        transition: all 0.3s;
        &:hover {
            background-color: $bg-alt;
        }
        &.selected {
            background-color: $accent;
            a {
                color: $main-alt !important;
            }
        }
        a {
            text-decoration: none;
            display: flex;
            font-size: 0.875rem;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem;
            color: var(--main);
            &:hover {
                color: $url;
            }
        }
    }
}
</style>
