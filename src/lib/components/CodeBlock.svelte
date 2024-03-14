<script>
import Icon from "@iconify/svelte";
import { highlightDOMText } from "$fn/helper";
import { notify } from "merh-forge-ui";

let codeElement;
export let showIcon = true;
export let hoverToShowIcon = false;
export let noStyle = false;
export let fontSize = "1rem";
export let invisible = false;
export let flushIconRight = false;
export let iconWidth = 0;
let iconSize = iconWidth ? iconWidth : 12;

if (invisible) {
    noStyle = true;
    flushIconRight = true;
    fontSize = ".875rem";
    hoverToShowIcon = true;

    if (!iconWidth) {
        iconSize = 12;
    } else {
        iconSize = iconWidth;
    }
}

function copy() {
    console.log(codeElement.textContent);
    navigator.clipboard.writeText(codeElement.textContent.trim());
    highlightDOMText(codeElement);
    notify.add("Copied to clipboard", { duration: 1000 });
}
</script>

<button
    class="none"
    on:click={copy}
    style="--font-size:{fontSize}"
    class:flushIconRight
    class:hoverToShowIcon>
    <code bind:this={codeElement} class:noStyle>
        <div class="text">
            <slot />
        </div>
        {#if showIcon}
            <div class="icon" class:colorGrey={noStyle}>
                <Icon icon="charm:copy" width={iconSize} hFlip={true} />
            </div>
        {/if}
    </code>
</button>

<style lang="scss">
button.none {
    padding: 0;
    background-color: transparent;
    &:hover {
        outline: 0;
        box-shadow: none;
    }
    &:focus-visible {
        outline: none !important;
    }
    &.flushIconRight {
        width: 100%;
        code {
            justify-content: space-between;
        }
    }
    &.hoverToShowIcon {
        code .icon {
            opacity: 0;
            transition: all 0.25s;
        }
        &:hover {
            code .icon {
                opacity: 1;
            }
        }
    }
    code {
        display: flex;
        gap: 0.325rem;
        font-size: var(--font-size);
        width: 100%;
        div.text {
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
        .icon {
            color: var(--accent-100);
            &.colorGrey {
                color: var(--mono-300);
            }
        }
        &.noStyle {
            background-color: transparent;
            padding: 0;
            font-family: inherit;
            &:hover {
                background-color: transparent;
                box-shadow: 0;
                color: var(--url);
            }
        }
    }
}
</style>
