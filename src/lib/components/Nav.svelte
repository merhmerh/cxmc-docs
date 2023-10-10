<script>
import { page } from "$app/stores";
import { createEventDispatcher, onMount } from "svelte";

const dispatch = createEventDispatcher();

const navList = [
    { href: "/ifcsg", name: "IFC SG" },
    { href: "/spacename/all-spaces", name: "SpaceName" },
    { href: "/area-requirement", name: "Area Requirement" },
    { href: "/mg", name: "Modelling Guide" },
];
</script>

<nav>
    {#each navList as link}
        <a
            href={link.href}
            class:selected={$page.url.pathname == link.href}
            on:click={() => {
                dispatch("onNavigate");
            }}>{link.name}</a>
    {/each}

    <!-- <a href="/psets" class:selected={$page.url.pathname == '/psets'}>Psets</a> -->
    <!-- <a href="/spacename/all-spaces" class:selected={$page.url.pathname == "/spacename/all-spaces"}>SpaceName</a> -->
    <!-- <a href="/area-gfa" class:selected={$page.url.pathname == "/area-gfa"}>Area GFA</a> -->
    <!-- <a href="/modellingguide" class:selected={$page.url.pathname == "/modellingguide"}>ModellingGuide</a> -->
</nav>

<style lang="scss">
nav {
    display: flex;
    margin-right: 3rem;
    gap: 2rem;
    align-items: center;
    position: relative;

    @media screen and (max-width: $mobile) {
        flex-direction: column;
    }
    a {
        flex-shrink: 0;
        width: fit-content;
        color: $grey;
        text-decoration: none;
        font-weight: 400;
        &.selected {
            color: $url;
        }
    }
}
</style>
