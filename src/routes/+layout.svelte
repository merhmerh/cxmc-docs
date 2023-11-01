<script>
import { supabase, session, getPermission } from "$comp/supabase.store.js";
import { initDevice } from "$comp/device.store";
import { onMount } from "svelte";
import { invalidate } from "$app/navigation";
import { beta } from "$routes/main.store";
export let data;

let ready;
$supabase = data.supabase;
$session = data.session;
$: $supabase = data.supabase;

async function refreshSession() {
    const { data, error } = await $supabase.auth.refreshSession();
    $session = data.session;
}

onMount(async () => {
    await refreshSession();

    const { data } = $supabase.auth.onAuthStateChange((event, _session) => {
        $session = _session;

        if (_session?.expires_at !== session?.expires_at) {
            invalidate("supabase:auth");
        }
    });

    initDevice();
    if (getPermission().role == "beta") {
        beta.set(true);
    } else {
        const isBeta = localStorage.getItem("beta") == "true" ? true : false;
        beta.set(isBeta);
    }

    ready = true;
    return () => data.subscription.unsubscribe();
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
{:else}
    <slot />
{/if}

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
