<script>
import { mg_comp } from "../mg.store";
import { page } from "$app/stores";

let mg_data;
$: $page.params, init();

function init() {
    const IdentifiedComponent = $page.params.IdentifiedComponent;
    mg_data = $mg_comp.find((obj) => obj.IdentifiedComponent.replace(/\s/g, "-").toLowerCase() === IdentifiedComponent);
    console.log(mg_data);
}
</script>

{#if mg_data}
    {mg_data.IdentifiedComponent}

    <pre> {JSON.stringify(mg_data, null, 2)}</pre>
{/if}
