<script>
import Sidebar from "./Sidebar.svelte";
import { isMobile } from "$comp/device.store";
import Icon from "@iconify/svelte";
import { page } from "$app/stores";
import { goto } from "$app/navigation";
import Image from "../../Image.svelte";

let showMobileSidebar;

export let data;
// console.log(data);

const selectItems = [...new Set(data.areaNames.map((x) => x[2]))];
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

<div class="aside" class:m__show={showMobileSidebar}>
    <Sidebar
        data={selectItems}
        on:onNavigate={(e) => {
            showMobileSidebar = false;
            const q = encodeURIComponent(e.detail.trim());
            const url = $page.url.origin + $page.url.pathname + `?q=${q}`;
            goto(url);
        }} />
</div>

<div class="content area-requirements">
    {#each data.pageContent.content as { type, content }}
        {#if type == "section"}
            <h2>{content}</h2>
        {/if}

        {#if type == "paragraph"}
            <div class="paragraph">
                <p>{content}</p>
            </div>
        {/if}

        {#if type == "images"}
            <div class="image_container {content.length == 1 ? 'single' : ''}">
                {#each content as image}
                    <Image src={image} />
                {/each}
            </div>
        {/if}
    {/each}

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
    button.m__sidebar__toggle {
        padding: 0.25rem;
        color: var(--mono);
    }
}

.aside {
    position: sticky;
    top: 70px;
    height: calc(100svh - 70px);
    overflow-y: auto;
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
    padding-block: 2rem;
    margin-inline: auto;
    width: 100%;
    max-width: min(calc(100vw - 300px - 6px), 1400px);
    min-height: calc(100svh - 70px);
    padding-bottom: 100px;
    padding-inline: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    @media screen and (max-width: $mobile) {
        width: 100%;
        max-width: none;
        padding-inline: 1rem;
        font-size: 0.875rem;
        padding-top: 1rem;
    }
}
</style>
