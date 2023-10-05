<script>
import Header from "$comp/Header.svelte";
import FakeProgress from "$comp/FakeProgress.svelte";
import Footer from "$comp/Footer.svelte";
import { Notify } from "merh-forge-ui";
</script>

<Notify />
<FakeProgress />
<Header />
<main>
    <slot />
</main>

<Footer />

<style lang="scss">
main {
    display: grid;
    grid-template-columns: 300px 1fr;
    min-height: calc(100svh - 70px);
    @media screen and (max-width: $mobile) {
        display: flex;
        flex-direction: column;
    }
}
</style>
