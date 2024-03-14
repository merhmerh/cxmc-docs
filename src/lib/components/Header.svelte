<script>
import Icon from "@iconify/svelte";
import Theme from "$comp/Theme.svelte";
import Nav from "./Nav.svelte";
import Auth from "./Auth/HeaderAuth.svelte";
import { isMobile } from "$comp/device.store";
import { Switch } from "merh-forge-ui";
import { fly } from "svelte/transition";
import { beta } from "$routes/main.store";
import { getPermission } from "$comp/supabase.store";

const { role } = getPermission();

let showMobileNav;
</script>

{#if $isMobile && showMobileNav}
    <div class="m__nav" transition:fly>
        <button
            class="icon none close"
            on:click={() => {
                showMobileNav = false;
            }}>
            <Icon icon="material-symbols:close" height="24" />
        </button>
        <Nav
            on:onNavigate={() => {
                showMobileNav = false;
            }} />
    </div>
{/if}

<header>
    <div class="left">
        <a class="logo none" href="/">
            <img src="/logo.svg" alt="" />
            <span>IFC-SG Docs</span>
        </a>
        {#if role !== "beta"}
            <Switch
                bind:isChecked={$beta}
                on:change={() => {
                    localStorage.setItem("beta", $beta.toString());
                }}><strong>Beta</strong></Switch>
        {/if}
    </div>

    <div class="center" />

    <div class="right">
        {#if $isMobile}
            <button
                class="hamburger none icon"
                on:click={() => {
                    showMobileNav = true;
                }}>
                <Icon icon="material-symbols:menu" height="24" />
            </button>
        {:else}
            <Nav />
        {/if}
        <Theme />
        <Auth />
    </div>
</header>

<style lang="scss">
.m__nav {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100svh;
    @include bg-blur;
    z-index: 200;
    display: flex;
    justify-content: center;
    align-items: center;
    button.close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        padding: 1rem;
        color: var(--mono-900);
    }
}

header {
    justify-content: space-between;
    position: sticky;
    top: 0;
    width: 100%;
    padding: 1rem;
    border-bottom: 1px solid $grey-lightest;
    backdrop-filter: blur(8px);
    background: rgba(var(--bg-rgb), 50%);
    z-index: 101;
    height: 70px;
    display: flex;

    .logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: $main;
        text-decoration: none;
        img {
            height: 2rem;
        }
        span {
            font-weight: 600;
            font-size: 1.25rem;
        }
    }
    .left {
        display: flex;
        gap: 2rem;
    }
    .right {
        display: flex;
        justify-content: flex-end;
        width: fit-content;

        .hamburger {
            display: none;
            color: var(--accent-400);
            @media screen and (max-width: $mobile) {
                display: flex;
                width: 36px;
                height: 36px;
            }
        }
    }
}
</style>
