<script>
import Icon from "@iconify/svelte";
import { createEventDispatcher, onMount } from "svelte";
import { ifcData } from "./ifcsg.store";
import { page } from "$app/stores";
import { debounce } from "$fn/helper";
import { goto } from "$app/navigation";
import { isMobile } from "$comp/device.store";

$: $ifcData, mutateData();
$: $page, updatePageData();

const dispatch = createEventDispatcher();
onMount(() => {
    for (const [key, obj] of Object.entries(list)) {
        if (key == $page.params.entity) {
            obj.expand = true;
        } else {
            obj.expand = false;
        }
    }
    list = list;
});

let list,
    input,
    searchString,
    searchParamsKey,
    searchResult = true;

function updatePageData() {
    searchParamsKey = $page.url.searchParams.get("k") || null;
}

function mutateData() {
    const data = $ifcData;
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

    list = result;
}

function handleKeyDown(e) {
    if (e.ctrlKey && e.code == "KeyE") {
        e.preventDefault();
        input.focus();
        if (input.value) {
            input.select();
        }
    }
}

function filter() {
    if (searchString.length == 0) {
        for (const [entity, obj] of Object.entries(list)) {
            obj.hide = false;
            obj.expand = false;
            for (const type of obj.types) {
                type.hide = false;
            }
        }
        list = list;
        searchResult = true;
        search("/ifcsg");
        return;
    }

    searchResult = false;
    if (searchString.split(/[\:\.]/).length == 2) {
        const [searchEntity, searchSubtype] = searchString.split(/[\:\.]/);

        const regex_entity = new RegExp(searchEntity, "i");
        const regex_subtype = new RegExp(searchSubtype, "i");

        for (const [entity, obj] of Object.entries(list)) {
            obj.selected = false;
            obj.hide = true;
            obj.expand = false;

            if (entity.match(regex_entity)) {
                for (const type of obj.types) {
                    type.hide = true;
                    if (type.subtype.match(regex_subtype)) {
                        type.hide = false;
                        obj.expand = true;
                        obj.hide = false;
                        searchResult = true;
                        continue;
                    }
                }
            }
        }

        //
    } else {
        const regex = new RegExp(searchString, "gi");
        for (const [entity, obj] of Object.entries(list)) {
            obj.selected = false;
            obj.hide = true;

            if (obj.keywords.match(regex)) {
                obj.hide = false;
                obj.expand = true;
                for (const type of obj.types) {
                    type.hide = true;

                    if (entity.match(regex)) {
                        type.hide = false;
                        searchResult = true;
                        continue;
                    }

                    if (type.subtype.match(regex)) {
                        type.hide = false;
                        searchResult = true;
                    }
                }
            }
        }
    }
    list = list;

    if ($isMobile) return;
    search(`/ifcsg/all?s=${searchString}`);
}

const search = debounce(filter_and_updateURL, 300);

function filter_and_updateURL(url) {
    goto(url, {
        keepFocus: true,
    });
}
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="container">
    <div class="inputBox">
        <input
            class="placeholder-smaller"
            bind:this={input}
            type="search"
            bind:value={searchString}
            on:input={filter}
            on:keydown={(e) => {
                if (e.key == "Enter" && $isMobile) {
                    filter();
                }
            }}
            placeholder="Search Entity and Types" />
        <div class="kbs">
            <code>Ctrl</code>
            <code>E</code>
        </div>
    </div>

    <div class="scrollable">
        {#each Object.entries(list) as [entity, arr]}
            <div class="row" class:selected={$page.params.entity == entity} class:hide={arr.hide}>
                <a
                    class="key"
                    href="/ifcsg/{entity}"
                    on:click={async () => {
                        dispatch("onNavigate");
                        for (const [key, obj] of Object.entries(list)) {
                            if (key == entity) {
                                console.log("??");
                                obj.expand = true;
                            } else {
                                obj.expand = false;
                            }
                        }
                        list = list;
                    }}>
                    <span> {entity}</span>
                    {#if arr.types.length && arr.types[0].subtype}
                        <div class="icon" class:selected={arr.expand}>
                            <Icon icon="material-symbols:expand-more" />
                        </div>
                    {/if}
                </a>

                {#if arr.types.length && arr.types[0].subtype}
                    <div class="types" class:expand={arr.expand}>
                        {#each arr.types as type}
                            {#if !type.hide}
                                <div class="type" class:selected={searchParamsKey == type.subtype.toLowerCase()}>
                                    <a
                                        href="/ifcsg/{entity}?k={type.subtype.toLowerCase()}"
                                        class="noHover none"
                                        class:invalid={!type.status}
                                        on:click={() => {
                                            dispatch("onNavigate");
                                        }}>
                                        {type.subtype}
                                    </a>
                                </div>
                            {/if}
                        {/each}
                    </div>
                {/if}
            </div>
        {/each}

        {#if !searchResult}
            <div class="no_result">No result found for "{searchString}"</div>
        {/if}
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
    .row {
        background-color: $bg-s;
        border-radius: 0.5rem;
        &:hover {
            background-color: $bg-alt;
        }
        &.selected {
            background-color: $bg-alt;
            // background-color: color-mix(in srgb, var(--accent-100) 12%, var(--bg-alt));
            a {
                color: $url;
            }
            a.key {
                position: relative;
            }
        }
        &.hide {
            display: none;
        }
    }
    a.key {
        font-size: 1rem;
        justify-content: space-between;
        align-items: center;
        display: flex;
        padding: 0.5rem;
        text-decoration: none;
        color: var(--main);
        transition: all 0.3s;
        &:hover {
            color: $url;
        }
        span {
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
                a {
                    color: $grey-dark;
                }
            }
            a {
                text-decoration: none;
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
                    color: var(--mono-200);
                }
            }

            &:before {
                content: "";
                position: absolute;
                height: calc(100%);
                width: 1px;
                background-color: var(--mono-200);
            }
            &:last-child {
                margin-bottom: 0.5rem;
            }

            &.selected {
                a {
                    color: $url;
                }
                &:before {
                    width: 2px;
                    background-color: $url;
                }
            }
        }
    }
    .no_result {
        font-size: 0.875rem;
        padding: 0.5rem 0rem;
        // background-color: $bg-alt;
        // width: fit-content;
        border-radius: 0.25rem;
    }
}
</style>
