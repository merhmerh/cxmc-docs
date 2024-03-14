<script>
export let data;
import Icon from "@iconify/svelte";
import { Tooltip } from "merh-forge-ui";
import { theme } from "$comp/theme.store";
import { ifcData } from "../ifcsg.store";
import { page } from "$app/stores";
import { timeout, replaceSpaceWithDash } from "$fn/helper";
import Update from "./Update.svelte";
import { beta } from "$routes/main.store";
import { getPermission } from "$comp/supabase.store";
import CodeBlock from "$comp/CodeBlock.svelte";

let ifc = [];

const { role, permission } = getPermission();

const isEditor = role !== "reader" && role !== null;

let updateModal,
    noResult,
    updateData = {},
    isUpdating;

let original = $ifcData;
$: {
    $beta, $page, init();
}

async function init() {
    original = JSON.parse(JSON.stringify($ifcData));

    if (data.entity == "all") {
        const searchQuery = $page.url.searchParams.get("s");

        if (!searchQuery) {
            ifc = original;
            return;
        }

        let filteredIfc = [];
        if (searchQuery.split(/[\:\.]/).length == 2) {
            const [searchEntity, searchSubtype] = searchQuery.split(/[\:\.]/);

            const regex_entity = new RegExp(searchEntity, "i");
            const regex_subtype = new RegExp(searchSubtype, "i");

            for (const x of original) {
                const subtype = x.objectType ? x.objectType : x.predefinedType;
                if (x.entity.match(regex_entity) && subtype.match(regex_subtype)) {
                    filteredIfc.push(x);
                }
            }
        } else {
            const regex = new RegExp(searchQuery, "gi");
            for (const x of original) {
                if (x.key.match(regex)) {
                    filteredIfc.push(x);
                }
            }
        }

        filteredIfc = filteredIfc.filter((x) => ifIsInBeta(x));

        ifc = filteredIfc;
    } else {
        ifc = original.filter((x) => {
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

    if ($beta) {
        //delete some item that is not beta
        for (const item of ifc) {
            if (!item.pset) continue;

            for (const [key, arr] of Object.entries(item.pset)) {
                const somePropsIsInBeta = arr.some((x) => x.beta == true);

                if (!somePropsIsInBeta) {
                    delete item.pset[key];
                }
            }
        }
    }

    noResult = false;
    if (!ifc.length) {
        noResult = true;
    }
    console.log(ifc);
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

{#each ifc.entries() as [i, { entity, predefinedType, beta: subtypeInBeta, objectType, pset, status, identifiedComponent, key: itemKey }]}
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
            <CodeBlock>{entity}</CodeBlock>
        </div>
        <div class="field">
            PredefinedType:
            {#if predefinedType}
                <CodeBlock>{predefinedType}</CodeBlock>
            {:else}
                –
            {/if}
        </div>
        <div class="field">
            ObjectType:

            {#if objectType}
                <CodeBlock>{objectType}</CodeBlock>
            {:else}
                –
            {/if}
        </div>

        {#if pset}
            {#each Object.entries(pset) as [psetName, value]}
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
                                                <CodeBlock invisible={true}>{obj.propertyName}</CodeBlock>
                                            </div>
                                        </td>
                                        <td
                                            ><div>
                                                <CodeBlock invisible={true}>{obj.dataType}</CodeBlock>
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
                                                    {#if !obj.actualValue && !obj.sampleValue}
                                                        <span>-</span>
                                                    {:else}
                                                        {#if obj.actualValue && obj.actualValue.length}
                                                            {#each obj.actualValue as item}
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
                                                        {/if}

                                                        {#if obj.sampleValue && obj.sampleValue.length}
                                                            {#each obj.sampleValue as v}
                                                                <code class="sample">{v}</code>
                                                            {/each}
                                                        {/if}
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
                min-width: 0;
                max-width: 220px;
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
