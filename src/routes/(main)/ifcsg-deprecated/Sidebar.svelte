<script>
import Icon from "@iconify/svelte";
import { createEventDispatcher } from "svelte";
import { debounce } from "$fn/helper";
export let data;

const dispatch = createEventDispatcher();

let list = mutateData(data);
let searched,
    input,
    selectedEntity = [],
    selectedType,
    searchString,
    dispatchEntities,
    dispatchKeys;

function mutateData(data) {
    const map = new Map();
    for (const row of data) {
        const c = {
            entity: row.entity,
            subtype: row.objectType == null ? row.predefinedType : row.objectType,
            key: row.key,
            status: row.status,
        };
        if (!map.has(row.entity)) {
            map.set(row.entity, [c]);
        } else {
            map.get(row.entity).push(c);
        }
    }

    const sorted = Array.from(map).sort((a, b) => a[1] - b[1]);

    const result = {};
    for (const [key, arr] of sorted) {
        let keywords = [key];
        for (const type of arr) {
            keywords.push(type.subtype);
        }
        keywords = keywords.join(",");
        result[key] = {
            keywords,
            selected: false,
            types: arr,
        };
    }

    return result;
}

function handleKeyDown(e) {
    if (e.ctrlKey && e.code == "KeyE") {
        e.preventDefault();
        input.focus();
    }
}

const update = debounce(sendFilter, 150);

function filterSearch() {
    selectedEntity = [];
    dispatchKeys = [];
    if (searchString.length == 0) {
        for (const [entity, obj] of Object.entries(list)) {
            obj.selected = false;
            for (const type of obj.types) {
                type.hide = false;
            }
        }
        searched = false;
        return;
    }

    searched = true;
    for (const [entity, obj] of Object.entries(list)) {
        obj.selected = false;
        const regex = new RegExp(searchString, "gi");
        if (obj.keywords.match(regex)) {
            for (const type of obj.types) {
                type.hide = true;

                if (entity.match(regex)) {
                    // obj.selected = true;
                    type.hide = false;
                    dispatchKeys.push(type.key);

                    if (!selectedEntity.includes(entity)) {
                        selectedEntity.push(entity);
                    }
                    continue;
                }

                if (type.subtype.match(regex)) {
                    type.hide = false;
                    dispatchKeys.push(type.key);
                    // obj.selected = true;
                    if (!selectedEntity.includes(entity)) {
                        selectedEntity.push(entity);
                    }
                }
            }
        }
    }
    // console.log(searched, selectedEntity);
    list = list;

    dispatchEntities = selectedEntity;
    // console.log(dispatchKeys);

    update();
}

function resetSelected() {
    for (const [entity, arr] of Object.entries(list)) {
        arr.selected = false;
    }
}

function sendFilter() {
    // console.log("send");
    window.scrollTo(0, 0);

    dispatch("update", {
        entity: dispatchEntities,
        key: dispatchKeys,
    });
}
// console.log(list);
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="container">
    <div class="inputBox">
        <input
            class="placeholder-smaller"
            bind:this={input}
            type="text"
            bind:value={searchString}
            on:input={filterSearch}
            placeholder="Search Entity and Types" />
        <div class="kbs">
            <code>Ctrl</code>
            <code>E</code>
        </div>
    </div>

    <div class="scrollable">
        {#each Object.entries(list) as [entity, arr]}
            <div class="row" class:hide={searched && !selectedEntity.includes(entity)} class:selected={arr.selected}>
                <button
                    class="key none"
                    on:click={() => {
                        resetSelected();

                        if (searched) {
                            // console.log(selectedEntity);
                            // selectedEntity = entity;
                            arr.selected = true;
                            // console.log(selectedEntity);
                            selectedType = null;
                            dispatchEntities = [entity];
                            dispatchKeys = null;
                            sendFilter();
                            return;
                        }

                        // arr.selected = !arr.selected;
                        if (selectedEntity.includes(entity)) {
                            selectedEntity = selectedEntity.filter((x) => x !== entity);
                        } else {
                            selectedEntity.push(entity);
                        }

                        arr.selected = true;
                        selectedType = null;
                        dispatchEntities = [entity];
                        dispatchKeys = null;
                        sendFilter();
                    }}>
                    <div>{entity}</div>
                    {#if arr.types.length && arr.types[0].subtype}
                        <div class="icon" class:selected={arr.selected}>
                            <Icon icon="material-symbols:expand-more" />
                        </div>
                    {/if}
                </button>
                {#if arr.types.length && arr.types[0].subtype}
                    <div class="types" class:expand={selectedEntity.includes(entity)}>
                        {#each arr.types as type}
                            {#if !type.hide}
                                <div class="type" class:selected={selectedType == type.key}>
                                    <button
                                        class="none"
                                        class:invalid={!type.status}
                                        on:click={() => {
                                            arr.selected = false;
                                            selectedType = type.key;
                                            dispatchKeys = [type.key];
                                            sendFilter();
                                        }}>
                                        {type.subtype}
                                    </button>
                                </div>
                            {/if}
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
    padding-top: 1rem;
    height: 100%;
    padding-inline: 1rem 0.5rem;
}
.inputBox {
    display: grid;
    grid-template-columns: auto auto;
    width: 100%;
    margin-block: 0.5rem;
    input {
        min-width: 0;
    }
}
.scrollable {
    padding-right: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    scrollbar-gutter: stable;
    overflow-y: auto;
    padding-bottom: 6rem;
}
.row {
    background-color: $bg-s;
    border-radius: 0.5rem;
    &:hover {
        background-color: $bg-alt;
    }
    &.selected {
        background-color: $bg-alt;
        button {
            color: $url;
        }
    }
    &.hide {
        display: none;
    }
}
button.key {
    font-size: 1rem;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    &:hover {
        color: $url;
    }
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
        &.selected {
            & :global(svg) {
                transform: rotateZ(0deg);
            }
        }
    }
}
.types {
    margin-top: 0rem;
    border-radius: 0 0 0.5rem 0.5rem;
    width: 100%;
    padding-left: 0.5rem;
    display: none;

    &.expand {
        display: block;
    }
    .type {
        position: relative;
        padding-left: 0.25rem;
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

            &.invalid {
                text-decoration: line-through !important;
                color: $grey-lighter;
            }
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
</style>
