<script>
import { uuid } from "$fn/helper.js";
import Icon from "@iconify/svelte";
import { createEventDispatcher } from "svelte";

const dispatch = createEventDispatcher();

export let data;

function newProp() {
    data.props.push({
        id: uuid(),
        PropertySet: "",
        PropertyName: "",
        DataType: "",
    });

    data = data;
}

function deleteItem() {
    dispatch("deleteItem", data.id);
}

function deleteProp(id) {
    data.props = data.props.filter((prop) => prop.id !== id);
    data = data;
}
</script>

<div class="container">
    <div class="card">
        <div class="entity">
            <div class="inputField">
                <label for="">IfcEntity</label>
                <input type="text" bind:value={data.IfcEntity} />
            </div>

            <!-- <div class="inputField">
                <label for="">PredefinedType</label>
                <input type="text" bind:value={data.PredefinedType} />
            </div>

            <div class="inputField">
                <label for="">ObjectType</label>
                <input type="text" bind:value={data.ObjectType} />
            </div> -->
        </div>
        {#each data.props as prop (prop.id)}
            <div class="pset">
                <div class="inputField">
                    <label for="">PropertySet</label>
                    <input type="text" bind:value={prop.PropertySet} />
                </div>
                <div class="inputField">
                    <label for="">PropertyName</label>
                    <input type="text" bind:value={prop.PropertyName} />
                </div>
                <div class="inputField">
                    <label for="">DataType</label>
                    <input type="text" bind:value={prop.DataType} />
                </div>
                <button class="icon round" on:click={() => deleteProp(prop.id)}>
                    <Icon icon="material-symbols:close" width="18" />
                </button>
            </div>
        {/each}
        <span class="info"
            >DataType should only be Length, Label, Integer, Boolean, Real, Area
        </span>

        <button class="fit" on:click={newProp}>Add another property</button>
    </div>
    <button class="icon" on:click={deleteItem}>
        <Icon icon="material-symbols:delete-outline" width="18" />
    </button>
</div>

<style lang="scss">
.container {
    display: flex;
    align-items: flex-start;
    width: 100%;
    gap: 1rem;
    margin-block: 1rem;
}

.card {
    display: flex;
    flex-direction: column;
    border-radius: 0.5rem;
    padding: 2rem;
    padding-inline: 1.5rem;
    width: fit-content;
    width: 100%;
    background-color: var(--bg-s);
    gap: 0.5rem;
    span.info {
        color: var(--mono-600);
        font-size: 0.875rem;
    }
    .entity,
    .pset {
        gap: 0.5rem;
        display: flex;
        button.icon {
            margin-top: 1.5rem;
            border-radius: 100%;
            border-color: var(--red);
            color: var(--red);
            width: 32px;
            height: 32px;
        }
    }
    .inputField {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        label {
            color: var(--mono-600);
            font-size: 0.875rem;
        }
        input {
            border-radius: 0.5rem;
        }
    }
    button.fit {
        margin-top: 1rem;
    }
}

button.icon {
    height: 40px;
    aspect-ratio: 1;
    padding: 0.5rem;
}
</style>
