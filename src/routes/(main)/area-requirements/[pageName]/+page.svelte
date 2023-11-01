<script>
export let data;
import { theme } from "$comp/theme.store";
import { Tooltip } from "merh-forge-ui";
import Image from "../Image.svelte";
</script>

{#each data.content.content as { type, content }}
    {#if type == "section"}
        <h2>{content}</h2>
    {/if}

    {#if type == "paragraph"}
        <div class="paragraph">
            <p>{content}</p>
        </div>
    {/if}

    {#if type == "images"}
        {#if content.length == 1}
            <Image src={content[0]} />
        {:else}
            <div class="image_container">
                {#each content as image}
                    <Image src={image} />
                {/each}
            </div>
        {/if}
    {/if}
{/each}

<div class="table_wrapper">
    <table class="{$theme} noHover noActionColumn">
        <thead>
            <tr>
                <th><div>PropertyName</div></th>
                <th><div>Values</div></th>
            </tr>
        </thead>
        <tbody>
            {#each data.tableContent as table}
                <tr>
                    <td><div>{table.scheme}</div></td>
                    <td>
                        <div class="tags">
                            {#if table.scheme == "AGF_Name"}
                                Refer to <a href="/area-requirements/area_gfa/agf-name?q=residential-(none-landed)"
                                    >AGF_Name</a> Page.
                            {/if}
                            {#if table.data.length}
                                {#each table.data as value}
                                    {#if value.includes("*")}
                                        {value.replace("*", "")}
                                    {:else if value.match(/\{\{(.*?)\}\}/)}
                                        <code class="sample">{value.replace(/\{\{(.*?)\}\}/, "$1")}</code>
                                    {:else}
                                        <Tooltip
                                            position="top"
                                            value="Copy"
                                            clickedValue="Copied"
                                            let:onClick
                                            on:click={(e) => {
                                                navigator.clipboard.writeText(value);
                                                const range = document.createRange();
                                                const target = e.detail.slot;
                                                range.selectNodeContents(target);
                                                const selection = window.getSelection();
                                                selection.removeAllRanges();
                                                selection.addRange(range);
                                            }}>
                                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                                            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                                            <code on:click={onClick}> {value}</code>
                                        </Tooltip>
                                    {/if}
                                {/each}
                            {/if}
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style lang="scss">
.table_wrapper {
    margin: 0;
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    padding-top: 2rem;
    gap: 0;
    table {
        font-size: 0.875rem;
        border-collapse: collapse;
        border: 1px solid var(--mono-100);
        &:not(:first-child) {
            border-left: 0;
        }
        th {
            > div {
                font-size: 14px;
                width: 250px;
            }
        }
        td {
            div {
                min-height: 28px;
            }
        }
    }
}
.tags {
    display: flex;
    white-space: normal;
    gap: 6px;
    align-items: center;
    & :global(.slot) {
        margin-block: 2px;
    }
    code {
        cursor: pointer;
        &.sample {
            cursor: default;
            font-style: italic;
            color: var(--mono-500);
            background-color: color-mix(in srgb, var(--muted) 50%, transparent);
        }
    }
}
</style>
