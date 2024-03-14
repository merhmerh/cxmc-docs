<script>
import Icon from "@iconify/svelte";
import { createEventDispatcher } from "svelte";

export let items;
let filterString;
let selected;
let filtered = structuredClone(items);
const dispatch = createEventDispatcher();
function filter(string, fuzziness) {
    if (!fuzziness) {
        fuzziness = false;
    }
    dispatch("filter", { string, fuzziness });
    selected = string;
}
function reset() {
    for (const [key, obj] of Object.entries(items)) {
        obj.show = false;
    }
}

function filterSidebar() {
    if (!filterString) {
        return (filtered = structuredClone(items));
    }

    filtered = {};
    for (const [entity, data] of Object.entries(items)) {
        const regex = new RegExp(`${filterString}`, "i");
        if (regex.test(entity)) {
            filtered[entity] = data;
        }
    }
    filtered = filtered;
}
</script>

<div class="container">
    <div class="search">
        <input type="text" bind:value={filterString} on:input={filterSidebar} placeholder="Search IfcEntity" />
    </div>
    <div class="scroll">
        {#each Object.entries(filtered) as [key, data]}
            <div class="entity" class:showTypes={data.types.length && data.show}>
                <button
                    class="key none"
                    class:selected={selected == key}
                    on:click={() => {
                        if (data.show == true) {
                            reset();
                            data.show = false;
                            filter("");
                        } else {
                            reset();
                            data.show = true;
                            filter(`${key}`, "entity");
                        }
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
                                        filter(type, "key");
                                    }}>
                                    {type
                                        .replace(key, "")
                                        .replace(/USERDEFINED|null/, "")
                                        .replace(/\./g, "")}
                                </button>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
.container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 1rem;
    height: 100%;
    .search {
        padding-inline: 1rem 0.5rem;
        input {
            width: 100%;
            &::placeholder {
                font-size: 0.875rem;
            }
        }
    }
    .scroll {
        overflow-y: auto;
        padding-bottom: 6rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
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
                    content: "";
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
