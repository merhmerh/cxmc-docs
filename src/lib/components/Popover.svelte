<script>
import { tick } from "svelte";

export let position = "auto";

let showPopup, button, popup;
let scrollTop;

$: showPopup, onShowPopup();

async function onShowPopup() {
    if (!showPopup) return;
    await tick();
    scrollTop = window.scrollY;

    if (position == "auto" && popup) {
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;

        const buttonBoundingBox = button.getBoundingClientRect();
        const button_top = buttonBoundingBox.top;
        const button_left = buttonBoundingBox.left;
        const button_right = buttonBoundingBox.right;
        const button_width = buttonBoundingBox.width;
        const button_height = buttonBoundingBox.height;

        let popup_dim = popup.getBoundingClientRect();

        popup.style.top = button_top + button_height + "px";
        popup.style.left = button_left - popup_dim.width / 2 + button_width / 2 + "px";

        popup_dim = popup.getBoundingClientRect();

        if (popup_dim.left + popup_dim.width > windowWidth - 32) {
            popup.style.left = button_right - popup_dim.width + "px";
        }
        if (popup_dim.left < 0) {
            popup.style.left = button_left + "px";
        }
        if (popup_dim.bottom > windowHeight) {
            popup.style.top = button_top - popup_dim.height + "px";
        }
    }
}

function scroll(e) {
    if (showPopup) {
        window.scrollTo(0, scrollTop);
    }
}
</script>

<svelte:window on:scroll={scroll} />

{#if showPopup}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        class="background"
        on:click={() => {
            showPopup = false;
        }}>
    </div>
{/if}

<div class="popover">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        bind:this={button}
        class="button"
        on:click={() => {
            showPopup = true;
        }}>
        <slot name="button" />
    </div>
    {#if showPopup}
        <div
            bind:this={popup}
            class="popup"
            class:auto={position == "auto"}
            class:bottom-left={position == "bottom-left"}
            class:bottom-right={position == "bottom-right"}
            class:bottom-center={position == "bottom-center"}
            class:top-left={position == "top-left"}
            class:top-right={position == "top-right"}
            class:top-center={position == "top-center"}>
            <slot name="popup" />
        </div>
    {/if}
</div>

<style lang="scss">
.background {
    background-color: transparent;
    // background-color: beige;
    // opacity: 0.05;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}
.button {
    padding: 0 !important;
}
.popup {
    z-index: 1001;
    position: fixed;
    width: fit-content;
    left: 0;
    top: 0;
    padding: 0 !important;
    &.auto {
        // left: 50%;
        // transform: translateX(-50%);
    }
    &.bottom-left {
        top: calc(100% + 8px);
        left: 0;
    }
    &.bottom-right {
        right: 0;
        top: calc(100% + 8px);
    }
    &.bottom-center {
        left: 50%;
        transform: translateX(-50%);
        top: calc(100% + 8px);
    }
    &.top-center {
        left: 50%;
        transform: translateX(-50%);
        bottom: calc(100% + 8px);
    }
    &.top-left {
        left: 0%;
        bottom: calc(100% + 8px);
    }
    &.top-right {
        right: 0%;
        bottom: calc(100% + 8px);
    }
}
</style>
