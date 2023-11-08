<script>
import Icon from "@iconify/svelte";
import dayjs from "dayjs";
import thirdPartyApps from "./thirdPartyApps.json";
import { convertToHTMLAnchor } from "$fn/helper";

let isOpen = false;
</script>

<div class="card accordion">
    <button
        class="none noHover header"
        on:click={() => {
            isOpen = !isOpen;
        }}>
        <h3>Third Party Tools</h3>

        <div class="expand">
            <div class="icon">
                <Icon icon="ic:round-expand-more" height="32" vFlip={isOpen} />
            </div>
        </div>
    </button>

    {#if isOpen}
        {#each thirdPartyApps as app}
            <div class="card inner">
                <h4>{app.title}</h4>

                <div class="description">{app.description}</div>

                <p>{@html convertToHTMLAnchor(app.paragraph)}</p>
            </div>
        {/each}
    {/if}
</div>

<style lang="scss">
h3,
h4 {
    padding: 0;
    margin: 0;
}
.card {
    &.accordion {
        padding: 1rem 2rem;
        background-color: var(--bg-p);
        gap: 1rem;
        @media screen and (max-width: $mobile) {
            padding: 0.25rem 1rem;
        }

        button.header {
            display: flex;
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s;

            .expand > .icon {
                border-radius: 0.25rem;
                padding: 0.25rem;
            }
            &:hover {
                color: $url;
            }
        }
    }
    &.inner {
        padding-inline: 1rem;
        padding-block: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        p {
            margin: 0;
        }
    }
}
</style>
