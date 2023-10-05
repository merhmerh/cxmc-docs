<script>
import { Modal, Select } from "merh-forge-ui";
import { theme } from "$comp/theme.store";
import defaultMeasureResourceList from "./MeasureResource.json";
import { createEventDispatcher, tick } from "svelte";
import { fly } from "svelte/transition";
import { notify } from "merh-forge-ui";

export let data;
let measureResourceList = defaultMeasureResourceList;
let showModal;

let showComplexMeasureList;
let remount = true;

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
    // modal.show();
    showModal = true;
    console.log(data);
}
export function close() {
    showModal = false;
}

async function updateDescription() {
    const resp = await fetch("/api/ifcsg/update-description", {
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
    console.log(data.prop);
    dispatch("update", data);
    showModal = false;
}

export async function updateProp(data) {
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

                <div class="select" transition:fly>
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
                    <button class="icon alt" on:click={updateDescription}> Confirm </button>
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
        // & :global(.select) {
        //     padding: 0;
        //     border: 0;
        // }
        // & :global(.select.open) {
        //     border-bottom: 0 !important;
        // }
        // & :global(.select__container) {
        //     width: 100%;
        // }
        // & :global(.dropdown) {
        //     margin-top: 0.5rem;
        //     border-top: 1px solid var(--accent-500);
        //     border-radius: 0.25rem;
        // }
        // & :global(.items_container) {
        //     overflow-x: hidden;
        //     width: 320px;
        // }
    }
}
</style>
