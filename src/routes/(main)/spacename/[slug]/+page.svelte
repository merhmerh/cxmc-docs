<script>
export let data;
import Icon from "@iconify/svelte";
import spacesDictionary from "./spacesDictionary.json";
import { theme } from "$comp/theme.store";
import { timeout } from "$fn/helper";
import { Tooltip, WaterfallSingle, dictionary, Modal } from "merh-forge-ui";
import { notify } from "merh-forge-ui";

dictionary.set(spacesDictionary);

let searchbar;
let spaces, modal, clipboard;
$: data.spaces, onDataChange();

function onDataChange() {
    spaces = data.spaces;
}

function filter(e) {
    const searchValue = e.target.value;
    resetFilter();
    if (!searchValue) return;

    const toSearch = searchValue.split(",");

    let arr = [];
    for (const searchString of toSearch) {
        if (!searchString) continue;
        const regex = new RegExp(searchString.trim(), "i");
        for (const space of spaces) {
            if (space.spaceName && space.spaceName.match(regex)) {
                arr.push(space);
                continue;
            }

            if (space.occupancyType && space.occupancyType.match(regex)) {
                arr.push(space);
                continue;
            }
        }
    }
    spaces = [...new Set(arr)];
}

function resetFilter() {
    return (spaces = data.spaces);
}
</script>

<svelte:window
    on:keydown={(e) => {
        if (e.code == "KeyE" && e.ctrlKey) {
            e.preventDefault();
            searchbar.focus();
        }
    }} />

<Modal exitOutsideClick={false} bind:this={modal}>
    <div class="modal">
        <h1>SpaceName</h1>
        <textarea name="" id="" cols="30" rows="10" value={clipboard}></textarea>
        <button
            on:click={async () => {
                const textarea = document.querySelector(".modal > textarea");
                console.log(textarea);
                textarea.setSelectionRange(0, textarea.value.length);
                textarea.focus();
                notify.add("Copied SpaceName Enums");
                await navigator.clipboard.writeText(clipboard);
                // modal.close();
            }}>Copy</button>
    </div>
</Modal>

<div class="header">
    <div class="inputBox">
        <div class="icon">
            <Icon icon="akar-icons:search" hFlip={true} height="18" />
        </div>
        <input
            bind:this={searchbar}
            on:input={filter}
            class="search"
            type="search"
            placeholder="Search by space name or occupancy type" />
        <div class="kbs">
            <code>Ctrl</code>
            <code>E</code>
        </div>
    </div>

    <button
        style="font-size:.875rem; margin-right:auto;"
        on:click={() => {
            const arr = [...new Set(spaces.map((x) => x.spaceName))];
            const str = JSON.stringify(arr).replace(/\",\"/g, '", "');
            clipboard = str
                .toString()
                .replace(/[\"\[\]]/g, "")
                .replace(/\|/g, ",");
            modal.open();
        }}>
        Get Enums
    </button>

    <div class="info">
        <span>
            Showing
            {#if data.spaces.length == spaces.length}
                {data.spaces.length}
            {:else}
                {spaces.length}/{data.spaces.length}
            {/if}
            spaces</span>
    </div>
</div>

<div class="table_wrapper">
    <table class="{$theme} noActionColumn noHover">
        <thead>
            <tr>
                <th class="spaceName"><div>SpaceName</div></th>
                <th class="OccupancyType"><div>OccupancyType</div></th>
                <th class="Remarks"><div>Remarks</div></th>
                <th class="FunctionalSpace"><div>FunctionalSpace</div></th>
                <th class="OccupancyLoad"><div>OccupancyLoad</div></th>
            </tr>
        </thead>

        <tbody>
            {#each spaces as space}
                <tr>
                    <td class="spaceName">
                        <div>
                            {#if space.spaceName !== "any"}
                                <button
                                    class="none noHover"
                                    on:click={() => {
                                        navigator.clipboard.writeText(space.spaceName);
                                        notify.add("Copied", { duration: 3000 });
                                    }}>
                                    <div>{space.spaceName}</div>
                                    <div class="icon">
                                        <Icon icon="charm:copy" width={16} hFlip={1} />
                                    </div>
                                </button>
                            {:else}
                                <WaterfallSingle content="any:spaceName" slotted>
                                    <span>{space.spaceName}</span>
                                </WaterfallSingle>
                            {/if}
                        </div>
                    </td>
                    <td class="OccupancyType">
                        <div>
                            {#if space.occupancyType}
                                {space.occupancyType}
                            {:else}
                                <span>–</span>
                            {/if}
                        </div>
                    </td>
                    <td><div>{space.remarks || "–"}</div></td>
                    <td class="FunctionalSpace"><div>{space.functionalSpace}</div></td>
                    <td class="OccupancyLoad"><div>{space.occupancyLoad}</div></td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style lang="scss">
table {
    width: 100%;
    font-size: 0.875rem;
    tr {
        th {
            &.spaceName {
                width: 200px;
            }
            &.OccupancyType {
                width: 200px;
            }
            &.Remarks {
                width: auto;
            }
            &.FunctionalSpace {
                width: 200px;
            }
            &.OccupancyLoad {
                width: 130px;
            }
        }
        td {
            &.spaceName {
                div {
                    button {
                        padding: 0;
                        text-align: left;
                        font-size: inherit;
                        justify-content: space-between;
                        width: 100%;
                        div {
                            max-width: calc(100% - 1.25rem);
                        }
                        &:hover {
                            .icon {
                                opacity: 1;
                            }
                            color: $url;
                        }
                        .icon {
                            opacity: 0;
                            transition: all 0.15s;
                            color: var(--mono-200);
                        }
                    }
                    span {
                        font-style: italic;
                    }
                    & :global(.csd-tt__button-unstyled) {
                        padding: 2px 4px;
                    }
                }
            }

            &.FunctionalSpace {
                width: 200px;
                div {
                    width: calc(200px - 3px);
                }
            }
            &.OccupancyLoad {
                div {
                    display: block;
                    text-align: center;
                }
            }
        }
    }
}

.modal {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 400px;
    @media screen and (max-width: $mobile) {
        width: 100%;
    }
    h1 {
        margin: 0;
    }
    button {
        width: fit-content;
    }
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    @media screen and (max-width: $mobile) {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
    .inputBox {
        width: 400px;
        @media screen and (max-width: $mobile) {
            width: 100%;
            grid-column: 1 / -1;
        }
        input.search {
            width: 100%;
        }
    }
    .info {
        font-size: 0.875rem;
        color: var(--mono-300);
        @media screen and (max-width: $mobile) {
            text-align: right;
        }
    }
    button {
        border-radius: 0.25rem;
    }
}
</style>
