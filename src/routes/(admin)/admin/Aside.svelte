<script>
import Theme from "$comp/Theme.svelte";
import Icon from "@iconify/svelte";
import { page } from "$app/stores";
let theme;
</script>

<aside>
    <a class="button" href="/admin" class:active={$page.url.pathname == "/admin"}>
        <img src="/logo.svg" alt="" />
    </a>
    <a class="button" href="/admin/users" class:active={$page.url.pathname.replace("/admin/", "") == "users"}>
        <Icon icon="grommet-icons:group" height="24" />
    </a>
    <button
        class="last"
        style="margin-top:auto"
        on:click|self={() => {
            theme.changeTheme();
        }}>
        <Theme bind:this={theme}></Theme>
    </button>
    <a class="button last" href="/">
        <Icon icon="ic:outline-home" height="24" />
    </a>
</aside>

<style lang="scss">
aside {
    padding-inline: 0.5rem;
    border-right: 1px solid var(--mono-200);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-block: 1rem;
    a.button,
    button {
        img {
            width: 24px;
            height: 24px;
        }
        border: 0;
        width: 40px;
        height: 40px;
        padding: 0.5rem;
        &.active {
            background-color: color-mix(in srgb, var(--accent) 25%, transparent);
        }
    }
}
</style>
