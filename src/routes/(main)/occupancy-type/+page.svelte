<script>
import { theme } from "$comp/theme.store";
import Icon from "@iconify/svelte";
import CodeBlock from "$comp/CodeBlock.svelte";
import Sort from "./Sort.svelte";
export let data;

let ot = data.ot.map((item) => {
    const d = item;
    d.pg = `${item.pg} - ${item.pg_def}`;
    d.bca = `${item.bca_acc_code} - ${item.bca_acc_def}`;

    for (const [key, v] of Object.entries(d)) {
        if (!v) {
            d[key] = "";
        }
    }

    return d;
});
console.log(ot);

let list = JSON.parse(JSON.stringify(ot)),
    searchbar;

let orderBy = ["", ""];
$: orderBy, orderColumn();

const columns = [
    ["occupancyType", "Occupancy Type"],
    ["ref", "Building Types (example)"],
    ["pg", "SCDF Purpose Group"],
    ["pg_type", "SCDF Type of Occupancy"],
    ["bca", "BCA accessibility code"],
    ["pub", "PUB"],
    ["nea", "NEA"],
];

function orderColumn() {
    const [column, order] = orderBy;

    if (column == "" || order == "none") {
        if (searchbar?.value) {
            return;
        }
        return (list = JSON.parse(JSON.stringify(ot)));
    }

    const key = columns.filter((x) => x[1] == column)[0][0];
    list.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        const compareStrings = (strA, strB) => {
            const numA = parseInt(strA, 10);
            const numB = parseInt(strB, 10);

            // Check if both are numbers
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB; // Compare numerically
            }

            // If one is a number and the other isn't, prioritize the number
            if (!isNaN(numA)) return -1;
            if (!isNaN(numB)) return 1;

            // If neither is a number, compare them as strings
            return strA.localeCompare(strB);
        };

        return compareStrings(aVal, bVal) * (order === "asc" ? 1 : -1);
    });

    list = list;
}

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
    return (list = JSON.parse(JSON.stringify(ot)));
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
                    {#key orderBy}
                        {#each columns as [key, col]}
                            <th>
                                <div>
                                    <span>{col}</span>
                                    <Sort
                                        order={orderBy[0] == col ? orderBy[1] : "none"}
                                        on:click={(e) => (orderBy = [col, e.detail])} />
                                </div>
                            </th>
                        {/each}
                    {/key}
                </tr>
            </thead>

            <tbody>
                {#each list as item}
                    <tr>
                        <td class="ot">
                            <div>
                                <CodeBlock invisible={true}>{item.occupancyType}</CodeBlock>
                            </div>
                        </td>
                        <td><div>{item.ref || ""}</div></td>
                        <td><div>{item.pg}</div></td>
                        <td><div>{item.pg_type || ""}</div></td>

                        <td><div>{item.bca}</div></td>
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
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 1rem;
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

            td:nth-child(3) {
                width: 200px;
            }
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
