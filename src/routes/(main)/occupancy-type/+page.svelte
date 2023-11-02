<script>
import { notify } from "merh-forge-ui";
import { theme } from "$comp/theme.store";
import Icon from "@iconify/svelte";
export let data;

let ot = data.ot;
let list = ot,
    searchbar;

function filter() {
    resetFilter();

    if (!searchbar.value) return;

    const toSearch = searchbar.value.split(",");

    let result = [];
    for (const searchString of toSearch) {
        if (!searchString) continue;

        const regex = new RegExp(searchString.trim(), "i");
        for (const item of ot) {
            const ref = item.ref || "";
            if (item.occupancyType.match(regex) || ref.match(regex)) {
                result.push(item);
                continue;
            }
        }
    }
    list = [...new Set(result)];
}

function resetFilter() {
    return (list = ot);
}
</script>

<svelte:window
    on:keydown={(e) => {
        if (e.code == "KeyE" && e.ctrlKey) {
            e.preventDefault();
            searchbar.focus();
        }
    }} />

<div class="container">
    <h1>OccupancyType</h1>

    <div class="header">
        <div class="inputBox">
            <div class="icon">
                <Icon icon="akar-icons:search" hFlip={true} height="18" />
            </div>
            <input bind:this={searchbar} on:input={filter} class="search" type="search" placeholder="Search" />
            <div class="kbs">
                <code>Ctrl</code>
                <code>E</code>
            </div>
        </div>
    </div>

    <div class="table_wrapper">
        <table class="{$theme} noActionColumn noHover">
            <thead>
                <tr>
                    <th><div>Occupancy Type</div></th>
                    <th><div>Building Types (example)</div></th>
                    <th><div>SCDF Purpose Group</div></th>
                    <th><div>SCDF Type of Occupancy</div></th>
                    <th><div>BCA accessibility code</div></th>
                    <th><div>PUB</div></th>
                    <th><div>NEA</div></th>
                </tr>
            </thead>

            <tbody>
                {#each list as item}
                    <tr>
                        <td class="ot">
                            <div>
                                <button
                                    class="noHover none"
                                    on:click={() => {
                                        navigator.clipboard.writeText(item.occupancyType);
                                        notify.add("Copied to clipboard", { duration: 1000 });
                                    }}>
                                    <div>{item.occupancyType}</div>
                                    <div class="icon">
                                        <Icon icon="charm:copy" width={16} hFlip={1} />
                                    </div>
                                </button>
                            </div>
                        </td>
                        <td><div>{item.ref || ""}</div></td>
                        <td><div>{item.pg} - {item.pg_def}</div></td>
                        <td><div>{item.pg_type || ""}</div></td>

                        <td><div>{item.bca_acc_code} - {item.bca_acc_def}</div></td>
                        <td><div>{item.pub || ""}</div></td>
                        <td><div>{item.nea || ""}</div></td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style lang="scss">
h1 {
    margin: 0;
}
.container {
    padding-block: 2rem;
    grid-column: 1 / -1;
    width: 1400px;
    margin-inline: auto;

    @media screen and (max-width: 1600px) {
        width: 1200px;
    }

    @media screen and (max-width: 1250px) {
        width: 900px;
    }
}

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

.table_wrapper {
    table {
        width: 1400px;
        font-size: 0.875rem;
        th > div {
            text-align: left;
        }
        tbody {
            td.ot {
                width: 250px;
                div {
                    button {
                        padding-inline: 0;
                        display: flex;
                        flex-wrap: nowrap;
                        width: 100%;
                        justify-content: space-between;
                        font-size: 0.875rem;
                        div {
                            text-align: left;
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
                }
            }
            td:nth-child(2) {
                width: 300px;
            }

            td:nth-child(3),
            td:nth-child(4),
            td:nth-child(5),
            td:nth-child(6),
            td:nth-child(7) {
                width: 170px;
            }
        }
    }
}
</style>
