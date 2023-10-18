<script>
import Aside from "./Aside.svelte";
import Footer from "$comp/Footer.svelte";
import { Notify } from "merh-forge-ui";
</script>

<div class="admin__content">
    <Aside></Aside>
    <Notify></Notify>
    <main class="admin__main">
        <slot />
    </main>
</div>
<Footer></Footer>

<style lang="scss">
.admin__content {
    min-height: 100svh;
    display: grid;
    grid-template-columns: auto 1fr;
}

.admin__main {
    padding-top: 2rem;
    margin-inline: auto;
    width: 100%;
    height: 100svh;
    max-width: 1400px;
    padding-inline: 2rem;
    display: flex;
    flex-direction: column;
    padding-bottom: 2rem;
}
</style>
