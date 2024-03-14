<script>
import { fade, fly } from "svelte/transition";
import { notify } from "./notify.store";
import NotifyCard from "./NotifyCard.svelte";
</script>

<div class="container">
    {#each $notify as card (card.id)}
        <div transition:fly|global={{ y: -64, duration: 300 }}>
            <NotifyCard
                notification={card.message}
                opts={card.options}
                on:remove={() => {
                    notify.remove(card.id);
                }} />
        </div>
    {/each}
</div>

<style lang="scss">
.container {
    position: fixed;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column-reverse;
    gap: 1rem;
    z-index: 500;
}
</style>
