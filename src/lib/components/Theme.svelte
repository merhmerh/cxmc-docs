<script>
import Icon from "@iconify/svelte";
import { theme } from "$comp/theme.store.js";
import { onMount } from "svelte";

let rotate = 0;

onMount(() => {
    const systemIsDark = window.matchMedia("(prefers-color-scheme: dark").matches;

    $theme = localStorage.getItem("theme");
    if ($theme == null) {
        const systemTheme = systemIsDark ? "dark" : "light";
        localStorage.setItem("theme", systemTheme);
        $theme = systemTheme;
    }

    if ($theme == "light") {
        document.body.classList.add("light");
        document.body.classList.remove("dark");
    } else {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
    }
});

export function changeTheme() {
    console.log("🌓 changing theme");
    if ($theme == "dark") {
        $theme = "light";

        document.body.classList.add("light");
        document.body.classList.remove("dark");
    } else {
        $theme = "dark";
        document.body.classList.remove("light");
        document.body.classList.add("dark");
    }

    rotate += 360;
    localStorage.setItem("theme", $theme);
}
</script>

<button id="theme_button" style="transform:rotateZ({rotate}deg)" data-theme={$theme} on:click={() => changeTheme()}>
    {#if $theme == "light"}
        <Icon icon="fluent:weather-sunny-16-regular" width="24" />
    {:else}
        <Icon icon="solar:moon-bold-duotone" width="24" />
    {/if}
</button>

<style lang="scss">
#theme_button {
    @include plain;
    height: 36px;
    width: 36px;
    aspect-ratio: 1;
    border-radius: 100px;
    transition: transform 0.5s;
    transform: rotateZ(0deg);
    color: $main;
    box-shadow: none;
    color: $accent-light;

    &:hover {
        background-color: transparent;
    }
    &:focus {
        background-color: transparent;
    }
    &:active {
        background-color: transparent;
    }
}
</style>
