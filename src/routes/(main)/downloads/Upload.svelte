<script>
import Icon from "@iconify/svelte";
import { calculateChecksum, timeout } from "$fn/helper";
import { supabase as sb } from "$comp/supabase.store.js";
import { Select, Switch } from "merh-forge-ui";
import { createEventDispatcher, onMount } from "svelte";
const dispatch = createEventDispatcher();

const supabase = $sb;
let category, upload_file, description, title;

let newCategory, newFileType, titles, awaiting;

function close() {
    dispatch("close");
}

async function upload() {
    const file = upload_file[0];

    const checksum = await calculateChecksum(file);

    const publicUrl = await new Promise(async (resolve, reject) => {
        //prettier-ignore
        const { data, error } = await supabase.storage
            .from("public")
            .upload(`downloads/${file.name}`, file, {
                upsert: true,
            });
        if (error) {
            console.log(error);
            reject();
        }

        const { data: url } = await supabase.storage.from("public").getPublicUrl(data.path);
        resolve(url.publicUrl);
    });

    const { data: result, error } = await supabase
        .from("downloads")
        .insert({
            category: category,
            title: title,
            description: description,
            fileName: file.name,
            fileSize: file.size,
            type: file.type,
            checksum: checksum,
            url: publicUrl,
        })
        .select();
    if (error) {
        console.log(err);
    } else {
        console.log(result);
    }

    category = null;
    upload_file = "";
    description = null;
    close();
}

const categories = ["Common Documents", "Revit", "Archicad"];
</script>

{#if awaiting}
    <div class="awaitingOverlay">
        <div class="icon">
            <Icon icon="line-md:loading-twotone-loop" height="80" />
        </div>
    </div>
{/if}

<div class="modal" class:awaiting>
    <h3>Uploader</h3>
    <div class="field">
        <div class="labelGroup">
            <div class="label">Category</div>
            <div class="flex gap-1 items-center">
                <span class="toggleLabel">New category</span>
                <Switch
                    bind:isChecked={newCategory}
                    on:change={() => {
                        category = "";
                        description = "";
                    }} />
            </div>
        </div>

        {#if newCategory}
            <input bind:value={category} type="text" placeholder="Enter New Category" />
        {:else}
            <Select
                items={categories}
                placeholder="Select"
                style={{ padding: "0.5rem", borderRadius: "0.25rem" }}
                rows={3}
                on:change={async (e) => {
                    category = e.detail.value;

                    let completed;

                    const dataPromise = new Promise(async (resolve) => {
                        const { data, error } = await $sb.from("downloads").select().eq("category", category);
                        const result = data.map((x) => x.title).filter((x) => x !== null);
                        resolve(result);
                    });

                    setTimeout(() => {
                        if (completed) return;
                        awaiting = true;
                    }, 500);

                    titles = await dataPromise;
                    completed = true;
                    awaiting = false;
                }} />
        {/if}
    </div>

    <div class="field" class:muted={!category}>
        <div class="labelGroup">
            <div class="label">Title</div>
            <div class="flex gap-1 items-center">
                <span class="toggleLabel">New File</span>
                <Switch
                    bind:isChecked={newFileType}
                    on:change={() => {
                        if (newFileType) {
                            description = "";
                        }
                    }} />
            </div>
        </div>

        {#if newFileType}
            <input bind:value={title} type="text" placeholder="Title" />
        {:else}
            {#key titles}
                <Select
                    items={titles}
                    placeholder="Select"
                    style={{ padding: "0.5rem", borderRadius: "0.25rem" }}
                    rows={titles ? titles.length : 0}
                    on:change={async (e) => {
                        title = e.detail.value;
                        const { data } = await $sb
                            .from("downloads")
                            .select()
                            .eq("title", title)
                            .order("created_at", { ascending: false })
                            .single();
                        console.log(data);
                        description = data.description;
                    }} />
            {/key}
        {/if}
    </div>

    <textarea bind:value={description} type="text" placeholder="Description" />

    <input bind:files={upload_file} type="file" />

    <div class="btn">
        <button class="alt" on:click={upload}>Upload</button>
        <button class="" on:click={close}>Cancel</button>
    </div>
</div>

<style lang="scss">
.awaitingOverlay {
    content: "";
    position: absolute;
    width: calc(100% - 0rem);
    height: calc(100% - 0rem);
    // background-color: color-mix(in srgb, var(--mono) 30%, transparent);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 1rem;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal {
    margin-inline: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 600px;
    padding: 1rem;
    &.awaiting {
        filter: opacity(0.5);
    }
    .field {
        &.muted {
            filter: opacity(0.5);
            user-select: none;
            pointer-events: none;
        }
        div.labelGroup {
            gap: 0.5rem;
            align-items: center;
            display: flex;
            justify-content: space-between;
            .toggleLabel {
                font-size: 14px;
                color: var(--mono);
            }
        }
    }
    input {
        color: $main;
        &[type="file"] {
            resize: none;
        }
    }
    .btn {
        padding-top: 0.5rem;
    }
}
</style>
