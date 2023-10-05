<script>
import { theme } from "$comp/theme.store";
import { Select, Modal, initItems } from "merh-forge-ui";
import Icon from "@iconify/svelte";
import { notify } from "merh-forge-ui";
import dayjs from "dayjs";
import { onMount } from "svelte";

let devUse = "Residential (Non-landed)";
let ready, areaGfa, spaces, modal, modalData, developmentUseList, lastUpdated;

onMount(() => {
    init();
});

async function init() {
    const ls = localStorage.getItem("areaGfa");
    if (!ls) {
        areaGfa = await fetchData();
        lastUpdated = dayjs().format("DD/MM/YYYY hh:mm");
    } else {
        console.log("fetch from LocalStorage");
        const lsData = JSON.parse(ls);
        areaGfa = lsData.data;

        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lsData.timestamp;

        const expiryDuration = 4 * 60 * 60 * 1000; //4hour

        if (timeDiff > expiryDuration) {
            areaGfa = await fetchData();
        }
        const date = new Date(lsData.timestamp);
        lastUpdated = dayjs(date).format("DD/MM/YYYY hh:mm");
    }

    developmentUseList = initItems([...new Set(areaGfa.map((x) => x.code_description))]);
    spaces = updateSpaces();
    ready = true;
}

async function fetchData() {
    ready = false;
    const resp = await fetch("./area-gfa");
    const result = await resp.json();

    const lsData = {
        data: result,
        timestamp: new Date().getTime(),
    };
    localStorage.setItem("areaGfa", JSON.stringify(lsData));
    return result;
}

function updateSpaces() {
    return areaGfa.filter((x) => x.code_description == devUse);
}
</script>

<Modal bind:this={modal}>
    <div class="modal__content">
        <h3>{modalData["DC Spaces"]}</h3>
        {#each Object.entries(modalData) as [key, value]}
            <div class="field">
                <div class="label">
                    {key}:
                </div>

                <div class="value">
                    {value ? value : "–"}
                </div>
            </div>
        {/each}
    </div>
</Modal>

{#if ready}
    <div class="content">
        <div class="header">
            <div class="select">
                <Select
                    items={developmentUseList}
                    searchable
                    defaultValue={"Residential (Non-landed)"}
                    rows={8}
                    on:change={(e) => {
                        devUse = e.detail.label;
                        spaces = updateSpaces();
                    }} />
            </div>

            <div class="lastUpdated">
                <div>
                    Last Updated: <code>{lastUpdated}</code>
                </div>

                <button
                    on:click={async () => {
                        await fetchData();
                        init();
                    }}>Reload</button>
            </div>
        </div>

        <div class="table_wrapper">
            <table class={$theme}>
                <thead>
                    <tr>
                        <th><div>AGF_Name</div></th>
                        <th><div>Remarks</div></th>
                        <th><div>Excluded from GFA</div></th>
                        <th><div>Refuse Output</div></th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {#each spaces as space}
                        {#if space["DC Spaces"]}
                            <tr>
                                <td>
                                    <button
                                        class="noHover table__spaceName none"
                                        on:click={() => {
                                            navigator.clipboard.writeText(space["DC Spaces"]);
                                            notify.add("Copied to clipboard", { duration: 1000 });
                                        }}>
                                        <div class="name">{space["DC Spaces"]}</div>
                                        <div class="icon">
                                            <Icon icon="charm:copy" width={16} hFlip={1} />
                                        </div>
                                    </button>
                                </td>
                                <td><div>{space["Remarks"] || ""}</div></td>
                                <td><div class="center">{space["Excluded from GFA*"] || ""}</div></td>
                                <td
                                    ><div class="center">
                                        {space["NEA Refuse Output Req / m2"]
                                            ? space["NEA Refuse Output Req / m2"]
                                            : space["NEA Refuse Output Req"] || ""}
                                    </div></td>
                                <td>
                                    <div class="actions">
                                        <button
                                            class="none"
                                            on:click={() => {
                                                modalData = space;
                                                modal.open();
                                            }}>
                                            <Icon icon="material-symbols:info-outline" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        {/if}
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
{:else}
    <div class="content loading">
        <div class="icon">
            <Icon icon="line-md:loading-twotone-loop" height="128" />
            <p>Fetching data...</p>
        </div>
    </div>
{/if}

<style lang="scss">
.loading {
    grid-column: 1 / -1;
    padding-top: 2rem;
    margin-inline: auto;
    width: 1100px;
    min-height: 100vh;
    padding-bottom: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .icon {
        dislay: flex;
        flex-direction: column;
        color: var(--grey-light);
    }
}
.modal__content {
    width: 500px;
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    @media screen and (max-width: $mobile) {
        width: 100%;
    }
    h3 {
        margin: 0;
        padding-bottom: 1rem;
    }
    .field {
        display: flex;
        // flex-direction: column;
        gap: 0.5rem;
        .label {
            font-size: 0.875rem;
            opacity: 0.75;
        }
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--mono-300);
    }
}

.content {
    grid-column: 1 / -1;
    padding-top: 2rem;
    margin-inline: auto;
    width: 1200px;
    min-height: 100vh;
    padding-bottom: 100px;
    @media screen and (max-width: $mobile) {
        width: 100%;
        padding-inline: 1rem;
        padding-top: 1rem;
    }
    .header {
        display: flex;
        gap: 1rem;
        justify-content: space-between;
        @media screen and (max-width: $mobile) {
            flex-direction: column-reverse;
        }
        .select {
            width: 300px;
            @media screen and (max-width: $mobile) {
                width: 100%;
            }
        }
        .lastUpdated {
            display: flex;
            gap: 1rem;
            align-items: center;
            @media screen and (max-width: $mobile) {
                font-size: 0.875rem;
                justify-content: space-between;
            }
            button {
                @media screen and (max-width: $mobile) {
                    padding: 0.5rem;
                    font-size: 0.875rem;
                }
            }
        }
    }
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

table {
    th {
        div {
            font-size: inherit;
        }
    }
    tbody {
        tr {
            td:nth-child(3),
            td:nth-child(4) {
                width: 140px;
            }
        }
    }
    .actions {
        width: fit-content;
        margin-left: 1rem;
    }
    .table__spaceName {
        padding-inline: 0.25rem;
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        justify-content: space-between;
        .name {
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
</style>
