<script>
import Card from "./Card.svelte";
import { getPermission } from "$comp/supabase.store.js";

import Upload from "./Upload.svelte";

export let data;

let showUploader;

const { permission } = getPermission();
const canUpload = permission.edit || false;
</script>

{#if canUpload}
    {#if showUploader}
        <Upload on:close={() => (showUploader = false)} />
    {/if}
{/if}

<div class="row">
    <h1>Downloads</h1>
    {#if canUpload && !showUploader}
        <button
            class="fit"
            on:click={() => {
                showUploader = !showUploader;
            }}>Upload</button>
    {/if}
</div>

<p>This resources toolkit materials to prepare an IFC-SG model for submission through CORENET-X.</p>

<div class="cards">
    {#each data.downloads as item}
        <Card data={item}></Card>
    {/each}
</div>

<style lang="scss">
h1 {
    margin: 0;
}
.row {
    display: flex;
    justify-content: space-between;
}
.cards {
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
