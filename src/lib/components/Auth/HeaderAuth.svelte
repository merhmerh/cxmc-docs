<script>
import Icon from "@iconify/svelte";
import { supabase, session } from "$comp/supabase.store.js";
import Auth from "$comp/Auth/Auth.svelte";
import { onMount, tick } from "svelte";
import { goto } from "$app/navigation";

import { Modal, notify } from "merh-forge-ui";
let showOptions, passwordModal, revealPassword, passwordField;

async function signOut() {
    showOptions = false;
    const { error } = await $supabase.auth.signOut();
    $session = null;
    goto("/login");
}

async function setPassword() {
    const resp = await fetch("/api/auth/update-password", {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ password: passwordField.value }),
    });

    const result = await resp.json();

    if (result.error) {
        //
        return;
    }

    notify.add("Password Updated");
    passwordField = null;
    revealPassword = false;
    showOptions = false;
    passwordModal.close();
}
</script>

<Modal bind:this={passwordModal} exitOutsideClick={false}>
    <div class="modal">
        <h3>Update Password</h3>
        <span style="font-size:0.875rem;"
            >This website implements passwordless sign-in. Setting a password is not mandatory unless you encounter
            difficulties in receiving the verification link sent to your email during the sign-in process.</span>
        <div class="inputBox">
            <input type={revealPassword ? "text" : "password"} placeholder="Enter Password" bind:this={passwordField} />
            <button
                class="none icon"
                on:click={() => {
                    revealPassword = !revealPassword;
                }}>
                {#if revealPassword}
                    <Icon icon="mdi:hide" />
                {:else}
                    <Icon icon="mdi:show" />
                {/if}
            </button>
        </div>
        <div class="buttonGroup">
            <button class="alt" on:click={() => setPassword()}>Save</button>
            <button
                on:click={() => {
                    showOptions = false;
                    passwordModal.close();
                }}>Cancel</button>
        </div>
    </div>
</Modal>

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
            <button
                class="none"
                on:click={() => {
                    passwordModal.show();
                }}>
                <Icon icon="ph:password" width="24" />
                <span>Update Password</span>
            </button>

            <button class="none" on:click={signOut}>
                <Icon icon="material-symbols:login" width="24" />
                <span>Sign Out</span>
            </button>
        </div>
    {/if}
</div>

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
        border: 1px solid $grey-lighter;
        border-radius: 0.5rem;
        right: 0;
        top: 100%;
        display: grid;
        gap: 0.25rem;
        overflow: hidden;
        width: max-content;
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
.modal {
    width: 350px;
    display: grid;
    gap: 1rem;
    @media screen and (max-width: $mobile) {
        width: 100%;
    }
    .inputBox {
        input {
            width: 100%;
        }
    }
}
</style>
