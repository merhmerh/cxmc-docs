<script>
import { Modal } from "merh-forge-ui";
import { onMount } from "svelte";
let modal;

onMount(() => {
    modal.show();
});
</script>

<Modal bind:this={modal}>hello</Modal>
