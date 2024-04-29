<script>
import { Modal, Select } from "merh-forge-ui";
import { theme } from "$comp/theme.store";
import defaultMeasureResourceList from "$cfg/MeasureResource.json";
import { createEventDispatcher, tick } from "svelte";
import { fly } from "svelte/transition";
import { notify } from "merh-forge-ui";
import Icon from "@iconify/svelte";
export let data;
let measureResourceList = defaultMeasureResourceList;
let showModal = false;

let showComplexMeasureList;
let remount = true;

let addEnumValue, enumEditWithJSON, enumJSONEditor;

const dispatch = createEventDispatcher();

$: showComplexMeasureList, updateList();

async function updateList() {
    if (showComplexMeasureList) {
        measureResourceList = defaultMeasureResourceList;
    } else {
        measureResourceList = ["IfcReal", "IfcAreaMeasure", "IfcLabel"];
    }
    remount = false;
    await tick();
    remount = true;
}

export function show() {
    showModal = true;
}

export function close() {
    showModal = false;
}

export async function updateProp(updateData) {
    if (updateData) {
        data = updateData;
    }
    dispatch("updateStart", data.prop.PropertyName);
    const resp = await fetch("/api/ifcsg/update-prop", {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data.prop),
    });

    const result = await resp.json();

    if (result.error) {
        notify.add(result.error.message);
        return;
    }
    data.prop = result;
    console.log(data);
    dispatch("update", data);
    showModal = false;
}
</script>

{#if showModal}
    <Modal
        exitOutsideClick={false}
        showModal={true}
        on:close={() => {
            showModal = false;
        }}>
        <div class="modal">
            {#if data.code == "update-IfcMeasureResource"}
                <h1>Update IfcMeasureResource</h1>

                <span class="info"> Update IfcMeasureResource for "{data.prop.propertyName}" </span>
                <table class="horizontal {$theme}">
                    <tr>
                        <th style="width:100px">PropertyName</th>
                        <td>{data.prop.propertyName}</td>
                    </tr>
                    <tr>
                        <th>DataType</th>
                        <td>{data.prop.dataType}</td>
                    </tr>
                    <tr>
                        <th style="vertical-align: top;">IfcMeasureResource</th>
                        <td>{data.prop.measureResource || "–"}</td>
                    </tr>
                </table>

                <div class="row">
                    <input id="measureResouceListSimple" type="checkbox" bind:checked={showComplexMeasureList} />
                    <label for="measureResouceListSimple">Show all value types</label>
                </div>

                <div class="select" transition:fly|global>
                    {#if remount}
                        <Select
                            searchable
                            dropdownRelative
                            rows={measureResourceList.length < 8 ? measureResourceList.length : 8}
                            items={measureResourceList}
                            style={{ borderRadius: "0.5rem", padding: ".5rem" }} />
                    {/if}
                </div>
                <div class="buttonGroup">
                    <button
                        class="icon alt"
                        on:click={() => {
                            //
                        }}>
                        Confirm
                    </button>
                    <button on:click={close}>Cancel</button>
                </div>
            {:else if data.code == "update-description"}
                <h1>Update description</h1>

                <span class="info"> Update description for "{data.prop.PropertyName}" </span>
                <table class="horizontal {$theme}">
                    <tr>
                        <th style="width:100px">PropertyName</th>
                        <td>{data.prop.PropertyName}</td>
                    </tr>
                    <tr>
                        <th>DataType</th>
                        <td>{data.prop.DataType}</td>
                    </tr>
                    <tr>
                        <th style="vertical-align: top;">IfcMeasureResource</th>
                        <td>{data.prop.IfcMeasureResource || "–"}</td>
                    </tr>
                </table>

                <textarea bind:value={data.prop.Description} placeholder="Enter description"></textarea>

                <div class="buttonGroup">
                    <button
                        class="icon alt"
                        on:click={() => {
                            updateProp();
                        }}>
                        Confirm
                    </button>
                    <button on:click={close}>Cancel</button>
                </div>
            {:else if data.code == "update-enums"}
                <h1>Update Enums</h1>

                <span class="info"> Update enumeration for "{data.prop.PropertyName}" </span>
                <table class="horizontal {$theme}">
                    <tr>
                        <th style="width:100px">PropertyName</th>
                        <td>{data.prop.PropertyName}</td>
                    </tr>
                    <tr>
                        <th>DataType</th>
                        <td>{data.prop.DataType}</td>
                    </tr>
                    <tr>
                        <th style="vertical-align: top;">IfcMeasureResource</th>
                        <td>{data.prop.IfcMeasureResource || "–"}</td>
                    </tr>
                </table>

                <div class="row">
                    <input
                        id="enumEditWithJSON"
                        type="checkbox"
                        bind:checked={enumEditWithJSON}
                        on:input={() => {
                            if (enumJSONEditor) {
                                try {
                                    data.prop.Enums = JSON.parse(enumJSONEditor.value);
                                } catch (error) {
                                    notify.add("Syntax Error");
                                }
                            }
                        }} />
                    <label for="enumEditWithJSON">Edit with JSON</label>
                </div>

                {#if enumEditWithJSON}
                    <textarea
                        bind:this={enumJSONEditor}
                        rows="12"
                        value={JSON.stringify(data.prop.Enums, null, 2)}
                        on:keydown={(e) => {
                            if (e.key === "Tab") {
                                e.preventDefault();
                                e.stopPropagation();

                                const textarea = e.target;
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const spaces = "  "; // Two spaces
                                const text = textarea.value;
                                textarea.value = text.substring(0, start) + spaces + text.substring(end);

                                textarea.selectionStart = start + spaces.length;
                                textarea.selectionEnd = start + spaces.length;
                            }
                        }} />
                {:else}
                    <div class="inputBox">
                        <input
                            type="text"
                            bind:value={addEnumValue}
                            placeholder="Add enum"
                            on:keydown={(e) => {
                                if (e.key == "Enter") {
                                    const exists = data.prop.Enums.some(
                                        (x) => x.toLowerCase() === addEnumValue.toLowerCase(),
                                    );
                                    if (exists) {
                                        notify.add("already exist");
                                        return;
                                    }
                                    data.prop.Enums = [...data.prop.Enums, addEnumValue];
                                    addEnumValue = "";
                                }
                            }} />
                        <button
                            class="none"
                            on:click={() => {
                                data.prop.Enums = [...data.prop.Enums, addEnumValue];
                                addEnumValue = "";
                            }}>Add</button>
                    </div>

                    <div class="label__list">
                        {#each data.prop.Enums as value}
                            <span>
                                {value}
                                <button
                                    class="none noHover"
                                    on:click={() => {
                                        data.prop.Enums = data.prop.Enums.filter((x) => x !== value);
                                    }}>
                                    <Icon icon="material-symbols:close" height="16" />
                                </button>
                            </span>
                        {/each}
                    </div>
                {/if}

                <div class="buttonGroup">
                    <button
                        class="icon alt"
                        on:click={() => {
                            updateProp();
                        }}>
                        Confirm
                    </button>
                    <button on:click={close}>Cancel</button>
                </div>
            {/if}
        </div>
    </Modal>
{/if}

<style lang="scss">
.modal {
    width: 500px;
    display: flex;
    flex-direction: column;
    height: auto;
    // min-height: 400px;
    gap: 1rem;
    h1 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 24px;
        position: relative;
        width: fit-content;
        &:after {
            position: absolute;
            bottom: -0.5rem;
            left: 0;
            content: "";
            width: 100%;
            height: 4px;
            background-color: var(--accent-500);
        }
    }
    .info {
        color: var(--mono-500);
        font-size: 0.875rem;
    }
    .buttonGroup {
        padding-top: 1rem;
        margin-top: auto;
        display: flex;
        flex-direction: row-reverse;
        margin-right: auto;
        gap: 0.5rem;
        button {
            width: 100px;
        }
    }
    .select {
        padding: 0 !important;
        font-size: 0.875rem;
        width: 100%;
    }
    .inputBox {
        padding-right: 0.25rem;
        input {
            width: 100%;
        }
        button {
            background-color: $accent;
            padding-inline: 0.75rem;
            padding-block: 0.325rem;
            font-size: 0.875rem;
            color: var(--main-alt);
        }
    }
    .label__list {
        display: flex;
        // background-color: red;
        width: 100%;
        flex-wrap: wrap;
        gap: 4px;
        background-color: $bg-s;
        border: 1px solid var(--mono-100);
        border-radius: 0.25rem;
        padding: 0.5rem;
        min-height: 80px;
        span {
            border-radius: 0.25rem;
            font-size: 0.875rem;
            padding: 0.25rem 0.25rem;
            padding-left: 0.5rem;
            background-color: $muted;
            display: flex;
            gap: 0.25rem;
            align-items: center;
            color: var(--mono-800);
            height: fit-content;
            button {
                padding: 0;
                color: var(--mono-900);
            }
        }
    }
}
</style>
