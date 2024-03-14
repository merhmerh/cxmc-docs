<script>
import Icon from "@iconify/svelte";
import { page } from "$app/stores";

const role = $page.data.session.user.user_metadata.role || null;
const managerRoles = ["manager", "admin", "owner"];
</script>

<footer>
    <div class="link">
        {#if managerRoles.includes(role)}
            <a href="/admin/users">
                <div class="icon">
                    <Icon icon="dashicons:admin-network" height="20" />
                </div>
                <div>Admin</div>
            </a>
        {/if}

        <a class="github" target="_blank" href="https://github.com/merhmerh/cxmc-docs">
            <div class="icon">
                <Icon icon="mdi:github" height="20" />
            </div>
        </a>
    </div>
</footer>

<style lang="scss">
footer {
    border-top: 1px solid var(--grey-lightest);
    padding-block: 1rem;
    background-color: $bg-p;
    color: #dedede;
    display: flex;
    justify-content: flex-end;
    padding-inline: 1rem;
    .link {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        width: 100%;
        a {
            gap: 0.125rem;
            display: flex;
            align-items: center;
            text-decoration: none;
            color: #617786;
            font-size: 0.875rem;
            &:hover {
                color: orange;
            }
            &.github {
                margin-left: auto;
            }
        }
    }
}
</style>
