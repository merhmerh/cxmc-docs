<script>
import Header from "$comp/Header.svelte";
import FakeProgress from "$comp/FakeProgress.svelte";
import Footer from "$comp/Footer.svelte";
import { Notify, notify } from "merh-forge-ui";
import { onMount } from "svelte";

// onMount(() => {
//     if (/Mobi|Android/i.test(navigator.userAgent)) {
//         // This code will run if the user is on a mobile device
//         notify.add("This page is not optimized for mobile");
//     }
// });
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
