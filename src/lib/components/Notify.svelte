<script>
import { fly, fade } from "svelte/transition";
import { theme } from "$comp/theme.store";
import Icon from "@iconify/svelte";
import { onMount, afterUpdate } from "svelte";

let show = false;
let message = "";
let type = "";
let icon;
let animationDuration;
let timeout;

function close() {
    show = false;
    message = null;
    type = null;
}

function notify(notify_type, string, duration) {
    type = notify_type;
    if (show) {
        return;
    }

    if (!duration) {
        duration = 5000;
    }
    animationDuration = duration + "ms";
    timeout = duration;

    show = true;
    message = string;
    setTimeout(() => {
        show = false;
    }, timeout);
}

afterUpdate(() => {});

export function error(string, duration) {
    notify("error", string, duration);
    icon = "material-symbols:warning-rounded";
}

export function success(string, duration) {
    notify("success", string, duration);
    icon = "mdi:success-circle";
}

export function alert(string, duration) {
    notify("alert", string, duration);
    icon = "mdi:warning-circle";
}
</script>

{#if show}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="container {$theme} {type}" in:fly|global={{ y: -50 }} out:fade|global on:click={close}>
        <div class="timing" style="animation-duration:{animationDuration}" />
        <div class="icon">
            <Icon {icon} width="48" />
        </div>
        <div class="message">
            <div class="title">{type}</div>
            <div class="message">{@html message}</div>
        </div>

        <div class="bg" />
    </div>
{/if}

<style lang="scss">
.container {
    position: fixed;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    color: $main;
    padding: 1rem;
    border-radius: 0.5rem;
    min-width: 400px;
    overflow: hidden;
    background-color: $bg-p;
    cursor: pointer;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    gap: 1rem;
    @media screen and (max-width: $mobile) {
        width: calc(100% - 2rem);
        min-width: 0;
    }
    .timing {
        position: absolute;
        top: 0;
        left: 0;
        transform: translateX(-100%);
        height: 4px;
        width: 100%;
        animation: slideRight linear;
        animation-delay: 50ms;
        animation-fill-mode: forwards;
        @keyframes slideRight {
            0% {
                transform: translateX(-100%);
            }
            100% {
                transform: translateX(0%);
            }
        }
    }
    .title {
        font-size: 1.375rem;
        text-transform: uppercase;
        font-weight: 700;
    }
    .message {
        font-size: 0.875rem;
        color: inherit;
        & :global(a) {
            color: inherit;
            font-weight: 500;
            text-decoration: underline;
        }
    }
    .bg {
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #dff8d3;
        opacity: 1;
    }
}

.container {
    &.success {
        &.light {
            color: #117111;
            .timing {
                background-color: #117111;
            }
            .bg {
                background-color: #cdf9cd;
            }
        }
        &.dark {
            color: darkgreen;
            .timing {
                background-color: darkgreen;
            }
            .bg {
                background-color: #b4dca6;
            }
        }
    }

    &.error {
        &.light,
        &.dark {
            color: #b52d2f;
            .timing {
                background-color: #b52d2f;
            }
            .bg {
                // background-color: #ffd5d3;
                background-color: #eab8b8;
            }
        }
    }

    &.alert {
        &.dark,
        &.light {
            color: #c26700;
            .timing {
                background-color: #d3750a;
            }
            .bg {
                background-color: #f0d1ad;
            }
        }
    }
}
</style>
