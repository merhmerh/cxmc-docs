<script>
import Card from "./Card.svelte";
import { getPermission } from "$comp/supabase.store.js";
import { Modal } from "merh-forge-ui";
import Upload from "./Upload.svelte";
import ThirdParty from "./ThirdParty.svelte";

export let data;

let showUploader;

const { permission } = getPermission();
const canUpload = permission.edit || false;
</script>

{#if canUpload}
    <Modal bind:this={showUploader} let:closeFromChild exitOutsideClick={false} exitWithEscapeKey={false}>
        <Upload on:close={() => closeFromChild()} />
    </Modal>
{/if}

<div class="row">
    <h1>Downloads</h1>
    {#if canUpload}
        <button
            class="fit"
            on:click={() => {
                showUploader.show();
            }}>Upload</button>
    {/if}
</div>

<p>This resources toolkit materials to prepare an IFC-SG model for submission through CORENET-X.</p>

<div class="cards">
    {#each data.downloads as item}
        <Card data={item}></Card>
    {/each}

    <ThirdParty></ThirdParty>
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
