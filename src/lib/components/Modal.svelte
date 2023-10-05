<script>
import Icon from "@iconify/svelte";
import { createEventDispatcher, onMount } from "svelte";
let modal;
let ready;
export let showModal = false;
export let closeButton = true;
export let closePosition = "modal";
export let modalPosition = "center";
export let escape = true;
export let exitOutsideClick = true;
export let exitWithEscapeKey = true;
export let modalStyle = true;

const dispatch = createEventDispatcher();

onMount(() => {
    if (!modal) return;
    document.body.style.overflowY = "hidden";
    const nodes = modal.querySelectorAll("*");
    const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0);
    for (const el of tabbable) {
        if (el.classList.contains("modal_close")) continue;
        el.focus();
        break;
    }
    ready = true;

    return () => {
        document.body.style.overflowY = "auto";
    };
});

function clickOutside() {
    if (!exitOutsideClick) {
        return;
    }
    close();
}

function handle_keydown(e) {
    if (!modal) return;

    if (!escape) {
        return;
    }
    if (e.key === "Escape") {
        if (exitWithEscapeKey) {
            return close();
        }
    }

    if (e.key === "Tab") {
        const nodes = modal.querySelectorAll("*");
        const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0);

        let index = tabbable.indexOf(document.activeElement);
        if (index === -1 && e.shiftKey) index = 0;

        index += tabbable.length + (e.shiftKey ? -1 : 1);
        index %= tabbable.length;

        tabbable[index].focus();
        e.preventDefault();
    }
}

function closeFromChild() {
    close();
}

function closeModal() {
    close();
}

export function show() {
    open();
}

export function hide() {
    close();
}

export function open() {
    showModal = true;
    document.body.style.overflowY = "hidden";
}

export function close() {
    showModal = false;
    document.body.style.overflowY = "auto";

    dispatch("close");
}
</script>

<svelte:window on:keydown={handle_keydown} />
{#if showModal}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div aria-modal="true" class="modal_background" on:click|self={clickOutside} bind:this={modal}>
        {#if closeButton}
            {#if closePosition == "background"}
                <button class="modal_close topright" on:click={close}>
                    <Icon icon="material-symbols:close" width="42" inline={true} />
                </button>
            {/if}
        {/if}
        <div class="modal" modal_position={modalPosition} class:noStyle={!modalStyle} role="dialog" aria-modal="true">
            {#if closeButton}
                {#if closePosition == "modal"}
                    <button class="modal_close" on:click={close}>
                        <Icon icon="material-symbols:close" width="24" inline={true} />
                    </button>
                {/if}
            {/if}
            <div class:slot={modalStyle}>
                <slot {closeFromChild} {closeModal} />
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
.modal_background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    background: color-mix(in srgb, var(--mono-100) 75%, transparent);
    backdrop-filter: blur(4px);
}

button {
    background-color: transparent !important;
    border: none;
    outline: none;
    color: var(--main);
}

.modal_close {
    position: absolute;
    top: 0rem;
    right: 0rem;
    cursor: pointer;
    display: flex;
    height: 36px;
    width: 36px;
    margin: 0.5rem;
    padding: 0.5rem;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    :global(svg) {
        flex-shrink: 0;
    }
    &:hover {
        background-color: var(--mono-500);
    }
    &.topright {
        margin: 1.5rem;
        width: 42px;
        height: 42px;
    }
}

.modal {
    z-index: 101;
    position: absolute;
    overflow: auto;
    max-height: calc(100vh - 4em);
    min-width: 250px;
    width: fit-content;
    max-width: 80vw;
    background-color: var(--background-primary);
    border-radius: 1rem;
    &.noStyle {
        padding: 1rem;
    }
    &[modal_position="top"] {
        top: 5rem;
    }
    .slot {
        min-width: 250px;
        min-height: 100px;
        padding: 2rem;
    }
}
</style>
