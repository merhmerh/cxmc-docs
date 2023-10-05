<script>
import Icon from "@iconify/svelte";
import { theme } from "$comp/theme.store";
import Editor from "./Editor.svelte";
import { goto } from "$app/navigation";
import { listOfGuides } from "./../aside.store";
import Awaiting from "./Awaiting.svelte";
import { uuid } from "$fn/helper";
import { decode } from "base64-arraybuffer";
import "./doc.scss";
import { onMount } from "svelte";

export let data;
let { supabase, guide, session } = data;
let content;
let showEditor, editor, loading;

const cache = new Map();

$: data, onChange();

function parseHTML(html) {
    html = html.replace(/(?<!<p><br><\/p>)<p><br><\/p>(?!<p><br><\/p>)/g, "");
    //(?:<p><br><\/p>){2,}
    return html;
}

async function onChange() {
    guide = data.guide;
    // console.log(guide.title);
    if (!cache.has(guide.id)) {
        // console.log('cache miss');
        loading = true;
        const resp = await fetch(`/modellingguide/${guide.slug}?url=${data.guideUrl}`);
        content = await resp.json();
        content = content;
        cache.set(content.id, content);
        loading = false;
    } else {
        content = cache.get(guide.id);
        // console.log('cache hit', content);
    }
}

async function removeGuide() {
    console.log(guide.id);
    if (confirm(`Confirm delete guide for '${guide.title}''`)) {
        const { data } = await supabase.storage.from("public").list(`modellingGuide/${guide.id}`);
        const toDelete = data.map((x) => `modellingGuide/${guide.id}/${x.name}`);
        await supabase.storage.from("public").remove(toDelete);

        await supabase.from("modellingGuide").delete().eq("id", guide.id);

        goto("/modellingguide");
    }
}

async function save(e) {
    loading = "saving";
    const editorData = e.detail;
    console.log(editorData.guide);

    //get base64 images and upload to storage
    const regex = /\<img src="(.*?)"/g;
    const matches = editorData.content.html.matchAll(regex) || [];
    const promises = [];
    for (const match of matches) {
        const dataURL = match[1];

        if (!dataURL.startsWith("data:image/")) {
            continue;
        }

        //uploadImage
        const uploadTask = new Promise(async (resolve) => {
            const [data, base64] = dataURL.split(",");
            const contentType = /data:(.*);/.exec(data)[1];
            const ext = contentType.split("/")[1];
            const imageId = uuid();
            const { data: path, error } = await supabase.storage
                .from("public")
                .upload(`modellingGuide/${guide.id}/${imageId}.${ext}`, decode(base64), {
                    contentType: contentType,
                });

            const { data: url } = supabase.storage.from("public").getPublicUrl(path.path);

            editorData.content.html = editorData.content.html.replace(dataURL, url.publicUrl);
            editorData.content.md = editorData.content.html.replace(dataURL, url.publicUrl);
            resolve(imageId);
        });

        promises.push(uploadTask);
    }

    await Promise.all(promises);

    //delete unused images

    //get all existing images
    const { data: list } = await supabase.storage.from("public").list(`modellingGuide/${guide.id}`);
    const nameList = list.map((x) => {
        return { name: x.name, path: `modellingGuide/${guide.id}/${x.name}`, mimeType: x.metadata.mimetype };
    });

    const types = ["img", "png", "jpg", "jpeg", "svg", "webp", "gif"];
    const extgImages = nameList.filter((x) => types.includes(x.mimeType.split("/").pop()));

    const toDelete = [];
    extgImages.forEach((img) => {
        const match = editorData.content.html.match(img.name);
        if (!match) {
            toDelete.push(img.path);
        }
    });
    if (toDelete.length) {
        await supabase.storage.from("public").remove(toDelete);
    }

    //update DB
    const { error: dbError } = await supabase.from("modellingGuide").upsert(editorData.guide);

    if (dbError) {
        return alert(dbError.message);
    }

    //upload JSON
    const { data, error } = await supabase.storage
        .from("public")
        .upload(`modellingGuide/${editorData.guide.id}/doc.json`, JSON.stringify(editorData.content, null, 2), {
            upsert: true,
        });

    //Update sidebar
    for (const [index, g] of $listOfGuides.entries()) {
        if (g.id == editorData.guide.id) {
            $listOfGuides[index] = editorData.guide;
            break;
        }
    }

    //if slug is different, reload page
    if (guide.slug !== editorData.guide.slug) {
        const u = location.href.replace(guide.slug, editorData.guide.slug);
        location.replace(u);
    }

    content = editorData.content;
    showEditor = false;

    console.log("SAVED");
    loading = false;
}
</script>

{#if loading}
    <Awaiting message={loading} />
{/if}

{#if session}
    <div class="buttonRows">
        {#if showEditor}
            <button
                on:click={() => {
                    editor.save();
                }}>Save</button>

            <button
                class="alt"
                on:click={() => {
                    showEditor = false;
                }}>Cancel</button>
            <button class="warning" style="margin-right:auto" on:click={removeGuide}>Delete</button>
        {:else}
            <button
                on:click={() => {
                    showEditor = true;
                    content = content;
                }}>Edit</button>
        {/if}
    </div>
{/if}

{#if showEditor}
    <Editor bind:this={editor} content={content || guide} on:save={save} />
{:else}
    <div class="doc {$theme}">
        <h1>{content ? content.title : guide.title}</h1>
        {#if content && content.html}
            {@html parseHTML(content.html)}
        {/if}
    </div>
{/if}

<style lang="scss">
.doc {
    h1 {
        margin: 0;
        padding-bottom: 1rem;
    }
}
</style>
