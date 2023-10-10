<script>
import Icon from "@iconify/svelte";
import { supabase, session } from "$comp/supabase.store.js";
import { PUBLIC_APP_URL, PUBLIC_DEV_URL } from "$env/static/public";
import { goto } from "$app/navigation";
import { timeout } from "$fn/helper";
import { dev } from "$app/environment";
import { page } from "$app/stores";
import { createEventDispatcher, onMount } from "svelte";
let emailfield,
    email,
    password,
    awaitingVerification,
    errorMessage,
    usePassword,
    awaiting,
    otpToken = "",
    useOTP;

const dispatch = createEventDispatcher();
const redirect = (() => {
    let redirectPath = $page.url.searchParams.get("redirect") || $page.url.pathname.replace("/", "");
    if (redirectPath == "login") {
        redirectPath = "";
    }
    return `/${redirectPath}`;
})();

async function signInWithMagicLink() {
    dispatch("continueWithEmail");
    if (!email) {
        errorMessage = "Email is required";
        return;
    }

    awaiting = true;
    let redirectURL = dev ? PUBLIC_DEV_URL : PUBLIC_APP_URL;
    redirectURL = redirectURL + "/email-confirmed";

    const { data, error } = await $supabase.auth.signInWithOtp({
        email: email,
        options: {
            emailRedirectTo: redirectURL,
            shouldCreateUser: false,
        },
    });

    await timeout(300);
    awaiting = false;

    if (error) {
        if (error.status == "429") {
            errorMessage = "Request Limit Exceeded, Please try again in 60 seconds";
        } else if (error.status == "400") {
            errorMessage = "There is no account associated with this email address";
        } else {
            console.log(error.message);
        }
        return;
    }

    awaitingVerification = true;
    errorMessage = null;

    console.log("?hello!!");
}

async function signInWithEmail() {
    if (!email) {
        errorMessage = "Email is required";
        return;
    }
    if (!password) {
        errorMessage = "Password is required";
        return;
    }
    awaiting = true;

    const { data, error } = await $supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    awaiting = false;
    if (error) {
        console.log(error.status, error.message);
        errorMessage = error.message;
    }

    if (!error) {
        $session = data.session;
    }
}

async function logInWithOTP() {
    awaiting = true;

    const { data, error } = await $supabase.auth.verifyOtp({ email, token: otpToken, type: "email" });

    await timeout(500);

    awaiting = false;
    if (error) {
        if (error.status == 401) {
            console.log(error.message);
            errorMessage = "The OTP you've entered has expired or is invalid";
        } else {
            console.log(error.status, error.message);
            errorMessage = error.message;
        }
        return;
    }

    if (!error) {
        $session = data.session;
    }
}

$: $session,
    (() => {
        if ($session) {
            dispatch("success");
            console.log("redirect to", redirect);
            goto(redirect);
        }
    })();

onMount(() => {
    $supabase.auth.onAuthStateChange((event, authSession) => {
        $session = authSession;
    });
});
</script>

<div class="auth">
    {#if !awaitingVerification}
        <h2>Log in</h2>
        {#if errorMessage}
            <div class="errorMessage">
                {errorMessage}
            </div>
        {/if}

        {#if usePassword}
            <input
                bind:this={emailfield}
                name="email"
                type="text"
                autocomplete="on"
                placeholder="Email Address"
                bind:value={email}
                on:keydown={(e) => {
                    if (e.key == "Enter") {
                        signInWithEmail();
                    }
                }} />
            <input
                type="password"
                name="password"
                placeholder="Password"
                bind:value={password}
                on:keydown={(e) => {
                    if (e.key == "Enter") {
                        signInWithEmail();
                    }
                }} />

            <button class="alt buttonWithIcon" on:click={signInWithEmail}>
                <div class="icon">
                    {#if !awaiting}
                        <Icon icon="carbon:email" width="20" />
                    {:else}
                        <Icon icon="line-md:loading-twotone-loop" width="20" />
                    {/if}
                </div>
                <span>Log in</span>
            </button>
            <button
                class="link"
                on:click={() => {
                    usePassword = false;
                }}>Use token</button>
        {:else}
            <input
                bind:this={emailfield}
                name="email"
                type="text"
                placeholder="Email Address"
                bind:value={email}
                on:keydown={(e) => {
                    if (e.key == "Enter") {
                        signInWithMagicLink();
                    }
                }} />

            <button class="alt buttonWithIcon" disabled={awaiting} on:click={signInWithMagicLink}>
                <div class="icon">
                    {#if !awaiting}
                        <Icon icon="carbon:email" width="20" />
                    {:else}
                        <Icon icon="line-md:loading-twotone-loop" width="20" />
                    {/if}
                </div>
                <span>Continue With Email</span>
            </button>
            <button
                class="link"
                on:click={() => {
                    usePassword = true;
                }}>Use password</button>
        {/if}
    {:else}
        <h2>Email Verification</h2>

        <p>Keep this window open and in a new tab open the link we just sent to <strong>{email}</strong>.</p>

        <p class="inline">
            If you are unable to open the link on the same browser, <button
                class="none link"
                on:click={() => {
                    useOTP = true;
                }}>click here</button> to enter the OTP we sent to your email.
        </p>

        {#if useOTP}
            <div class="OTP" class:placeholder={!otpToken.length}>
                <input
                    type="text"
                    class="otp"
                    bind:value={otpToken}
                    on:input={(e) => {
                        if (otpToken.length > 6) {
                            otpToken = otpToken.slice(0, 6);
                        }
                        otpToken = otpToken.trim();
                        if (otpToken.length == 6) {
                            logInWithOTP();
                        }
                    }} />
            </div>
            {#if errorMessage}
                <div class="errorMessage">
                    {errorMessage}
                </div>
            {/if}
            <button class="alt buttonWithIcon" on:click={logInWithOTP} disabled={awaiting}>
                <div class="icon">
                    {#if !awaiting}
                        <!-- <Icon icon="mdi:shield-key" width="20" /> -->
                    {:else}
                        <Icon icon="line-md:loading-twotone-loop" width="20" />
                    {/if}
                </div>
                <span> Verify</span>
            </button>
        {/if}
    {/if}
</div>

<style lang="scss">
.auth {
    // width: 400px;
    width: 100%;
    display: flex;
    height: fit-content;
    flex-direction: column;
    gap: 1rem;
    @media screen and (max-width: $mobile) {
        width: 100%;
    }
    h2 {
        margin-top: 0;
    }
    .errorMessage {
        background-color: rgba($red, 0.75);
        padding: 1rem;
        color: $main-alt;
        font-size: 0.875rem;
        font-weight: 300;
        border-radius: 0.5rem;
    }
    input {
        width: 100%;
        padding-block: 0.75rem;
        border-radius: 0.5rem;
    }
    button {
        &:not(.link) {
            padding-block: 0.75rem;
        }
        &.buttonWithIcon {
            display: flex;
            justify-content: flex-start;

            .icon {
                width: 40px;
                display: flex;
                justify-content: flex-start;
            }
            span {
                @include flex-center;
                width: 100%;
                margin-left: -40px;
            }
        }
    }
    button.link {
        font-size: 0.875rem;
    }
    .inline {
        margin-top: 0;
        display: inline;
        color: var(--mono-400);
        button {
            display: inline;
            padding: 0;
            font-size: 1rem;
        }
    }
    .OTP {
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        input {
            padding-block: 0.5rem !important;
            letter-spacing: 8px;
            font-size: 1.25rem;
            text-align: center;
        }
        &.placeholder {
            &::after {
                color: var(--mono-400);
                content: "Enter OTP";
                position: absolute;
                pointer-events: none;
            }
        }
    }
}
</style>
