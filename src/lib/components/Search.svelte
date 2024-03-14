<script>
import Icon from '@iconify/svelte';
import { createEventDispatcher } from 'svelte';
import { searchValue } from '$comp/search.store.js';
const dispatch = createEventDispatcher();
let input;
let searchText;
function handleKeydown(e) {
    if (e.code == 'KeyK' && e.ctrlKey) {
        e.preventDefault();
        input.focus();
    }
}

function handleInput() {
    if (!searchText) {
        searchValue.set(0);
    }
}
function reset() {
    searchValue.set(0);
    searchText = '';
}
function search(e) {
    if (e.key == 'Enter') {
        searchValue.set({
            string: searchText,
        });
        input.blur();
    }
}
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="container">
    <div class="icon">
        <Icon icon="akar-icons:search" hFlip={true} height="18" />
    </div>
    <input
        bind:this={input}
        bind:value={searchText}
        on:keydown={search}
        on:input={handleInput}
        type="text"
        placeholder="Search" />
    <div class="kbs">
        {#if searchText}
            <button class="none icon" on:click={reset}>
                <Icon icon="ic:baseline-clear" />
            </button>
        {/if}
        <code>Ctrl</code>
        <code>K</code>
    </div>
</div>

<style lang="scss">
.container {
    display: flex;
    align-items: center;
    border: 1px solid $grey-lighter;
    border-radius: 0.5rem;
    padding-inline: 0.5rem;
    width: 400px;

    .icon {
        @include flex-center;
        color: $main-light;
    }
    &:focus-within {
        border-color: $accent-light;
        background-color: $bg-p;
    }
    input {
        background-color: transparent;
        border: none;
        display: flex;
        align-items: center;
        width: 100%;
        font-size: 0.875rem;
        &:focus {
            outline: none;
        }
    }

    .kbs {
        margin-left: auto;
        display: flex;
        gap: 0.25rem;
        code {
            font-size: 0.75rem;
            background-color: $muted;
            opacity: 0.5;
        }
        .icon {
            color: $accent;
            @include flex-center;
            width: 20px;
            height: 20px;
        }
    }
}
</style>
