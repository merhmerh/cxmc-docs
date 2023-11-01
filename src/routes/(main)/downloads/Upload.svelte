<script>
import { calculateChecksum } from "$fn/helper";
import { supabase as sb } from "$comp/supabase.store.js";
import { createEventDispatcher } from "svelte";
import { notify } from "merh-forge-ui";
const dispatch = createEventDispatcher();

const supabase = $sb;
let upload_category, upload_file, upload_description, reset;

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
            category: upload_category.value,
            description: upload_description.value,
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

    upload_category.value = null;
    upload_file = "";
    upload_description.value = null;
    reset = false;
}
</script>

{#key reset}
    <div class="modal">
        <h3>Uploader</h3>
        <input bind:this={upload_category} type="text" placeholder="Category (e.g. Common Documents)" />
        <input bind:files={upload_file} type="file" />
        <textarea bind:this={upload_description} type="text" placeholder="Description" />
        <div>
            <button class="alt" on:click={upload}>Upload</button>
            <button class="" on:click={close}>Cancel</button>
        </div>
    </div>
{/key}

<style lang="scss">
.modal {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 600px;
    padding: 1rem;
    border: 1px solid grey;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
    margin-inline: auto;

    input {
        color: $main;
        &[type="file"] {
            resize: none;
        }
    }
}
</style>
