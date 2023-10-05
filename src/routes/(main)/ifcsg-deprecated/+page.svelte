<script>
// import { airtable } from "./airtable.store";
import Icon, { iconExists } from "@iconify/svelte";
import { theme } from "$comp/theme.store.js";
import { onMount } from "svelte";
import Sidebar from "./Sidebar.svelte";
import dayjs from "dayjs";
import { Modal, Select, Tooltip } from "merh-forge-ui";
import { session } from "$comp/supabase.store.js";
import { dev as isDev } from "$app/environment";
import { goto } from "$app/navigation";
import Update from "./Update.svelte";

export let data;
let { supabase } = data;

$: $session,
    (() => {
        if (!$session) {
            goto("./login");
        }
    })();

let ready,
    ifcData,
    home = true,
    timeDiff,
    version,
    fetchStatus,
    updateModal,
    updateData = {};

onMount(async () => {
    version = await getVersion();

    const properties = await fetch("/api/ifcsg/get-properties")
        .then((res) => res.json())
        .then((result) => {
            return result;
        });

    await init();

    const t1 = performance.now();
    for (const [index, item] of ifcData.entries()) {
        const entity = item.entity;
        let haveProps = properties.filter((x) => x.Entity == entity);
        if (haveProps.length && item.pset) {
            const psets = Object.entries(item.pset).map(([key, v]) => key);

            haveProps = haveProps.filter((x) => psets.includes(x.PropertySet));
            if (haveProps) {
                for (const prop of haveProps) {
                    for (const [pset, props] of Object.entries(item.pset)) {
                        if (pset == prop.PropertySet) {
                            for (const [propIndex, row] of props.entries()) {
                                if (row.propertyName == prop.PropertyName) {
                                    ifcData[index].pset[pset][propIndex] = { ...row, ...prop };
                                }
                            }
                        }
                    }
                    // console.log(item);
                }
            }
        }
    }

    const t2 = performance.now();
    console.log(t2 - t1);

    if (isDev) {
        const temp = {
            detail: {
                entity: ["IfcBuilding"],
            },
        };
        showContent(temp);
    }
});

async function init(v) {
    fetchStatus = "fetching";
    ready = false;
    try {
        const airtable = await load(v);
        const pset = sanitizePset(airtable.pset);
        ifcData = sanitizeAirtableComp(airtable.comp, pset);
        ifcData = ifcData;
        ready = true;
        fetchStatus = "complete";
    } catch (error) {
        console.log("init error:", error);
        fetchStatus = "fail";
    }
}

function sanitizePset(pset) {
    const simplifiedPset = {};
    pset.forEach((row) => {
        const propsString = row.fields["Properties [Data Type]"];
        const allProps = [];
        if (propsString) {
            const arr = propsString.split(";");
            for (const value of arr) {
                const trimmed = value.trim().replace("\n", "");
                const propertyName = trimmed.replace(/(.*?)\[(.*?)\]/, "$1").trim();
                const measureResource = "";
                const dataType = trimmed.replace(/(.*?)\[(.*?)\]/, "$2").trim();
                allProps.push({ propertyName, dataType, measureResource });
            }
        }

        row.fields.props = allProps;

        const entities = row.fields["IFC4 Entities"] ?? [];

        // if (!entity) return;
        entities.forEach((entity) => {
            if (!simplifiedPset[entity]) {
                simplifiedPset[entity] = {};
            }

            if (!simplifiedPset[entity][row.fields["Property Set"]]) {
                simplifiedPset[entity][row.fields["Property Set"]] = allProps;
            }
        });
    });
    return simplifiedPset;
}

function sanitizeAirtableComp(obj, pset) {
    const ifc = {};
    for (const row of obj) {
        const item = row.fields;
        const entity = item["IFC4 Entities"][0];

        let subtype = item["IFC4 Entity.Sub-Type"];

        if (Array.isArray(subtype)) {
            subtype = subtype[0];
        }

        const predefinedType =
            subtype.charAt(subtype.length - 1) == "*"
                ? "USERDEFINED"
                : subtype.replace(entity, "").replace(/\./, "") || null;

        const objectType =
            subtype.charAt(subtype.length - 1) == "*" ? subtype.replace(entity, "").replace(/^\.(.*?)\*$/, "$1") : null;

        const componentName = subtype.replace(entity, "").replace(/\./g, "").replace(/\*/g, "");
        const key = `${entity}:${predefinedType}:${objectType}`;

        const status = (() => {
            const v = item["Status"] || "required";
            const exclude = ["to be removed", "not used"];

            if (exclude.includes(v.toLowerCase())) {
                return false;
            } else {
                return true;
            }
        })();

        if (!ifc[key]) {
            ifc[key] = {
                identifiedComponent: item["Identified Component"],
                entity,
                predefinedType,
                objectType,
                pset: {},
                status: status,
                componentName,
            };
        }

        const propsString = item["Properties [Data Type]"];

        const props = [];
        if (propsString) {
            const arr = propsString.split(";");
            for (const value of arr) {
                const trimmed = value.trim().replace("\n", "");
                const propertyName = trimmed.replace(/(.*?)\[(.*?)\]/, "$1").trim();
                const measureResource = "";
                const dataType = trimmed.replace(/(.*?)\[(.*?)\]/, "$2").trim();
                props.push({ propertyName, dataType, measureResource });
            }
        }
        if (ifc[key].props) {
            ifc[key].props.push(props);
        } else {
            ifc[key].props = props;
        }
    }

    const result = [];
    for (const [key, obj] of Object.entries(ifc)) {
        let propList = obj.props.map((x) => x.propertyName);
        const EntityPsets = pset[obj.entity];

        propList.forEach((prop) => {
            if (!EntityPsets) return;
            outerLoop: for (const [pset, list] of Object.entries(EntityPsets)) {
                // const psetPropList = list.map((x) => x.propertyName);
                for (const pset_prop of list) {
                    if (pset_prop.propertyName == prop) {
                        if (!obj.pset[pset]) {
                            obj.pset[pset] = [];
                        }
                        obj.pset[pset].push(pset_prop);

                        break outerLoop;
                    }
                }
            }
        });

        delete obj.props;
        if (!Object.entries(obj.pset).length) {
            delete obj.pset;
        }
        result.push({ ...obj, key: key });
    }

    result.sort((a, b) => {
        // if (a.status !== b.status) {
        //     return b.status - a.status;
        // }

        if (a.key < b.key) {
            return -1;
        }
        if (a.key > b.key) {
            return 1;
        }

        // if (a.componentName < b.componentName) {
        //     return -1;
        // }
        // if (a.componentName > b.componentName) {
        //     return 1;
        // }

        return 0;
    });

    return result;
}

async function isChecksumSame() {
    // checked for freshness
    const { data, error } = await supabase
        .from("airtable")
        .select("checksum,last_updated")
        .order("id", { ascending: false })
        .limit(1);

    const db_lastUpdated = data[0].last_updated;
    const db_checksum = data[0].checksum;

    const localStorageRawData = localStorage.getItem("airtable");

    if (!localStorageRawData) {
        return false;
    }

    const localStorageData = JSON.parse(localStorageRawData);
    const localStorageChecksum = localStorageData.checksum;

    if (db_checksum !== localStorageChecksum) {
        return false;
    }

    if (db_lastUpdated !== localStorageData.last_updated) {
        localStorageData.last_updated = db_lastUpdated;
        localStorage.setItem("airtable", JSON.stringify(localStorageData));
    }

    return localStorageData;
}

async function load(v) {
    if (v) {
        const { data: db_data, error } = await supabase.from("airtable").select().eq("id", v);

        const res = db_data[0];
        timeDiff = dayjs(res.last_updated).format("DD/MM/YYYY HH:mm:ss");
        return res.result.airtable;
    }

    const localData = await isChecksumSame();

    if (!localData) {
        console.log("fetching");
        const { data: db_data, error } = await supabase
            .from("airtable")
            .select()
            .order("id", { ascending: false })
            .limit(1);

        // const result = await resp.json();
        console.log("fetch completed");
        const res = db_data[0];
        localStorage.setItem("airtable", JSON.stringify(res));
        timeDiff = dayjs(res.last_updated).format("DD/MM/YYYY HH:mm:ss");
        return res.result.airtable;
    } else {
        timeDiff = dayjs(localData.last_updated).format("DD/MM/YYYY HH:mm:ss");
        return localData.result.airtable;
    }
}

async function getVersion() {
    const { data, error } = await supabase.from("airtable").select("id,last_updated");
    // console.log(data);
    const list = data.map((x) => {
        return {
            label: `v${x.id}: ${dayjs(x.last_updated).format("DD MMM YYYY - HH:mm")}`,
            value: x.id,
        };
    });

    list.sort((a, b) => b.value - a.value);

    return list;
}

function showContent(e) {
    home = false;
    const detail = e.detail;
    // console.log("show", detail);
    if (!detail.entity) {
        return;
    }

    for (const item of ifcData) {
        item.show = false;
    }

    for (const item of ifcData) {
        if (!detail.key) {
            item.show = detail.entity.includes(item.entity);
        } else {
            // item.show = detail.key == item.key;
            item.show = detail.key.includes(item.key);
        }
    }

    ifcData = ifcData;
}
</script>

<Update
    data={updateData}
    bind:this={updateModal}
    on:update={(e) => {
        console.log(e.detail);
        const source = e.detail.source;
        const extgProp = ifcData[source.ifcDataIndex].pset[source.pset][source.propIndex];
        ifcData[source.ifcDataIndex].pset[source.pset][source.propIndex] = { ...extgProp, ...e.detail.prop };
    }} />

{#if ready}
    {#if ifcData}
        <div class="sidebar">
            <Sidebar data={ifcData} on:update={showContent} />
        </div>
    {/if}

    <div class="content">
        <div class="doc">
            {#if home}
                <div class="home">
                    <h1>Search Ifc SG data</h1>
                    <p>
                        Interact with the sidebar by either clicking on the items listed or search for IFC Entity or
                        subtypes.
                    </p>
                    <div class="divider" />
                    <p>Data freshness is every 4 hour</p>
                    <p>
                        {#if timeDiff}
                            Last updated: <code>{timeDiff}</code>
                        {/if}
                    </p>

                    <button
                        class="alt"
                        on:click={async () => {
                            await fetch("https://datasync-mljlk3jxzq-as.a.run.app");
                            location.href = location.href;
                        }}>Force Refresh</button>
                    <div class="divider" />

                    <p>
                        View IFC4 definition on
                        <a
                            href="https://standards.buildingsmart.org/IFC/RELEASE/IFC4/ADD2_TC1/HTML/schema/ifcmeasureresource/content.htm"
                            >IfcMeasureResource</a
                        >.
                    </p>
                    <div class="divider" />

                    <div style="width:400px;">
                        <p>Change Version</p>
                        <Select
                            searchable
                            items={version}
                            rows={12}
                            placeholder="Select Version"
                            on:change={(e) => {
                                console.log(e.detail.value);
                                init(e.detail.value);
                            }} />
                    </div>
                </div>
            {/if}

            {#each ifcData.entries() as [i, { show, entity, predefinedType, objectType, pset, status }]}
                {#if show}
                    <div class="card" class:invalid={!status}>
                        <!-- {row.fields['Identified Component']} -->
                        {#if !status}
                            <div class="alert">This component have been removed or not in used.</div>
                        {/if}

                        <div class="field">
                            IfcEntity:
                            <code>{entity}</code>
                        </div>
                        <div class="field">
                            PredefinedType:
                            <code>
                                {#if predefinedType}
                                    {predefinedType}
                                {:else}
                                    –
                                {/if}
                            </code>
                        </div>
                        <div class="field">
                            ObjectType:

                            {#if objectType}
                                <code> {objectType} </code>
                            {:else}
                                –
                            {/if}
                        </div>

                        {#if pset}
                            {#each Object.entries(pset) as [psetName, value]}
                                <div class="table_wrapper">
                                    <table class="{$theme} noHover">
                                        <thead>
                                            <tr class="headertitle">
                                                <th colspan="5">
                                                    <div>{psetName}</div>
                                                </th>
                                            </tr>
                                        </thead>

                                        <tr class="header">
                                            <th><div>PropertyName</div></th>
                                            <th><div>Data Type</div></th>
                                            <th><div>IfcMeasureResource</div></th>
                                            <th><div>Enumeration</div></th>
                                            <th><div>Description</div></th>
                                        </tr>

                                        <tbody>
                                            {#each Object.entries(value).sort() as [key, obj]}
                                                <tr>
                                                    <td>
                                                        <div class="tblPset__propName">
                                                            <button
                                                                on:click={async (e) => {
                                                                    console.log(obj);
                                                                    const data = {
                                                                        source: {
                                                                            ifcDataIndex: i,
                                                                            pset: psetName,
                                                                            propIndex: key,
                                                                        },
                                                                        prop: {
                                                                            id: obj.id,
                                                                            PropertyName: obj.propertyName,
                                                                            ParentKey: `${entity}:${
                                                                                predefinedType || null
                                                                            }:${objectType}`,
                                                                            Entity: entity,
                                                                            PropertySet: psetName,
                                                                            inUse: !obj.inUse,
                                                                        },
                                                                    };
                                                                    await updateModal.updateProp(data);
                                                                }}
                                                                class="none noHover propInUse"
                                                                class:inUse={obj.inUse} />
                                                            <Tooltip
                                                                position="top"
                                                                value={"Copy"}
                                                                clickedValue={"Copied"}
                                                                display="flex"
                                                                on:click={(e) => {
                                                                    navigator.clipboard.writeText(obj.propertyName);
                                                                    const slot = e.detail.slot;
                                                                    const range = document.createRange();
                                                                    range.selectNodeContents(slot);
                                                                    const selection = window.getSelection();
                                                                    selection.removeAllRanges();
                                                                    selection.addRange(range);
                                                                }}>{obj.propertyName}</Tooltip>
                                                        </div>
                                                    </td>
                                                    <td><div>{obj.dataType}</div></td>
                                                    <td
                                                        ><div class="tblPset__measureResource">
                                                            {obj.IfcMeasureResource == null
                                                                ? "–"
                                                                : obj.IfcMeasureResource}
                                                            <button
                                                                class="none icon"
                                                                on:click={(e) => {
                                                                    updateData = {
                                                                        code: "update-IfcMeasureResource",
                                                                        extg: obj.IfcMeasureResource,
                                                                        prop: obj,
                                                                    };
                                                                    updateModal.show();
                                                                }}>
                                                                <Icon icon="ic:baseline-edit" width={14} />
                                                            </button>
                                                        </div></td>
                                                    <td>
                                                        <div class="tblPset__enums">
                                                            {#if obj.Enums}
                                                                {#each obj.Enums as item}
                                                                    <Tooltip
                                                                        value="copy"
                                                                        clickedValue="Copied"
                                                                        position="top"
                                                                        display="flex"
                                                                        fixed
                                                                        width="fit-content"
                                                                        on:click={(e) => {
                                                                            navigator.clipboard.writeText(item);
                                                                            const slot = e.detail.slot;
                                                                            const range = document.createRange();
                                                                            range.selectNodeContents(slot);
                                                                            const selection = window.getSelection();
                                                                            selection.removeAllRanges();
                                                                            selection.addRange(range);
                                                                        }}>
                                                                        <code>
                                                                            {item}
                                                                        </code>
                                                                    </Tooltip>
                                                                {/each}
                                                            {:else}
                                                                -
                                                            {/if}
                                                            <!-- {obj.enum ? obj.enum.replace(/[\{\}]/g, '').replace(/,/g, ', ') : null} -->
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="tblPset__description">
                                                            <span>{obj.Description ? obj.Description : "-"}</span>
                                                            <button
                                                                class="none icon"
                                                                on:click={(e) => {
                                                                    const prop = {
                                                                        id: obj.id,
                                                                        PropertyName: obj.propertyName,
                                                                        ParentKey: `${entity}:${predefinedType}:${objectType}`,
                                                                        DataType: obj.dataType,
                                                                        PropertySet: psetName,
                                                                        Entity: entity,
                                                                        IfcMeasureResource: obj.IfcMeasureResource,
                                                                        Description: obj.Description,
                                                                    };

                                                                    updateData = {
                                                                        code: "update-description",
                                                                        extg: obj.Description,
                                                                        source: {
                                                                            ifcDataIndex: i,
                                                                            pset: psetName,
                                                                            propIndex: key,
                                                                        },
                                                                        prop,
                                                                    };

                                                                    updateModal.show();
                                                                }}>
                                                                <Icon icon="ic:baseline-edit" width={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            {/each}
                                        </tbody>
                                    </table>
                                </div>
                            {/each}
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    </div>
{:else}
    <div class="loading">
        {#if fetchStatus == "fetching"}
            <div class="icon">
                <!-- <Icon icon="svg-spinners:blocks-wave" height="128" /> -->
                <Icon icon="line-md:loading-twotone-loop" height="128" />

                <p>Fetching data...</p>
            </div>
        {:else if fetchStatus == "fail"}
            <h3>Error in parsing latest result, please choose a older version</h3>
            <div class="version">
                <span>Version</span>
                <Select
                    searchable
                    items={version}
                    placeholder="Select Version"
                    on:change={(e) => {
                        console.log(e.detail.value);
                        init(e.detail.value);
                    }} />
            </div>
        {/if}
    </div>
{/if}

<style lang="scss">
.version {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 350px;
}

.home {
    .divider {
        position: relative;
        text-align: center;
        padding-block: 1rem;
    }

    .divider::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        border-top: 1px solid #ccc;
    }
}

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
        display: flex;
        flex-direction: column;
        color: var(--grey-light);
    }
}

.sidebar {
    position: sticky;
    top: 70px;
    height: calc(100svh - 70px);
    overflow-y: auto;
    border-right: 1px solid $grey-lighter;
}

.content {
    // grid-column: 1 / 2;
    padding-top: 2rem;
    margin-inline: auto;
    width: 100%;
    max-width: min(calc(100vw - 300px), 1500px);
    min-height: 100vh;
    padding-bottom: 100px;
    padding-inline: 2rem;

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
        .alert {
            padding-bottom: 1rem;
            font-size: 1.2rem;
            color: $red !important;
        }
        &.invalid {
            filter: opacity(0.25);
        }
    }
    .table_wrapper {
        table {
            min-width: 1300px;
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
                height: 0;
                > div {
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
                    width: 450px;
                }
                td:nth-child(5) {
                    width: auto;
                }
            }
            .tblPset__enums {
                display: flex;
            }
            .tblPset__propName {
                display: flex;
                align-items: center;
                flex-wrap: nowrap;
                gap: 6px;
                .propInUse {
                    display: flex;
                    flex-shrink: 0;
                    width: 8px;
                    height: 8px;
                    border-radius: 0;
                    padding: 0;
                    position: relative;
                    &:after {
                        border-radius: 6px;
                        content: "";
                        position: relative;
                        width: 6px;
                        height: 6px;
                        background-color: var(--mono-100);
                    }
                    &.inUse {
                        &:after {
                            background-color: var(--green);
                        }
                    }
                }
            }
            .tblPset__measureResource,
            .tblPset__description {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 100%;
                span {
                    width: calc(100% - 1.5rem);
                }
                button.icon {
                    opacity: 0;
                    transition: opacity 0.15s;
                    color: var(--mono-300);
                }
                &:hover {
                    button.icon {
                        opacity: 1;
                    }
                }
            }
            :global(.slot) {
                display: flex;
            }
        }
    }
}
</style>
