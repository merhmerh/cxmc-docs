<script>
import { onMount } from "svelte";
import Sidebar from "./Sidebar.svelte";
import spaceNameJson from "./data_space_ot_pdt.json";
import { isMobile } from "$comp/device.store";
import Icon from "@iconify/svelte";
let showMobileSidebar;

const spaces = spaceNameJson.spaceName;

onMount(() => {
    const ifcsg = localStorage.getItem("airtable");
    if (ifcsg) {
    }
});
</script>

{#if $isMobile}
    <div class="m__header">
        <button
            class="none noHover m__sidebar__toggle"
            on:click={() => {
                showMobileSidebar = !showMobileSidebar;
            }}>
            <Icon icon="bi:filter-right" hFlip={true} height="24" />
        </button>
    </div>
{/if}

<div class="sidebar" class:m__show={showMobileSidebar}>
    <Sidebar
        data={spaces}
        on:onNavigate={() => {
            showMobileSidebar = false;
        }} />
</div>
<div class="content">
    <slot />
</div>

<style lang="scss">
.m__header {
    position: sticky;
    width: 100vw;
    top: 70px;
    z-index: 100;
    height: 32px;
    padding-inline: 0.5rem;
    border-bottom: 1px solid var(--grey-lightest);
    background-color: $bg-p;
    background: rgba(var(--bg-rgb), 95%);
}
button.m__sidebar__toggle {
    padding: 0.25rem;
    color: var(--mono);
}

.sidebar {
    position: sticky;
    overflow-y: auto;
    top: 70px;
    height: calc(100vh - 70px);
    border-right: 1px solid $grey-lighter;
    @media screen and (max-width: $mobile) {
        position: fixed;
        left: 0px;
        top: calc(70px + 32px);
        height: calc(100svh - 70px - 32px);
        z-index: 100;
        transform: translateX(-100%);
        background-color: $bg-p;
        max-width: 90vw;
        transition: all 0.3s;
        &.m__show {
            transform: translateX(0%);
        }
    }
}
.content {
    padding-top: 2rem;
    margin-inline: auto;
    width: 100%;
    max-width: min(calc(100vw - 300px), 1300px);
    min-height: calc(100vh - 70px);
    padding-bottom: 100px;
    padding: 2rem;
    @media screen and (max-width: $mobile) {
        width: 100%;
        max-width: none;
        padding-inline: 1rem;
        font-size: 0.875rem;
        padding-top: 1rem;
    }
}
</style>
