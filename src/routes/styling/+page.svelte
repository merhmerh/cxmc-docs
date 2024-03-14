<script>
import Theme from "$comp/Theme.svelte";
</script>

<Theme />
<div class="container">
    <span>hello</span>

    <input type="text" value="johndoe@gmail.com" />

    <button class="">Submit</button>
    <button class="hover">Submit</button>
    <button class="focus-visible">Submit</button>

    <button class="alt">Submit</button>
    <button class="alt hover">Submit</button>
    <button class="alt focus-visible">Submit</button>

    <button class="none link">hello</button>
</div>

<style lang="scss">
.container {
    display: grid;
    gap: 2rem;
    width: 600px;
    margin-inline: auto;
    margin-block: 100px;
    outline: 1px solid red;
    padding: 100px;
}
button {
    &:not(.link) {
        padding-block: 0.75rem;
    }
    &.hover {
        background-color: color-mix(in srgb, var(--accent) 12%, #fff);
    }
    &.focus-visible {
        outline: 4px solid var(--accent-200);
    }
    &.alt {
        &.hover {
            box-shadow: none;
            background-color: color-mix(in srgb, var(--accent), #000 12%);
        }
        &.focus-visible {
            outline: 4px solid var(--accent-200);
        }
    }
}
</style>
