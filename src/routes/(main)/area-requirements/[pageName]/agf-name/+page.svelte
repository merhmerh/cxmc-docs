<script>
import { theme } from "$comp/theme.store";
import { page } from "$app/stores";
import { toURLPath } from "$fn/helper";
import Icon from "@iconify/svelte";
import CodeBlock from "$comp/CodeBlock.svelte";

export let data;
let spaces = data.areaNames,
    list = [];
let searchbar;
$: $page, update();

function update() {
    let devUse = $page.url.searchParams.get("q");

    if (!devUse) {
        spaces = data.areaNames.filter((x) => toURLPath(x[2].trim()) == "residential-(non-landed)");
        list = spaces;
        return;
    }

    if (devUse == "all-spaces") {
        list = data.areaNames;
        return;
    }

    spaces = data.areaNames.filter((x) => toURLPath(x[2].trim()) == devUse);
    list = spaces;
}

function filter() {
    resetFilter();

    if (!searchbar.value) return;

    const toSearch = searchbar.value.split(",");

    let result = [];
    for (const searchString of toSearch) {
        if (!searchString) continue;

        const regex = new RegExp(searchString.trim(), "i");
        for (const arr of spaces) {
            const areaName = arr[0];
            if (areaName.match(regex)) {
                result.push(arr);
                continue;
            }
        }
    }
    list = [...new Set(result)];
}

function resetFilter() {
    return (list = spaces);
}
</script>

<svelte:window
    on:keydown={(e) => {
        if (e.code == "KeyE" && e.ctrlKey) {
            e.preventDefault();
            searchbar.focus();
        }
    }} />

<div class="header">
    <div class="inputBox">
        <div class="icon">
            <Icon icon="akar-icons:search" hFlip={true} height="18" />
        </div>
        <input bind:this={searchbar} on:input={filter} class="search" type="search" placeholder="Search by AGF_Name" />
        <div class="kbs">
            <code>Ctrl</code>
            <code>E</code>
        </div>
    </div>
</div>

<div class="table_wrapper">
    <table class="{$theme}  noHover noActionColumn">
        <thead>
            <tr>
                <th><div>AGF_Name</div></th>
                <th><div>Description</div></th>
                <!-- <th><div class="center">AGF_DevelopmentUse</div></th>
                <th><div class="center">Excluded from GFA</div></th> -->
                <!-- <th><div class="center">Refuse Category</div></th>
                <th><div class="center">Refuse Output</div></th> -->
            </tr>
        </thead>
        <tbody>
            {#each list as space}
                {#if space[0]}
                    <tr>
                        <td class="gfaName">
                            <div>
                                <CodeBlock invisible={true}>
                                    <div class="name" class:isIncluded={space[1] == "1"}>
                                        {space[0]}
                                    </div>
                                </CodeBlock>
                            </div>
                        </td>
                        <td class="description"><div>{space[3] || ""}</div></td>
                        <!--<td><div class="center">{space[1] ? "yes" : "no"}</div></td> -->
                        <!-- <td><div class="center">{space[3] !== "N.A" ? space[3] : ""}</div></td> -->

                        <!-- <td
                            ><div class="center">
                                {space[4] !== "#N/A" ? space[4] : space[5] || ""}
                            </div></td> -->
                    </tr>
                {:else}
                    <tr class="noResult"
                        ><td colspan="5"
                            ><div>No result found for development use of "{$page.url.searchParams.get("q")}"</div></td
                        ></tr>
                {/if}
            {/each}
        </tbody>
    </table>
</div>

<style lang="scss">
.header {
    padding-top: 2rem;
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
        font-size: 0.875rem;
        @media screen and (max-width: $mobile) {
            width: 100%;
            grid-column: 1 / -1;
        }
        input.search {
            width: 100%;
        }
    }
}
table {
    font-size: 0.875rem;
    // width: 400px;
    @media screen and (max-width: $mobile) {
        width: 100%;
    }
    tbody {
        tr {
            td:first-child {
                width: 350px;
            }
        }
    }

    td.gfaName > div > button {
        padding-inline: 0;
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        justify-content: space-between;
        font-size: 0.875rem;
        .name {
            text-align: left;
            &.isIncluded {
                color: var(--red);
            }
        }
        .icon {
            width: fit-content;
            color: var(--mono-200);
            @include flex-center;
            opacity: 0;
            transition: opacity 0.15s;
        }
        &:hover {
            color: var(--accent);
            .icon {
                opacity: 1;
            }
        }
    }

    td.description > div {
        text-align: left;
        white-space: break-spaces;
    }

    tr.noResult {
        td {
            border-left: 1px solid var(--table__border-color);
            border-radius: 0 0 0.25rem 0.25rem;
            div {
                padding-block: 0.5rem;
            }
        }
    }
}
</style>
