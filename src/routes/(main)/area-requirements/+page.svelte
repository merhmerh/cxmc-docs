<script>
import { theme } from "$comp/theme.store";
import areaPset from "./areaPset.json";
import { toURLPath } from "$fn/helper";
import Image from "./Image.svelte";

export let data;
console.log(data);
</script>

{#each data.pageContent.content as { type, content }}
    {#if type == "header"}
        <h1>{content}</h1>
    {/if}
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
            <div class="img-container">
                <img src={content[0]} alt="" />
            </div>
        {:else}
            <div class="image_container">
                {#each content as image}
                    <Image src={image}></Image>
                {/each}
            </div>
        {/if}
    {/if}
{/each}

<h2>Summary</h2>

<div class="table_wrapper">
    {#each areaPset as { SubType, PropertySet, Properties }}
        <table class="{$theme} noActionColumn">
            <thead>
                <tr>
                    <th><div><a href="/area-requirements/{toURLPath(SubType)}">{SubType}</a></div></th>
                </tr>
                <tr><th><div>{PropertySet}</div></th></tr>
            </thead>
            <tbody>
                {#each Array(8) as _, i}
                    <tr><td><div>{Properties[i]?.PropertyName || ""}</div></td></tr>
                {/each}
            </tbody>
        </table>
    {/each}
</div>

<style lang="scss">
.table_wrapper {
    margin: 0;
    display: flex;
    align-items: flex-start;
    flex-direction: row;
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
            }
        }
        td {
            div {
                min-height: 28px;
            }
        }
    }
}
</style>
