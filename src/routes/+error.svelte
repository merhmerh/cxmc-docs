<script>
import { page } from "$app/stores";
import Header from "$comp/Header.svelte";
import Footer from "$comp/Footer.svelte";

let status;

function animate() {
    status = 100;
    const interval = setInterval(() => {
        status = generateNumber(3);
    }, 25);

    setTimeout(() => {
        clearInterval(interval);
        status = $page.status;
    }, 500);
}

function generateNumber(length) {
    function randomNumber() {
        return Math.floor(Math.random() * 10);
    }
    let v = "";
    for (let i = 0; i < length; i++) {
        v += randomNumber();
    }
    return v;
}
</script>

<Header />
<div class="content">
    <button class="none noHover status" use:animate on:click={animate}>
        {status}
    </button>
    <div class="message">
        {#if $page.error.message == "Not Found"}
            <span>Oops! The page you're looking for could not be found.</span>
            <span> Please check the URL or navigate back to the homepage.</span>
        {:else}
            {$page.error.message}
        {/if}
    </div>
</div>
<Footer />

<style lang="scss">
.content {
    height: calc(100svh - 70px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    .status {
        margin-top: 200px;
        font-size: 80px;
        font-weight: 900;
    }
    .message {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        font-size: 20px;
    }
}
</style>
