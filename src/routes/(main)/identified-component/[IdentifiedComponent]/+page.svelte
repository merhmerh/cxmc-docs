<script>
import Icon from "@iconify/svelte";
import { mg_comp } from "../mg.store";
import { page } from "$app/stores";
import { theme } from "$comp/theme.store";
import { timeout, replaceSpaceWithDash, isObjectEmpty } from "$fn/helper";
import { beta } from "$routes/main.store";
import ModellingGuide from "./ModellingGuide.svelte";
import { Modal } from "merh-forge-ui";
import CodeTable from "../../codes/[agency]/CodeTable.svelte";
import { getPermission } from "$comp/supabase.store";

let original;
let mg_data = {};
let prop_selected, isEditing, editor, notFound, modal, codeData;

const { role, permission } = getPermission();

$: $page, update();
$: {
    $beta;
    original;
    toggleBetaContent();
}

async function update() {
    if (modal) {
        modal.close();
    }
    notFound = false;

    const IdentifiedComponent = $page.params.IdentifiedComponent;

    mg_data = $mg_comp.find((obj) => replaceSpaceWithDash(obj.IdentifiedComponent) === IdentifiedComponent);

    if (!mg_data || !Object.entries(mg_data).length) {
        notFound = true;
        mg_data = {};
        return;
    }

    if (mg_data.IdentifiedComponent) {
        if (replaceSpaceWithDash(mg_data.IdentifiedComponent) === IdentifiedComponent) {
            prop_selected = $page.url.hash.replace("#", "");
            // return;
        }
    }
    const url = `/api/ifcsg/get-ic?ic=${encodeURIComponent(mg_data.IdentifiedComponent)}&beta=${$beta}`;
    const resp = await fetch(url);
    mg_data.prop = await resp.json();
    original = JSON.parse(JSON.stringify(mg_data));
}

function toggleBetaContent() {
    if (original) {
        if ($beta) {
            console.log("toggle");
            mg_data.prop = mg_data.prop.filter((x) => x.beta);
            for (const item of mg_data.prop) {
                if (!item.pset) {
                    continue;
                }
                for (const [pset, props] of Object.entries(item.pset)) {
                    item.pset[pset] = props.filter((obj) => obj.beta);

                    if (item.pset[pset].length == 0) {
                        delete item.pset[pset];
                    }
                }

                if (isObjectEmpty(item.pset)) {
                    delete item.pset;
                }
            }
        } else {
            mg_data = structuredClone(original);
        }
    }
}

function isHtmlDescription(description) {
    if (!description) return false;

    const regex = new RegExp(/^\@html/, "i");
    return description.match(regex);
}

async function showCode(clause, clauses) {
    console.log(clause);
    const url = `/api/ifcsg/get-code?data=${encodeURIComponent(JSON.stringify(clause))}`;
    const resp = await fetch(url);
    const result = await resp.json();
    console.log(result, clauses);
    codeData = result;
    codeData.clause = clauses;
    modal.show();
}
</script>

<Modal bind:this={modal}>
    <div class="modal">
        <h2>{codeData.chapter}</h2>
        <CodeTable item={codeData}></CodeTable>
    </div>
</Modal>

{#if notFound}
    <h3>This identified component '{$page.params.IdentifiedComponent}' not in beta</h3>
{:else if mg_data}
    <h1>{mg_data.IdentifiedComponent}</h1>

    <h3 id="gateway">
        <a href="{$page.url.origin}{$page.url.pathname}#gateway">Gateway</a>
    </h3>

    <div class="table_wrapper">
        {#if !mg_data.gateway.length}
            <div class="errorBox">No gateway found for this Identified Component</div>
        {/if}

        <table class="{$theme} noActionColumn noHover gateway">
            <thead>
                <tr>
                    <th colspan="4"><div>Design Gateway</div></th>
                </tr>
                <tr>
                    <th><div>Agency</div></th>
                    <th><div>Code Book</div></th>
                    <th><div>Chapter</div></th>
                </tr>
            </thead>
            <tbody>
                {#each mg_data.gateway as item}
                    <tr>
                        <td class="agency"><div>{item.agency}</div></td>
                        <td class="code"><div>{item.code}</div></td>
                        <td class="chapters">
                            <div class="chapter">
                                {#each item.chapters as chapter}
                                    <div class="row">
                                        <div class="col1">{chapter.chapterName}</div>
                                        <div class="col2">
                                            {#each chapter.clauseNumbers as clause}
                                                <div class="clauseNumber">
                                                    <div class="c1">{clause.clauseNumber}</div>
                                                    <div class="c2">
                                                        <div class="c2a">
                                                            <p>{clause.clauses[0]}</p>
                                                            {#if clause.clauses.length > 1}
                                                                <span class="more"
                                                                    >...and {clause.clauses.length - 1} more clauses
                                                                </span>
                                                            {/if}
                                                        </div>
                                                        <button
                                                            on:click={() => {
                                                                showCode(
                                                                    {
                                                                        agency: item.agency,
                                                                        code: item.code,
                                                                        chapter: chapter.chapterName,
                                                                        clauseNumber: clause.clauseNumber,
                                                                    },
                                                                    clause.clauses,
                                                                );
                                                            }}>
                                                            <div class="icon">
                                                                <Icon
                                                                    icon="material-symbols-light:read-more"
                                                                    height="16" />
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </td>

                        <!-- {#each gateway.Requirement as req} -->
                        <!-- <td class="chapter"><div><span>{req.code}</span></div></td> -->
                        <!-- {/each} -->
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <h3 id="modelling-guide" class="modellingGuide__header">
        <a href="{$page.url.origin}{$page.url.pathname}#modelling-guide">Modelling Guide</a>
        <div class="buttonGroup">
            {#if permission.edit}
                {#if isEditing}
                    <button
                        on:click={() => {
                            isEditing = false;
                            editor.showViewer();
                        }}>
                        <span>Cancel</span>
                    </button>
                    <button
                        on:click={() => {
                            editor.save();
                        }}>
                        <div class="icon"><Icon icon="material-symbols:save" width={16} /></div>
                        <span>Save</span>
                    </button>
                {:else}
                    <button
                        on:click={() => {
                            isEditing = true;
                            editor.showEditor();
                        }}>
                        <div class="icon"><Icon icon="ic:baseline-edit" width={14} /></div>
                        <span> Edit Guide</span>
                    </button>
                {/if}
            {/if}
        </div>
    </h3>

    <div class="modellingGuide__container">
        {#key mg_data.IdentifiedComponent}
            <ModellingGuide
                bind:this={editor}
                IdentifiedComponent={mg_data.IdentifiedComponent}
                on:save={() => {
                    isEditing = false;
                }} />
        {/key}
    </div>

    <h3 id="modelling-representation">
        <a href="{$page.url.origin}{$page.url.pathname}#modelling-representation">Modelling Representation </a>
    </h3>
    <div class="table_wrapper">
        <table class="{$theme} noActionColumn noHover representation horizontal">
            {#each Object.entries(mg_data.representation) as [software, arr]}
                <tr>
                    <th><div>{software}</div></th>
                    <td
                        ><div>
                            {#each arr as category}
                                <code>{category}</code>
                            {/each}
                        </div></td>
                </tr>
            {/each}
        </table>
    </div>

    <h3 id="ifc-data"><a href="{$page.url.origin}{$page.url.pathname}#ifc-data">IFC Data</a></h3>

    {#if !mg_data.prop}
        Loading...
    {:else}
        <div class="table_wrapper">
            <table class="{$theme} noActionColumn noHover horizontal ifcSubtype">
                <tr>
                    <th><div>IfcEntity</div></th>
                    <th><div>{mg_data.prop.map((x) => x.entity)}</div></th>
                    <!-- <td><div>{[...new Set(mg_data.prop.map((x) => x.entity))]}</div></td> -->
                </tr>
                <tr>
                    <th><div>SubTypes</div></th>
                    <td class="subtype"
                        ><div>
                            {#each mg_data.prop as item}
                                <code>
                                    <a href="{$page.url.origin}{$page.url.pathname}#{item.componentName}"
                                        >{item.componentName || "-"}</a>
                                </code>
                            {/each}
                        </div></td>
                </tr>
            </table>
        </div>

        {#each mg_data.prop as { entity, predefinedType, objectType, pset, componentName }}
            <div id={componentName} class="card" class:anchored={prop_selected == componentName}>
                <div class="table_wrapper">
                    <table class="{$theme} noActionColumn noHover horizontal ifcData">
                        <tr>
                            <th><div>IfcEntity</div></th>
                            <td><div>{entity}</div></td>
                        </tr>
                        <tr>
                            <th><div>PredefinedType</div></th>
                            <td><div>{predefinedType || "-"}</div></td>
                        </tr>
                        {#if objectType}
                            <tr>
                                <th><div>ObjectType</div></th>
                                <td><div>{objectType}</div></td>
                            </tr>
                        {/if}
                    </table>
                </div>

                {#if pset}
                    <button
                        class="none noHover pset_title"
                        on:click={() => {
                            if (prop_selected == componentName) {
                                return (prop_selected = false);
                            }
                            prop_selected = componentName;
                        }}>
                        <h4>Property Sets</h4>
                        <Icon icon="ic:round-expand-more" height="24" />
                    </button>
                {/if}
                <!-- {#if $beta || prop_selected === componentName} -->
                {#if pset}
                    {#each Object.entries(pset) as [psetName, value]}
                        <div class="table_wrapper">
                            <table class="{$theme} noActionColumn noHover ifcPsetData">
                                <thead>
                                    <tr class="thead__tr__pset">
                                        <th colspan="5"><div>{psetName}</div></th>
                                    </tr>
                                    <tr class="thead__tr__header">
                                        <th><div>PropertyName</div></th>
                                        <th><div>Data Type</div></th>
                                        <th><div>IfcMeasureResource</div></th>
                                        <th><div>Enumeration</div></th>
                                        <th><div>Description</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each Object.entries(value).sort() as [key, obj]}
                                        <tr>
                                            <td class="propName"><div>{obj.propertyName}</div></td>
                                            <td class="dataType"><div>{obj.dataType}</div></td>
                                            <td class="measure"><div>{obj.measureResource || ""}</div></td>
                                            <td class="enums">
                                                <div>
                                                    {#if obj.Enums}
                                                        {#each obj.Enums as item}
                                                            <code>{item}</code>
                                                        {/each}
                                                    {/if}
                                                </div>
                                            </td>
                                            <td class="description">
                                                <div>
                                                    {#if isHtmlDescription(obj.Description)}
                                                        {@html obj.Description.replace(/\@html/i, "").trim()}
                                                    {:else if obj.Description}
                                                        {obj.Description}
                                                    {:else}
                                                        -
                                                    {/if}
                                                </div>
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    {/each}
                {/if}
                <!-- {/if} -->
            </div>
        {/each}
    {/if}
{/if}

<style lang="scss">
h3 {
    // font-size: 1rem;
    position: relative;
    font-weight: 600;
    margin-block: 2rem 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--mono-100);
    a {
        text-decoration: none;
        color: inherit;
        &:hover {
            color: $url;
        }
    }
}

.modal {
    width: 800px;
    @media screen and (max-width: $mobile) {
        width: 100%;
    }
}

.table_wrapper {
    margin-top: 0;
    table {
        font-size: 0.875rem;
        &.gateway {
            tr:first-child {
                th:first-child {
                    border: 1px solid var(--mono-100);
                    border-bottom: 0;
                    border-radius: 0.25rem 0.25rem 0 0;
                }
            }
            tr:nth-child(2) {
                th {
                    border-radius: 0;
                }
            }
            td.agency {
                width: 80px;
            }
            td.code {
                width: 200px;
            }

            td.chapters {
                width: 1000px;
                padding: 0;
                div.chapter {
                    padding: 0;
                    gap: 0;
                    .row {
                        display: grid;
                        grid-template-columns: 200px 1fr;
                        // justify-content: space-between;
                        width: 100%;
                        // align-items: center;

                        display: flex;

                        &:not(:last-child) {
                            border-bottom: 1px solid var(--table__border-color);
                        }
                        .col1 {
                            display: flex;
                            align-items: center;
                            flex-shrink: 0;
                            width: 200px;
                            padding: 0.325rem 0.5rem;
                        }
                        .col2 {
                            border-left: 1px solid var(--table__border-color);
                            display: flex;
                            flex-direction: column;
                            width: 100%;

                            .clauseNumber {
                                flex: 1;
                                display: flex;
                                width: 100%;

                                &:not(:last-child) {
                                    border-bottom: 1px solid var(--table__border-color);
                                }
                                div {
                                    padding: 0.325rem 0.5rem;
                                }
                                div.c1 {
                                    align-items: center;
                                    display: flex;
                                    flex-shrink: 0;
                                    width: 100px;
                                    border-right: 1px solid var(--table__border-color);
                                }
                                div.c2 {
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    width: 100%;
                                    gap: 1rem;

                                    .c2a {
                                        padding: 0;
                                        display: flex;
                                        flex-direction: column;
                                        gap: 0.25rem;
                                        width: 100%;
                                        // justify-content: space-between;
                                        justify-content: center;
                                        .more {
                                            color: var(--mono-300);
                                        }

                                        p {
                                            padding: 0;
                                            margin: 0;
                                            @include text-overflow-1;
                                            white-space: normal;
                                        }
                                    }
                                    button {
                                        border: 0;
                                        padding: 0;
                                        width: 20px;
                                        height: 20px;
                                        border-radius: 0.25rem;
                                        color: var(--mono);
                                        background-color: var(--mono-100);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        &.representation {
            width: fit-content;
            th {
                width: 120px;
            }
            td {
                min-width: 200px;
                max-width: 600px;
            }
        }
        &.ifcSubtype {
            margin-bottom: 2rem;
            width: fit-content;

            th {
                width: 160px;
            }
            td {
                min-width: 200px;
                max-width: 100%;
                div {
                    display: flex;
                    gap: 6px;
                    code {
                        display: flex;
                        a {
                            text-decoration: none;
                            color: inherit;
                        }
                    }
                }
            }
        }
        &.ifcData {
            th {
                width: 140px;
            }
        }
        &.ifcPsetData {
            min-width: 1300px;
            max-width: 100%;
            thead {
                tr:first-child > th {
                    border: 1px solid var(--table__border-color);
                    border-radius: 0.25rem 0.25rem 0 0;
                }
                tr:nth-child(2) > th {
                    border-radius: 0;
                    border-top: 0;
                }
            }
            tbody {
                td.propName {
                    width: 220px;
                }
                td.dataType {
                    width: 120px;
                }
                td.measure {
                    width: 120px;
                }
                td.enums {
                    width: 450px;
                }
                td.description {
                    width: auto;
                }
            }
        }
    }
}

.card {
    padding: 1rem;
    border: 1px solid var(--mono-100);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    &.anchored {
        border-color: transparent;
        outline: 2px solid var(--accent);
        background-color: color-mix(in srgb, var(--bg-alt) 24%, transparent);
        table {
            --table__outsideBackground-color: color-mix(in srgb, var(--bg-alt) 24%, transparent);
        }
    }
    button.pset_title {
        border-radius: 0;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 0.5rem;
        width: 100%;
        border-bottom: 1px solid var(--mono-100);
        h4 {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0;
        }
    }
}

.modellingGuide__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .buttonGroup {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        button {
            min-width: 80px;
            font-size: 0.875rem;
            padding: 0.5rem 0.5rem;
            border-radius: 0.5rem;
            gap: 0.5rem;
        }
    }
}
</style>
