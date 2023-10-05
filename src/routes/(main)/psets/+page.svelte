<script>
import { theme } from '$comp/theme.store.js';

import { onMount } from 'svelte';
import Sidebar from './Sidebar_PSET.svelte';

let psets = {},
    pageReady,
    sidebarItems;

const a = 'hello';
onMount(async () => {
    const psd = localStorage.getItem('ifcdata');

    if (!psd) {
        // const resp = await fetch('/api/ifcsg/psets');
        console.log('fetching and setting localStorage');
    } else {
        console.log('retrieving from localStorage');
    }
    const data = JSON.parse(psd);
    console.log(data);
    const map = new Map();

    for (const row of data) {
        if (row.psets) {
            for (const [key, pset] of Object.entries(row.psets)) {
                if (!map.has(key)) {
                    map.set(key, [...pset]);
                } else {
                    const extg = map.get(key);
                    map.set(key, [...extg, ...pset]);
                }
            }
        }
    }

    const result = [];
    for (let [key, arr] of Object.entries(Object.fromEntries(map))) {
        psets[key] = [...new Set(arr.map(JSON.stringify))].map(JSON.parse);
        let name = key.replace(/pset_|sgpset_/gi, '').replace(/common/i, '');
        // name = name.replace(/([A-Z])/g, ' $1').trim();
        result.push({
            name: name,
            pset: key,
            show: true,
            props: [...new Set(arr.map(JSON.stringify))].map(JSON.parse),
        });
    }

    result.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        }
        return 0;
    });

    console.log(result);

    const uniqueArray = result.filter((obj, index, self) => {
        const firstIndex = self.findIndex((item) => item.name === obj.name);
        return index === firstIndex;
    });

    console.log(uniqueArray);

    psets = result;

    // psets = uniqueArray;
    sidebarItems = setSidebar([...uniqueArray]);
    pageReady = true;
});

function setSidebar(data) {
    const arr = [];
    for (const row of data) {
        arr.push({
            name: row.name,
            pset: row.pset,
            show: false,
        });
    }

    return arr;
}

function filter(string) {
    if (!string) {
        console.log('reset');
        psets.map((x) => {
            x.show = true;
        });
        psets = psets;
        return;
    }

    psets.map((x) => {
        x.show = true;
        if (!x.pset.includes(string)) {
            x.show = false;
        }
    });

    psets = psets;
}
</script>

{#if pageReady}
    <div class="sidebar">
        <Sidebar
            items={sidebarItems}
            on:filter={(e) => {
                filter(e.detail);
            }} />
    </div>

    <div class="content">
        <div class="doc">
            {#each psets as pset (pset)}
                <div class="card" class:hide={pset.show == false}>
                    <div class="title">{pset.pset}</div>

                    <div class="table_wrapper">
                        <table class:light={$theme == 'light'} class:dark={$theme == 'dark'}>
                            <thead>
                                <tr class="header">
                                    <th><div>PropertyName</div></th>
                                    <th><div>Data Type</div></th>
                                    <th><div>IfcMeasureResource</div></th>
                                    <th><div>Enumeration</div></th>
                                    <th><div>Description</div></th>
                                </tr>
                            </thead>

                            <tbody>
                                {#each pset.props as prop}
                                    <tr>
                                        <td><div>{prop.propertyName}</div></td>
                                        <td><div>{prop.dataType}</div></td>
                                        <td><div>{prop.IfcMeasureResource}</div></td>
                                        <td>
                                            <div>
                                                {#if prop.enum}
                                                    {#each prop.enum.replace(/[\{\}]/g, '').split(',') as item}
                                                        <code>{item}</code>
                                                    {/each}
                                                {:else}
                                                    -
                                                {/if}
                                                <!-- {prop.enum ? prop.enum.replace(/[\{\}]/g, '').replace(/,/g, ', ') : null} -->
                                            </div>
                                        </td>
                                        <td><div>{prop.description ? prop.description : '-'}</div></td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/each}
        </div>
    </div>
{/if}

<style lang="scss">
.sidebar {
    position: sticky;
    top: 70px;
    height: calc(100svh - 70px);
    overflow-y: auto;
    border-right: 1px solid $grey-lighter;
}

.content {
    padding-top: 2rem;
    margin-inline: auto;
    width: 1100px;
    min-height: 100vh;
    padding-bottom: 100px;

    .doc {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .card {
        padding: 2rem;
        display: grid;
        gap: 0.5rem;
        border-radius: 0.5rem;
        background-color: $bg-alt;

        .title {
            font-size: 1.25rem;
            color: $accent;
            font-weight: 600;
        }
    }
    .table_wrapper {
        margin-top: 1rem;
        overflow-y: hidden;
        overflow-x: auto;
        border-radius: 0.5rem;
        @media screen and (max-width: $mobile) {
            width: calc(100vw - 4rem);
        }
        // &.hide {
        //     display: none;
        // }
    }

    table {
        width: 100%;
        table-layout: auto;
        border-collapse: collapse;
        background-color: $bg-p;

        th {
            font-size: 14px;
            font-weight: 400;
        }
        &.light {
            th {
                background-color: #f4f6f6;
            }
            th,
            td {
                border: 1px solid $grey-lightest;
            }

            tbody tr {
                &:hover {
                    td {
                        background-color: rgba(#b3cce0, 0.25);
                    }
                }
            }
        }
        &.dark {
            th {
                background-color: #292e35;
            }
            th,
            td {
                border: 1px solid $grey-lighter;
            }

            tbody tr {
                &:hover {
                    td {
                        background-color: rgba(#275c8b, 0.25);
                    }
                }
            }
        }

        th,
        td {
            &:first-child {
                border-left: none;
            }
            &:last-child {
                border-right: none;
            }
        }
        tr:first-child {
            th {
                border-top: none;
            }
        }
        tr:last-child {
            td {
                border-bottom: none;
            }
        }

        td {
            font-size: 0.875rem;
            div {
                padding-block: 0.25rem;
                padding-inline: 0.5rem;
                display: flex;
                width: fit-content;
                white-space: break-spaces;
                gap: 2px;
                flex-wrap: wrap;
                width: 100%;
            }
        }

        tr {
            &.headertitle {
                th div {
                    padding-block: 1rem;
                    padding-inline: 0.5rem;
                    display: flex;
                    justify-content: center;
                    font-size: 1rem;
                    font-weight: 500;
                }
            }
            &.header {
                th div {
                    padding-block: 0.25rem;
                    padding-inline: 0.5rem;
                    display: flex;
                    font-weight: 600;
                }
            }
            td:first-child {
                width: 200px;
            }
            td:nth-child(2) {
                width: 150px;
            }
            td:nth-child(3) {
                width: 200px;
            }
            td:nth-child(4) {
                width: 180px;
            }
        }

        // tr:nth-child(even) {
        // 	background-color: $grey-lightest;
        // }
    }
}
</style>
