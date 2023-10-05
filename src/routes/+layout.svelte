<script>
import { supabase, session } from "$comp/supabase.store.js";
import { initDevice } from "$comp/device.store";
import { onMount } from "svelte";
export let data;

let ready;
$supabase = data.supabase;
$session = data.session;
$: $supabase = data.supabase;
$: $session, onUpdate();
function onUpdate() {}

onMount(() => {
    initDevice();
    ready = true;
});
</script>

<svelte:head>
    <title>{data.meta.title}</title>
    <meta name="description" content={data.meta.description} />
    {#each Object.entries(data.meta.og) as [property, value]}
        <meta {property} content={value} />
    {/each}
</svelte:head>

{#if !ready}
    <div class="main__loading" />
{/if}
<slot />

<style global lang="scss">
@import "../styles/main.scss";

.main__loading {
    position: absolute;
    height: 100svh;
    width: 100vw;
    background-color: var(--bg-p);
    z-index: 1000;
}
</style>
