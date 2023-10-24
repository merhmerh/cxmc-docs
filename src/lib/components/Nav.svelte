<script>
import { page } from "$app/stores";
import { createEventDispatcher, onMount } from "svelte";

const dispatch = createEventDispatcher();

const navList = [
    { href: "/ifcsg", name: "IFC SG" },
    { href: "/spacename/all-spaces", name: "SpaceName" },
    { href: "/occupancy-type", name: "OccupancyType" },
    { href: "/area-requirements", name: "Area Requirements" },
    { href: "/identified-component", name: "Identified Component" },
    { href: "/codes/bca", name: "Codes" },
];
</script>

<nav>
    {#each navList as link}
        <a
            href={link.href}
            class:selected={$page.url.pathname.match(link.href)}
            on:click={() => {
                dispatch("onNavigate");
            }}>{link.name}</a>
    {/each}
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
