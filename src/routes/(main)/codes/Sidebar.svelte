<script>
import { rules } from "./rules.store";
import { isMobile } from "$comp/device.store";
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { replaceSpaceWithDash, debounce, escapeRegex } from "$fn/helper";
import { createEventDispatcher } from "svelte";

const dispatch = createEventDispatcher();

let input, searchString, list, agencies;

$: $rules, resetList();

function resetList() {
    list = [...new Set($rules.map((x) => x.agency.toLowerCase()))];
}

function filter() {
    if (!searchString) {
        resetList();
        return;
    }
    const regex = new RegExp(escapeRegex(searchString), "i");

    list = list.filter((x) => regex.test(x));

    if (list.length == 0) {
        console.log("no result found");
        return;
    }

    list = list;

    if ($isMobile) return;
    search(`/codes/${replaceSpaceWithDash(list[0])}`);
}

const search = debounce(updateURL, 300);

function updateURL(url) {
    goto(url, {
        keepFocus: true,
    });
}

function handleKeyDown(e) {
    if (e.ctrlKey && e.code == "KeyE") {
        e.preventDefault();
        input.focus();
        if (input.value) {
            input.select();
        }
    }
}
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="container">
    <div class="inputBox">
        <input
            class="placeholder-smaller"
            type="search"
            spellcheck="false"
            bind:this={input}
            bind:value={searchString}
            on:input={filter}
            on:keydown={(e) => {
                if (e.key == "Enter" && $isMobile) {
                    filter();
                }
            }}
            placeholder="Agency" />
        <div class="kbs">
            <code>Ctrl</code>
            <code>E</code>
        </div>
    </div>
    {#if list}
        <div class="scrollable">
            {#each list as agency}
                <div class="item">
                    <a
                        href="/codes/{agency}"
                        class:selected={$page.params.agency == agency}
                        on:click={() => {
                            dispatch("onNavigate");
                        }}>
                        <span>{agency.toUpperCase()}</span>
                    </a>
                </div>
            {/each}
            {#if list.length == 0}
                <span class="no_result">No result found for '{searchString}'</span>
            {/if}
        </div>
    {/if}
</div>

<style lang="scss">
.container {
    display: flex;
    flex-direction: column;
    padding-top: 1rem;
    height: 100%;
    padding-inline: 1rem 0.5rem;
    .inputBox {
        display: grid;
        grid-template-columns: auto auto;
        width: 100%;
        margin-block: 0.5rem;
        input {
            min-width: 0;
            padding-right: 0;
        }
    }
    .scrollable {
        // padding-right: 0.5rem;
        // scrollbar-gutter: stable;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding-bottom: 6rem;
        gap: 0.5rem;
        a {
            font-size: 1rem;
            justify-content: space-between;
            align-items: center;
            display: flex;
            padding: 0.5rem;
            text-decoration: none;
            color: var(--main);
            transition: all 0.3s;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            background-color: var(--bg-s);
            &:hover {
                color: $url;
            }
            &:hover {
                background-color: $bg-alt;
            }

            &.selected {
                background-color: var(--accent);
                color: var(--main-alt);
            }
        }
    }
}

.no_result {
    font-size: 0.875rem;
    padding: 0.5rem 0rem;
    border-radius: 0.25rem;
}
</style>
