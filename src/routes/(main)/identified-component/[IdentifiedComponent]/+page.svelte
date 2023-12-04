<script>
import Icon from "@iconify/svelte";
import { mg_comp } from "../mg.store";
import { page } from "$app/stores";
import { theme } from "$comp/theme.store";
import { timeout, replaceSpaceWithDash, isObjectEmpty } from "$fn/helper";
import { beta } from "$routes/main.store";
import { Modal, Tooltip } from "merh-forge-ui";
import CodeTable from "../../codes/[agency]/CodeTable.svelte";
import { getPermission } from "$comp/supabase.store";
import CodeBlock from "$comp/CodeBlock.svelte";
import Mg from "./Mg.svelte";

let original;
let mg_data = {};
let prop_selected,
    isEditing,
    editor,
    notFound,
    modal,
    codeData,
    running,
    selectedGateway = "All",
    codesTableError;

const { role, permission } = getPermission();

// comments
$: $page, update();
$: {
    $beta;
    original;
    toggleBetaContent();
}

async function update() {
    console.log(running);
    if (running) return;
    running = true;
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
    const result = await resp.json();
    console.log(result);
    mg_data.prop = result;
    // console.log(mg_data);
    original = JSON.parse(JSON.stringify(mg_data));
    running = false;
}

function toggleBetaContent() {
    if (original) {
        if ($beta) {
            console.log("toggle");
            mg_data.prop = mg_data.prop.filter((/** @type {{ beta: any; }} */ x) => x.beta);
            for (const item of mg_data.prop) {
                if (!item.pset) {
                    continue;
                }
                for (const [pset, props] of Object.entries(item.pset)) {
                    item.pset[pset] = props.filter((/** @type {{ beta: any; }} */ obj) => obj.beta);

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

/**
 * @param {string} description
 */
function isHtmlDescription(description) {
    if (!description) return false;

    const regex = new RegExp(/^\@html/, "i");
    return description.match(regex);
}

/**
 * @param {{ agency: any; code: any; chapter: any; clauseNumber: any; }} clause
 * @param {any} clauses
 */
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

const gateways = [
    { code: "All", name: "All" },
    { code: "C", name: "Construction" },
    { code: "D", name: "Design" },
];

function filterByGateway(gatewayName) {
    selectedGateway = gatewayName;
    codesTableError = null;
    for (const item of mg_data.gateway) {
        item.codeHidden = false;

        for (const chapter of item.chapters) {
            chapter.chapterHidden = false;

            if (gatewayName == "All") {
                continue;
            }

            if (!chapter.gateway.includes(gatewayName)) {
                console.log("yes?");
                chapter.chapterHidden = true;
            }
        }

        const allChaptersAreHidden = item.chapters.every((x) => x.chapterHidden == true);
        if (allChaptersAreHidden) {
            item.codeHidden = true;
        }
    }

    const allCodesAreHidden = mg_data.gateway.every((x) => x.codeHidden == true);
    if (allCodesAreHidden) {
        codesTableError = "No codes founds";
    }

    mg_data = mg_data;
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
    <div class="legend">
        <span>Filter By:</span>
        {#each gateways as gateway}
            <button
                class="none"
                class:selected={gateway.name == selectedGateway}
                on:click={() => filterByGateway(gateway.name)}>
                <code class="gatewayIdentifier {gateway.code}">{gateway.name} Gateway</code>
            </button>
            <!-- <button class="none">
                <code class="gatewayIdentifier {gateway.code}">{gateway.name} Gateway</code>
            </button> -->
        {/each}
    </div>
    <div class="table_wrapper">
        <table class={$theme}>
            <div class="gatewayGrid">
                <div class="header">
                    <span>Agency</span>
                    <span>Code Book</span>
                    <span>Gateway</span>
                    <span>Chapter</span>
                    <span>Clause No.</span>
                    <span>Clauses</span>
                </div>
                <div class="content">
                    {#each mg_data.gateway as item}
                        <div class="row" class:codeHidden={item.codeHidden}>
                            <div class="col1">{item.agency}</div>
                            <div class="col2">{item.code}</div>
                            <div class="col3">
                                {#each item.chapters as chapter}
                                    <div class="col3_row" class:chapterHidden={chapter.chapterHidden}>
                                        <div class="gateway">
                                            {#each chapter.gateway.sort() as gateway}
                                                <code class="gatewayIdentifier {gateway.substring(1, 0)}"
                                                    >{gateway.substring(1, 0)}</code>
                                            {/each}
                                        </div>

                                        <div class="chapter">{chapter.chapterName}</div>
                                        <div class="clause_col">
                                            {#each chapter.clauseNumbers as clause}
                                                <div class="clause_row">
                                                    <div class="clauseNumber">{clause.clauseNumber}</div>
                                                    <div class="clauses">
                                                        <div class="description">
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
                        </div>
                    {/each}
                </div>
                {#if codesTableError}
                    <div class="error">
                        <span>{codesTableError}</span>
                    </div>
                {/if}
            </div>
        </table>
    </div>

    <div class="modellingGuide__container">
        {#key mg_data.IdentifiedComponent}
            <Mg identifiedComponent={mg_data.IdentifiedComponent}></Mg>
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
                    <th><div>{[...new Set(mg_data.prop.map((x) => x.entity))]}</div></th>
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
                                            <td class="propName"
                                                ><div>
                                                    <CodeBlock invisible={true}>{obj.propertyName}</CodeBlock>
                                                </div></td>
                                            <td class="dataType"
                                                ><div>
                                                    <CodeBlock invisible={true}>{obj.dataType}</CodeBlock>
                                                </div></td>
                                            <td class="measure"><div>{obj.measureResource || ""}</div></td>
                                            <td class="enums">
                                                <div>
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
                &:last-child {
                    border-radius: 0 0.25rem 0 0;
                    border-left: 0;
                }
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
                    min-width: 0;
                    max-width: 220px;
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
                    > div {
                        display: flex;
                        gap: 4px;
                        width: calc(100% - 24px);
                        flex-wrap: wrap;
                        white-space-collapse: collapse;
                    }
                }
                td.description {
                    width: auto;
                }
            }
        }
    }

    .gatewayGrid {
        display: grid;
        width: 100%;
        min-width: 1000px;
        border-radius: 0.25rem;
        > div {
            display: grid;
            font-size: 0.875rem;
        }
        .header {
            grid-template-columns: 80px 200px 80px 200px 100px auto;
            border: 1px solid var(--table__border-color);
            border-radius: 0.25rem 0.25rem 0 0;
            background-color: var(--table__background-color);
            span {
                padding: 0.5rem;
                &:not(:last-child) {
                    border-right: 1px solid var(--table__border-color);
                }
            }
        }
        .content {
            border-radius: 0 0 0.25rem 0.25rem;
            border: 1px solid var(--table__border-color);
            border-top: 0;
            .row {
                display: flex;
                align-items: center;
                height: auto;
                &.codeHidden {
                    background-color: grey;
                    display: none;
                }
                > div {
                    padding: 0.25rem;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    padding-inline: 0.5rem;
                    height: 100%;
                    &:not(:last-child) {
                        border-right: 1px solid var(--table__border-color);
                    }
                }
                .col1 {
                    width: 80px;
                }
                .col2 {
                    width: 200px;
                }
                .col3 {
                    width: calc(100% - 80px - 200px);
                    justify-content: center;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    .col3_row {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                        &.chapterHidden {
                            display: none;
                            background-color: black;
                        }
                        &:not(:last-child) {
                            border-bottom: 1px solid var(--table__border-color);
                        }

                        > div {
                            &:not(:last-child) {
                                border-right: 1px solid var(--table__border-color);
                            }
                            padding: 0.5rem;
                        }
                        .gateway {
                            width: 80px;
                            height: 100%;
                            gap: 0.25rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-shrink: 0;
                        }
                        .chapter {
                            display: flex;
                            align-items: center;
                            width: 200px;
                            height: 100%;
                            flex-shrink: 0;
                        }
                        .clause_col {
                            padding: 0;
                            display: flex;
                            flex-direction: column;
                            height: 100%;
                            width: 100%;

                            .clause_row {
                                display: flex;
                                flex-direction: row;
                                width: 100%;
                                height: 100%;

                                &:not(:last-child) {
                                    border-bottom: 1px solid var(--table__border-color);
                                }
                                .clauseNumber {
                                    flex-shrink: 0;
                                    padding: 0.5rem;
                                    display: flex;
                                    align-items: center;
                                    width: 100px;
                                    border-right: 1px solid var(--table__border-color);
                                }
                                .clauses {
                                    width: calc(100% - 100px);
                                    padding: 0.5rem;
                                    display: flex;
                                    align-items: center;
                                    gap: 1rem;
                                    .description {
                                        width: 100%;
                                        display: flex;
                                        flex-direction: column;
                                        gap: 0.25rem;
                                        p {
                                            padding: 0;
                                            margin: 0;
                                            @include text-overflow-1;
                                            white-space: normal;
                                        }
                                        .more {
                                            color: var(--mono-300);
                                        }
                                    }
                                    button {
                                        flex-shrink: 0;
                                        border: 0;
                                        padding: 0;
                                        width: 20px;
                                        height: 20px;
                                        border-radius: 0.25rem;
                                        color: var(--mono-600);
                                        background-color: var(--mono-100);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .error {
            padding: 0.5rem;
            border: 1px solid var(--table__border-color);
            border-top: 0;
            border-radius: 0 0 0.25rem 0.25rem;
            span {
                color: var(--mono);
            }
        }
    }
}

code.gatewayIdentifier {
    color: #fff;
    background-color: $red;
    font-size: 12px;
    font-weight: 600;
    font-family: var(--font);
    padding-block: 4px;
    &:global(.All) {
        background-color: #3a3a3a;
    }
    &:global(.C) {
        background-color: $red;
    }
    &:global(.D) {
        background-color: $green;
    }
}

.legend {
    margin-bottom: 0.5rem;
    display: flex;
    gap: 0.325rem;
    align-items: center;
    span {
        font-size: 0.875rem;
        color: var(--mono-700);
    }
    button {
        padding: 0;
        opacity: 0.5;
        &.selected {
            opacity: 1;
            outline: 2px solid var(--accent-400);
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
</style>
