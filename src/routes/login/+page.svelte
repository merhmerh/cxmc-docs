<script>
import Login from "$comp/Auth/Auth.svelte";
import { Modal, notify } from "merh-forge-ui";
import { isValidEmail } from "$fn/helper";
import Theme from "$comp/Theme.svelte";
import { Notify } from "merh-forge-ui";
// import Modal from "$comp/Modal.svelte";

import { onMount } from "svelte";

let modal,
    ready,
    showRequestAccess = true;
let requestEmail, requestInfo, requestError, infoBox;

async function sendRequest() {
    if (!requestEmail) {
        return (requestError = "Email is required");
    }

    if (!isValidEmail(requestEmail)) {
        return (requestError = `"${requestEmail}" is an invalid Email address`);
    }

    const resp = await fetch(`/api/auth/request-access?email=${requestEmail}&info=${requestInfo}`);
    const result = await resp.json();
    if (result.error) {
        return (requestError = result.error.message);
    }
    console.log(result);
    notify.add("Your request has been submitted");
    infoBox = "Your request has been received, and you will be sent an invitation email once it has been approved.";
    modal.close();
}

onMount(() => {
    ready = true;
});
</script>

<Notify></Notify>
<Modal exitOutsideClick={false} bind:this={modal} let:closeModal>
    <div class="modal">
        <h2>Request Access</h2>

        <input
            type="text"
            placeholder="Email address"
            bind:value={requestEmail}
            class:error={requestError}
            on:input={() => {
                requestError = false;
            }} />
        <textarea placeholder="Enter your information" bind:value={requestInfo} />
        {#if requestError}
            <span class="error">{requestError}</span>
        {/if}
        <div class="buttonGroup">
            <button class="alt" on:click={sendRequest}>Send</button>
            <button on:click={closeModal}>Cancel</button>
        </div>
    </div>
</Modal>
<main>
    <div class="header">
        {#if ready}
            <Theme />
        {/if}
    </div>

    <div class="login">
        <div class="logo">
            <img src="/logo.svg" alt="Logo" />
            <h3>CX-MC Documentation</h3>
        </div>
        {#if infoBox}
            <div class="infoBox">{infoBox}</div>
        {/if}
        <Login
            on:continueWithEmail={() => {
                showRequestAccess = false;
            }} />
        {#if showRequestAccess}
            <button
                class="none noHover"
                on:click={() => {
                    modal.show();
                }}>
                Request access
            </button>
        {/if}
    </div>
</main>

<style lang="scss">
main {
    height: calc(100svh);
    .header {
        display: flex;
        justify-content: flex-end;
        padding: 1rem;
    }
    .login {
        width: 400px;
        display: flex;
        // justify-content: center;
        flex-direction: column;
        margin-top: 100px;
        margin-inline: auto;

        @media screen and (max-width: $mobile) {
            width: 80%;
            margin-top: 0;
        }

        button {
            margin-top: 0.5rem;
            width: fit-content;
            height: fit-content;
            font-size: 0.875rem;
            padding: 0;
            color: $url;
            &:hover {
                text-decoration: underline !important;
            }
        }
        .logo {
            display: flex;
            justify-content: center;
            margin-bottom: 3rem;
            gap: 1rem;
            align-items: center;
            &:hover {
                img {
                    transform: scale(1.25) rotateZ(90deg);
                }
            }
            img {
                transition: all cubic-bezier(0.39, 0.575, 0.565, 1) 0.25s;
                height: 3rem;
            }
        }
        .infoBox {
            padding: 1rem;
            background-color: $bg-alt;
            border-radius: 0.25rem;
            margin-bottom: 1rem;
            margin-top: -2rem;
        }
    }
}

.modal {
    width: 350px;
    @media screen and (max-width: $mobile) {
        width: 100%;
    }
    .buttonGroup {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-end;
        gap: 0.5rem;
        button {
            width: 80px;
        }
    }
}
</style>
