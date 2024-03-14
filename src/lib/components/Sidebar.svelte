<script>
import Icon from '@iconify/svelte';
import { createEventDispatcher } from 'svelte';

export let items;
let selected;
const dispatch = createEventDispatcher();

function filter(string) {
    dispatch('filter', string);
    selected = string;
}
function reset() {
    for (const [key, obj] of Object.entries(items)) {
        obj.show = false;
    }
}
</script>

<div class="container">
    {#each Object.entries(items) as [key, data]}
        <div class="entity" class:showTypes={data.show}>
            <button
                class="key none"
                on:click={() => {
                    if (!data.types.length) {
                        return filter(key);
                    }

                    if (data.show == true) {
                        data.show = false;
                        filter('');
                        reset();
                        return;
                    }

                    if (data.types.length) {
                        reset();
                        data.show = true;
                    }

                    filter(key);
                }}>
                <div>{key}</div>
                {#if data.types.length}
                    <div class="icon">
                        <Icon icon="material-symbols:expand-more" />
                        <!-- <Icon icon="iconamoon:arrow-down-2-thin" height="18" /> -->
                    </div>
                {/if}
            </button>
            {#if data.types.length}
                <div class="types">
                    {#each data.types as type}
                        <div class="type" class:selected={type == selected}>
                            <button
                                class="none"
                                on:click={() => {
                                    filter(type);
                                }}>
                                {type}
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}
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
        }

        .types {
            background-color: $bg-s;
            border-radius: 0 0 0.5rem 0.5rem;
            width: 100%;
            display: none;
            .type {
                position: relative;
                padding-left: 0.5rem;
                overflow: hidden;
                &:hover {
                    button {
                        color: $grey-dark;
                    }
                }
                button {
                    padding-block: 0.25rem;
                    font-size: 0.875rem;
                    padding-left: 0.5rem;
                    width: calc(100% - 2rem);
                    color: $main-light;
                    text-align: left;
                    display: -webkit-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }

                &:before {
                    content: '';
                    position: absolute;
                    height: calc(100%);
                    width: 1px;
                    background-color: $grey-lighter;
                }
                &:last-child {
                    margin-bottom: 0.5rem;
                }
                &.selected {
                    button {
                        color: $url;
                    }
                    &:before {
                        background-color: $url;
                    }
                }
            }
        }

        &.showTypes {
            button.key {
                background-color: $bg-alt;
                border-radius: 0.5rem 0.5rem 0 0;
                .icon {
                    & :global(svg) {
                        transform: rotateZ(0deg);
                    }
                }
            }
            .types {
                display: grid;
                background-color: $bg-alt;
            }
        }
    }
}
</style>
