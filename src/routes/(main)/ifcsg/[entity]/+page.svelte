<script>
export let data;
import Icon from "@iconify/svelte";
import { Tooltip } from "merh-forge-ui";
import { theme } from "$comp/theme.store";
import { notify } from "merh-forge-ui";
import { ifcData } from "../ifcsg.store";
import { page } from "$app/stores";
import { timeout, replaceSpaceWithDash } from "$fn/helper";
import Update from "./Update.svelte";
import { beta } from "$routes/main.store";
import { getPermission } from "$comp/supabase.store";

let ifc = [];

const { role, permission } = getPermission();

const isEditor = role !== "reader" && role !== null;

let updateModal,
    noResult,
    updateData = {},
    isUpdating;

$: {
    $beta, $page, init();
}

async function init() {
    if (data.entity == "all") {
        const searchQuery = $page.url.searchParams.get("s");

        if (!searchQuery) {
            ifc = $ifcData;
            return;
        }

        let filteredIfc = [];
        if (searchQuery.split(/[\:\.]/).length == 2) {
            const [searchEntity, searchSubtype] = searchQuery.split(/[\:\.]/);

            const regex_entity = new RegExp(searchEntity, "i");
            const regex_subtype = new RegExp(searchSubtype, "i");

            for (const x of $ifcData) {
                const subtype = x.objectType ? x.objectType : x.predefinedType;
                if (x.entity.match(regex_entity) && subtype.match(regex_subtype)) {
                    filteredIfc.push(x);
                }
            }
        } else {
            const regex = new RegExp(searchQuery, "gi");
            for (const x of $ifcData) {
                if (x.key.match(regex)) {
                    filteredIfc.push(x);
                }
            }
        }

        filteredIfc = filteredIfc.filter((x) => ifIsInBeta(x));

        ifc = filteredIfc;
    } else {
        ifc = $ifcData.filter((x) => {
            if (!ifIsInBeta(x)) {
                return;
            }

            return x.entity == $page.params.entity;
        });

        const searchParamSubtype = $page.data.searchParamSubtype;
        if (searchParamSubtype) {
            ifc = ifc.filter((x) => {
                const subtypeArr = x.key.split(/\:/);
                let subtype;
                if (subtypeArr[2] !== "null") {
                    subtype = subtypeArr[2];
                } else if (subtypeArr[1] !== "null") {
                    subtype = subtypeArr[1];
                }

                if (!ifIsInBeta(x)) return;

                return searchParamSubtype == subtype.toLowerCase();
            });
        }
    }

    noResult = false;
    if (!ifc.length) {
        noResult = true;
    }

    // const keys = ifc.map((x) => x.key).toString();
    // console.log(keys);
    // const url = `/api/ifcsg/get-ic?key=${encodeURIComponent(keys)}&beta=${$beta}`;
    // const resp = await fetch(url);
    // const result = await resp.json();
    // // console.log(ifc);
    // // console.log(result);
}

function isHtmlDescription(description) {
    if (!description) return false;

    const regex = new RegExp(/^\@html/, "i");
    return description.match(regex);
}

function ifIsInBeta(type) {
    const res = $beta ? type.beta : true;
    return res;
}
</script>

<Update
    data={updateData}
    bind:this={updateModal}
    on:updateStart={(e) => {
        isUpdating = e.detail;
    }}
    on:update={async (e) => {
        const source = e.detail.source;

        const matchingItemIndex = $ifcData.findIndex(
            (item) => item.key === source.key && item.pset && item.pset[source.pset],
        );

        if (matchingItemIndex !== -1) {
            const matchingItem = $ifcData[matchingItemIndex];
            const props = matchingItem.pset[source.pset];
            const propIndex = props.findIndex((prop) => prop.propertyName === source.propName);

            if (propIndex !== -1) {
                const extgProp = $ifcData[matchingItemIndex].pset[source.pset][propIndex];
                $ifcData[matchingItemIndex].pset[source.pset][propIndex] = { ...extgProp, ...e.detail.prop };
            }
        }
        await timeout(500);
        init();
        isUpdating = false;
    }} />

{#if noResult}
    <div class="no_result">
        <div class="icon">
            <Icon icon="material-symbols:info-outline" height="20" />
        </div>
        No result matched your search query
    </div>
{/if}

{#each ifc.entries() as [i, { entity, predefinedType, objectType, pset, status, identifiedComponent, key: itemKey }]}
    <div class="card" class:invalid={!status}>
        {#if !status}
            <div class="alert">This component have been removed or not in used.</div>
        {/if}

        <div class="field">
            <a
                style="font-weight:600; text-decoration:none"
                href="/identified-component/{replaceSpaceWithDash(identifiedComponent)}">{identifiedComponent}</a>
        </div>
        <div></div>

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
                {#if value.some((x) => x.beta)}
                    <div class="table_wrapper">
                        <table class="{$theme} noActionColumn">
                            <thead>
                                <tr class="thead__tr__pset">
                                    <th colspan="5"><div>{psetName}</div></th>
                                </tr>
                            </thead>

                            <tr class="thead__tr__header">
                                <th><div>PropertyName</div></th>
                                <th><div>Data Type</div></th>
                                <th><div>IfcMeasureResource</div></th>
                                <th><div>Enumeration</div></th>
                                <th><div>Description</div></th>
                            </tr>

                            <tbody>
                                {#each Object.entries(value).sort() as [key, obj]}
                                    {#if $beta ? obj.beta : true}
                                        <tr class:isUpdating={isUpdating == obj.propertyName}>
                                            <td>
                                                <div class="tblPset__propName">
                                                    <button
                                                        class="none noHover tblPset__propName__name"
                                                        on:click={async (e) => {
                                                            navigator.clipboard.writeText(obj.propertyName);
                                                            notify.add("Copied to clipboard", { duration: 1000 });
                                                            const range = document.createRange();
                                                            range.selectNodeContents(e.target);
                                                            const selection = window.getSelection();
                                                            selection.removeAllRanges();
                                                            selection.addRange(range);
                                                        }}>
                                                        <span>{obj.propertyName}</span>
                                                        <div class="icon tblPset__copy">
                                                            <Icon icon="charm:copy" width={16} hFlip={1} />
                                                        </div>
                                                    </button>
                                                </div>
                                            </td>
                                            <td
                                                ><div>
                                                    <button
                                                        class="none noHover tblPset__propName__dataType"
                                                        on:click={(e) => {
                                                            navigator.clipboard.writeText(obj.dataType);
                                                            notify.add("Copied to clipboard", { duration: 1000 });
                                                            const range = document.createRange();
                                                            range.selectNodeContents(e.target);
                                                            const selection = window.getSelection();
                                                            selection.removeAllRanges();
                                                            selection.addRange(range);
                                                        }}>
                                                        <span>{obj.dataType}</span>
                                                        <div class="icon tblPset__copy">
                                                            <Icon icon="charm:copy" width={16} hFlip={1} />
                                                        </div>
                                                    </button>
                                                </div></td>
                                            <td
                                                ><div class="tblPset__measureResource">
                                                    {obj.IfcMeasureResource == null ? "-" : obj.IfcMeasureResource}
                                                    {#if permission.edit}
                                                        <button
                                                            class:hide={!isEditor}
                                                            class="none icon"
                                                            on:click={(e) => {
                                                                updateData = {
                                                                    code: "update-IfcMeasureResource",
                                                                    extg: obj.IfcMeasureResource,
                                                                    source: {
                                                                        key: itemKey,
                                                                        pset: psetName,
                                                                        propName: obj.propertyName,
                                                                    },
                                                                    prop: obj,
                                                                };
                                                                updateModal.show();
                                                            }}>
                                                            <Icon icon="ic:baseline-edit" width={14} />
                                                        </button>
                                                    {/if}
                                                </div></td>
                                            <td>
                                                <div class="tblPset__enums">
                                                    <div class="tblPset__enums__list">
                                                        {#if obj.Enums ? obj.Enums.length : 0}
                                                            {#each obj.Enums as item}
                                                                <Tooltip
                                                                    value="copy"
                                                                    clickedValue="Copied"
                                                                    position="top"
                                                                    display="flex"
                                                                    fixed
                                                                    width="fit-content"
                                                                    let:onClick
                                                                    on:click={(e) => {
                                                                        navigator.clipboard.writeText(item);
                                                                        const slot = e.detail.slot;
                                                                        const range = document.createRange();
                                                                        range.selectNodeContents(slot);
                                                                        const selection = window.getSelection();
                                                                        selection.removeAllRanges();
                                                                        selection.addRange(range);
                                                                    }}>
                                                                    <button
                                                                        class="none slim"
                                                                        style="padding:0"
                                                                        on:click={onClick}>
                                                                        <code>
                                                                            {item}
                                                                        </code>
                                                                    </button>
                                                                </Tooltip>
                                                            {/each}
                                                        {:else}
                                                            -
                                                        {/if}
                                                    </div>
                                                    {#if permission.edit}
                                                        <button
                                                            class="none icon"
                                                            class:hide={!isEditor}
                                                            on:click={(e) => {
                                                                const prop = {
                                                                    id: obj.id,
                                                                    PropertyName: obj.propertyName,
                                                                    ParentKey: `${entity}:${predefinedType}:${objectType}`,
                                                                    DataType: obj.dataType,
                                                                    Entity: entity,
                                                                    Enums: obj.Enums || [],
                                                                    IfcMeasureResource: obj.IfcMeasureResource,
                                                                };

                                                                updateData = {
                                                                    code: "update-enums",
                                                                    extg: obj.Enums || [],
                                                                    source: {
                                                                        key: itemKey,
                                                                        pset: psetName,
                                                                        propName: obj.propertyName,
                                                                    },
                                                                    prop,
                                                                };

                                                                updateModal.show();
                                                            }}>
                                                            <Icon icon="ic:baseline-edit" width={14} />
                                                        </button>
                                                    {/if}
                                                </div>
                                            </td>
                                            <td>
                                                <div class="tblPset__description">
                                                    <span>
                                                        <!-- {obj.Description ? obj.Description : "-"} -->
                                                        {#if isHtmlDescription(obj.Description)}
                                                            {@html obj.Description.replace(/\@html/i, "").trim()}
                                                        {:else if obj.Description}
                                                            {obj.Description}
                                                        {:else}
                                                            -
                                                        {/if}
                                                    </span>
                                                    {#if permission.edit}
                                                        <button
                                                            class="none icon"
                                                            class:hide={!isEditor}
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
                                                                        key: itemKey,
                                                                        pset: psetName,
                                                                        propName: obj.propertyName,
                                                                    },
                                                                    prop,
                                                                };

                                                                updateModal.show();
                                                            }}>
                                                            <Icon icon="ic:baseline-edit" width={14} />
                                                        </button>
                                                    {/if}
                                                </div>
                                            </td>
                                        </tr>
                                    {/if}
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {/if}
            {/each}
        {/if}
    </div>
{/each}

<style lang="scss">
.card {
    padding: 2rem;
    margin-block: 1rem;
    display: grid;
    gap: 0.5rem;
    border-radius: 0.5rem;
    background-color: $bg-p;
    border: 1px solid var(--mono-100);
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
    padding-bottom: 4px;
    width: 100%;

    table {
        min-width: 1300px;

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
            &.isUpdating {
                user-select: none;
                pointer-events: none;
                td {
                    position: relative;
                    > div {
                        filter: saturate(0.5);
                    }
                    &:after {
                        position: absolute;
                        content: "";
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        --gradient-c-1: var(--bg-alt);
                        --gradient-c-2: var(--bg-p);
                        background-image: linear-gradient(
                            135deg,
                            var(--gradient-c-1) 25%,
                            var(--gradient-c-2) 25%,
                            var(--gradient-c-2) 50%,
                            var(--gradient-c-1) 50%,
                            var(--gradient-c-1) 75%,
                            var(--gradient-c-2) 75%,
                            var(--gradient-c-2) 100%
                        );
                        background-size: 12px 12px;
                        opacity: 0.5;
                        // background-color: color-mix(in srgb, var(--mono-100) 25%, transparent);
                    }
                }
            }
            &.thead__tr__pset {
                th {
                    border: 1px solid var(--table__border-color);
                    border-bottom: 0;
                    border-radius: 0.25rem 0.25rem 0 0;

                    > div {
                        padding-block: 0.5rem;
                        padding-inline: 0.5rem;
                        display: flex;
                        justify-content: center;
                        font-size: 0.875rem;
                        font-weight: 500;
                    }
                }
            }
            &.thead__tr__header {
                th {
                    border-radius: 0;
                    > div {
                        padding-block: 0.25rem;
                        padding-inline: 0.5rem;
                        display: flex;
                        font-weight: 600;
                    }
                }
            }
            td:first-child {
                width: 220px;
            }
            td:nth-child(2) {
                width: 120px;
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

        div.tblPset__propName {
            display: flex;
            position: relative;
            align-items: center;
            gap: 2px;
            button.tblPset__propName__inUse {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                flex-wrap: nowrap;
                padding-left: 0;
                padding-block: 0.5rem;
                padding-right: 6px;
                &:before {
                    border-radius: 6px;
                    content: "";
                    position: relative;
                    width: 6px;
                    height: 6px;
                    background-color: var(--mono-100);
                }
                &.inUse {
                    &:before {
                        background-color: var(--green);
                    }
                }
            }
            button.tblPset__propName__name {
                text-align: left;
                padding-inline: 0;
                span {
                    width: 180px;
                    display: block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 0.875rem;
                    transition: all 0.1s;
                }
                div.tblPset__copy {
                    color: var(--mono-200);
                    right: 0.5rem;
                    opacity: 0;
                    position: absolute;
                    transition: all 0.2s;
                }
                &:hover {
                    span {
                        width: 170px;
                    }
                    div.tblPset__copy {
                        opacity: 1;
                        // transform: translateX(-0.5rem);
                    }
                }
            }
        }

        button.tblPset__propName__dataType {
            font-size: 0.875rem;
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 0;
            div.tblPset__copy {
                color: var(--mono-200);
                opacity: 0;
                transition: all 0.25s;
            }
            &:hover {
                div.tblPset__copy {
                    opacity: 1;
                }
            }
        }
        .tblPset__enums__list {
            display: flex;
            gap: 4px;
            width: calc(100% - 24px);
            flex-wrap: wrap;
        }
        .tblPset__enums,
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

.no_result {
    margin-top: 1rem;
    background-color: var(--bg-alt);
    padding: 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--mono-500);

    .icon {
        color: var(--mono-500);
    }
}

.hide {
    display: none !important;
}
.noEvent {
    pointer-events: none;
}
</style>
