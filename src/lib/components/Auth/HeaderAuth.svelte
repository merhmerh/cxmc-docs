<script>
import Icon from "@iconify/svelte";
import { supabase, session } from "$comp/supabase.store.js";
import Auth from "$comp/Auth/Auth.svelte";
import { tick } from "svelte";
import { goto } from "$app/navigation";

import { Modal } from "merh-forge-ui";
let showOptions, showLogin, awaitingVerification, usePassword;

async function signOut() {
    showOptions = false;
    const { error } = await $supabase.auth.signOut();
    $session = null;
    goto("/login");
}
</script>

<div class="auth none">
    <button
        class="none user"
        class:showName={$session && $session.user.email}
        on:click={() => {
            showOptions = !showOptions;
        }}>
        {#if !$session}
            <Icon icon="ph:user" width="24" />
        {:else}
            {$session.user.email.charAt(0).toUpperCase()}
        {/if}
    </button>

    {#if showOptions}
        <div class="dropdown">
            {#if !$session}
                <button
                    class="none"
                    on:click={async () => {
                        showLogin = true;
                        usePassword = false;
                        awaitingVerification = false;
                        showOptions = false;
                        await tick();
                    }}>
                    <Icon icon="material-symbols:login" width="24" />
                    <span>Sign In</span>
                </button>
            {:else}
                <button class="none" on:click={signOut}>
                    <Icon icon="material-symbols:login" width="24" />
                    <span>Sign Out</span>
                </button>
            {/if}
        </div>
    {/if}
</div>

{#if showLogin}
    <Modal
        show="true"
        on:close={() => {
            showLogin = false;
        }}>
        <div class="modal__content">
            <Auth
                on:success={() => {
                    showLogin = false;
                }} />
        </div>
    </Modal>
{/if}

<style lang="scss">
.auth {
    @include flex-center;
    width: 36px;
    height: 36px;
    color: $main-light;
    position: relative;
    .user {
        &:hover {
            color: $main;
            border-color: $main;
        }
        &.showName {
            font-size: 14px;
            background-color: $accent-alt;
            color: $main-alt;
            line-height: 24px;
            border: 0;
        }
    }
    .user {
        width: 24px;
        height: 24px;
        border-radius: 100%;
        border: 2px solid $main-light;
        @include flex-center;
    }
    .dropdown {
        background-color: $bg-p;
        position: absolute;
        width: 150px;
        border: 1px solid $grey-lighter;
        border-radius: 0.5rem;
        right: 0;
        top: 100%;
        display: grid;
        gap: 0.25rem;
        overflow: hidden;
        button {
            width: 100%;
            font-weight: 400;
            display: flex;
            padding: 0.5rem 0.75rem;
            gap: 0.75rem;
            align-items: center;
            color: $main;
            font-size: 0.875rem;
            text-decoration: none;
            justify-content: flex-start;
            gap: 1rem;
            :global(svg) {
                color: $main-light;
            }

            &:hover {
                text-decoration: none;
                background-color: $bg-alt;
            }
        }
    }
}
.modal__content {
    width: 400px;
    display: grid;
    gap: 1rem;
}
</style>
