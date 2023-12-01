<script>
import Icon from "@iconify/svelte";
import { createEventDispatcher } from "svelte";
import { theme } from "$comp/theme.store";
console.log($theme);
const dispatch = createEventDispatcher();

export let order = "none";

function toggle() {
    if (order == "none") {
        order = "asc";
    } else if (order == "asc") {
        order = "desc";
    } else {
        order = "none";
    }

    dispatch("click", order);
}
</script>

<button class="none icon" on:click={toggle} class:dark={$theme == "dark"} class:light={$theme == "light"}>
    <div class="icon" class:selected={order == "asc"}>
        <Icon icon="typcn:arrow-sorted-up" height="18" />
    </div>
    <div class="icon" class:selected={order == "desc"}>
        <Icon icon="typcn:arrow-sorted-up" height="18" vFlip={true} />
    </div>
</button>

<style lang="scss">
button {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
    position: relative;
    height: 28px;
    &.light {
        --inactive-color: var(--mono-200);
    }
    &.dark {
        --inactive-color: var(--mono-300);
    }

    .icon {
        position: absolute;
        padding: 0;
        color: var(--inactive-color);
        &.selected {
            color: var(--accent);
        }
        &:first-child {
            top: 0;
        }
        &:last-child {
            bottom: 0;
        }
    }
}
</style>
