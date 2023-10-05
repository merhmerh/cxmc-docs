<script>
import { ifcData, version } from "./ifcsg.store";
export let data;
</script>

<h1>Search Ifc SG data</h1>
<p>Interact with the sidebar by either clicking on the items listed or search for IFC Entity or subtypes</p>
<p>
    To perform a more precise search, you can type your query in the format of &#123;entity&#125;:&#123;subtype&#125;.
</p>
<div class="divider" />
<p>Data freshness is every 4 hour</p>
<p>
    {#if $ifcData.latestVersionTime}
        Last updated: <code>{$ifcData.latestVersionTime}</code>
        {#if data.versions[0].value == $version}
            <span class="version">Latest</span>
        {:else}
            <span class="version backdate">Back Dated</span>
        {/if}
    {/if}
</p>

<div class="divider" />

<p>
    View IFC4 definition on
    <a
        target="_blank"
        href="https://standards.buildingsmart.org/IFC/RELEASE/IFC4/ADD2_TC1/HTML/schema/ifcmeasureresource/content.htm"
        >IfcMeasureResource</a
    >.
</p>

<style lang="scss">
.divider {
    position: relative;
    text-align: center;
    padding-block: 1rem;
}

.divider::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    border-top: 1px solid #ccc;
}
span.version {
    padding: 0.25rem 0.75rem;
    border-radius: 100px;
    font-size: 0.875rem;
    margin-left: 0.5rem;
    --v-color: var(--green);
    border: 1px solid var(--v-color);
    border: 1px solid var(--v-color);
    background-color: color-mix(in srgb, var(--v-color) 25%, transparent);
    &.backdate {
        --v-color: var(--red);
    }
}
</style>
