<script>
import Icon from '@iconify/svelte';
import { createEventDispatcher } from 'svelte';

export let items;
const dispatch = createEventDispatcher();

function filter(string) {
    dispatch('filter', string);
}
function reset() {
    items.map((x) => {
        x.show = false;
    });
    items = items;
}
</script>

<div class="container">
    {#each items as data}
        <div class="entity">
            <button
                class="key none"
                class:selected={data.show == true}
                data-attribute={data.show}
                on:click={() => {
                    if (data.show == true) {
                        reset();
                        filter('');
                        return;
                    }

                    if (data.show == false) {
                        reset();
                        data.show = true;
                        filter(data.name);
                        return;
                    }
                }}>
                <div>{data.name}</div>
            </button>
        </div>
    {/each}
</div>

<style lang="scss">
.container {
    display: flex;
    flex-direction: column;
    padding-bottom: 6rem;
    gap: 0.5rem;
    padding-top: 1rem;
    .entity {
        padding-inline: 1rem 0.5rem;

        button.key {
            background-color: $bg-s;
            border-radius: 0.5rem;
            padding: 0.5rem;
            font-size: 1rem;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            div {
                text-align: left;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .icon {
                width: 24px;
                height: 24px;
                color: $main-light;
                padding-left: 0.5rem;
                @include flex-center;
                & :global(svg) {
                    transition: all 0.3s;
                    transform: rotateZ(-90deg);
                }
            }
            &:hover {
                color: $url;
                background-color: $bg-alt;
            }
            &.selected {
                background-color: $accent;
                color: $main-alt;
            }
        }
    }
}
</style>
