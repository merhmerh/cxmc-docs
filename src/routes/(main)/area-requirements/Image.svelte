<script>
import Icon from "@iconify/svelte";
import { Modal } from "merh-forge-ui";
import { isMobile } from "$comp/device.store";
export let src;
let modal;
</script>

<Modal bind:this={modal}>
    <div class="modal">
        <img {src} alt="" />
    </div>
</Modal>

<div class="container">
    <div class="img-container">
        <img {src} alt="" />
        {#if !$isMobile}
            <button
                class="overlay none"
                on:click={() => {
                    modal.show();
                }}>
                <div class="icon">
                    <Icon icon="teenyicons:zoom-in-outline" height="64" />
                </div>
            </button>
            <span>
                <div class="icon">
                    <Icon icon="ph:magnifying-glass-plus-bold" />
                </div>
                Click to enlarge</span>
        {/if}
    </div>
</div>

<style lang="scss">
.container {
    display: flex;
    flex-direction: column;
    .img-container {
        // max-height: 450px;
        width: 100%;
        overflow: hidden;
        border-radius: 0.25rem;
        display: flex;
        position: relative;
        background-color: #fff;
        img {
            width: 100%;
            max-height: 450px;
            object-fit: contain;
            transition: all 1s;
        }
        &:hover {
            button {
                opacity: 1;
            }
        }
        button {
            transition: all 0.3s;
            opacity: 0;
            position: absolute;
            width: 100%;
            height: 100%;
            padding: 3rem;
            border-radius: 1rem;
            background-color: color-mix(in srgb, var(--mono) 24%, transparent);
        }
        span {
            position: absolute;
            font-size: 14px;
            text-align: center;
            bottom: 1rem;
            left: 50%;
            border-radius: 0.25rem;
            background-color: color-mix(in srgb, var(--mono) 24%, transparent);
            padding: 0.25rem;
            transform: translateX(-50%);
            display: flex;
            gap: 0.25rem;
            color: #242424 !important;
        }
    }
}

.modal {
    width: 1000px;
    height: calc(100svh - 4rem);
    max-height: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: $mobile) {
        width: 100%;
        height: 100svh;
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}
</style>
