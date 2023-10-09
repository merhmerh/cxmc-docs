<script>
import mg_compJSON from "./mg_comp.json";
import { mg_comp } from "./mg.store";

mg_comp.set(mg_compJSON);
</script>

<div class="sidebar">
    {#each $mg_comp as { IdentifiedComponent }}
        <a href="/mg/{IdentifiedComponent.replace(/\s/g, '-').toLowerCase()}">{IdentifiedComponent}</a>
    {/each}
</div>

<div class="content">
    <slot />
</div>

<style lang="scss">
.sidebar {
    position: sticky;
    top: 70px;
    height: calc(100svh - 70px);
    overflow-y: auto;
    border-right: 1px solid $grey-lighter;
    display: flex;
    flex-direction: column;
    @media screen and (max-width: $mobile) {
        position: fixed;
        left: 0px;
        top: calc(70px + 32px);
        height: calc(100svh - 70px - 32px);
        z-index: 100;
        transform: translateX(-100%);
        background-color: $bg-p;
        max-width: 90vw;
        transition: all 0.3s;
        &.m__show {
            transform: translateX(0%);
        }
    }
}

.content {
    padding-top: 2rem;
    margin-inline: auto;
    width: 100%;
    max-width: min(calc(100vw - 300px), 1500px);
    min-height: calc(100svh - 70px);
    padding-bottom: 100px;
    padding-inline: 2rem;
    @media screen and (max-width: $mobile) {
        width: 100%;
        max-width: none;
        padding-inline: 1rem;
        font-size: 0.875rem;
        padding-top: 1rem;
    }
}
</style>
