<script>
import ModellingGuide from "./ModellingGuide.svelte";
export let identifiedComponent;
let isEditing = false;
let editor;
</script>

<ModellingGuide
    bind:this={editor}
    IdentifiedComponent={mg_data.IdentifiedComponent}
    on:save={() => {
        isEditing = false;
    }} />
