<script>
import Icon from "@iconify/svelte";
export let data;
import { theme } from "$comp/theme.store";
import { Modal, Select, Popover, notify, Tooltip } from "merh-forge-ui";
import roleOperations from "./role.json";
import { capitalizeFirstCharacter, timeout, isValidEmail } from "$fn/helper";
import dayjs from "dayjs";
import { onMount } from "svelte";
import { fly } from "svelte/transition";
import Request from "./Request.svelte";
const roles = [...new Set(Object.entries(roleOperations).flatMap(([key, x]) => x.roles))];

const roleSelectList = roles.map((x) => ({
    value: x,
    label: capitalizeFirstCharacter(x),
}));

const currentUser = data.session.user;
let originalUsers = data.users;
let users = originalUsers,
    modalContent,
    ready,
    searchEmailValue,
    inviteUserModal,
    inviteUserEmail,
    confirmDeleteModal,
    updatePasswordModal,
    selectedUser,
    revealPassword,
    modalError = {};

async function updateRole() {
    const currentRole = modalContent.user.user_metadata["role"] || "reader";
    if (modalContent.newRole == currentRole) {
        modalContent = false;
        return;
    }

    const data = structuredClone(modalContent);
    modalContent = false;
    const index = users.findIndex((x) => x.id == data.user.id);
    users[index].user_metadata.role = "Updating";

    const resp = await fetch("/admin/api/update-role", {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await resp.json();

    if (result.error) {
        notify.add(result.error.message);
        users[index] = data.user;
        return;
    }
    await timeout(500);
    users[index] = result;
}

function filterByEmail() {
    if (!searchEmailValue) {
        return (users = originalUsers);
    }
    const variablePattern = `${searchEmailValue}`;
    const regex = new RegExp(variablePattern);
    users = originalUsers.filter((x) => regex.test(x.email));
}

async function inviteUser() {
    if (!isValidEmail(inviteUserEmail)) {
        modalError.email = {
            message: `${inviteUserEmail} is an invalid email address`,
        };
        return;
    }

    inviteUserModal.close();
    const data = { email: inviteUserEmail, referral: currentUser.email };

    const resp = await fetch("/admin/api/invite-user-by-email", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await resp.json();
    originalUsers.unshift(result);
    users = originalUsers;
}

async function deleteUser() {
    confirmDeleteModal.close();

    const resp = await fetch("/admin/api/delete-user", {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(selectedUser),
    });

    await timeout(500);
    const result = await resp.json();
    users = users.filter((x) => x.id !== result.id);
    originalUsers = users;
    notify.add(`Successfully deleted ${result.email}`);
    selectedUser = false;
}

async function disableUser(user) {
    const isDisabled = user.user_metadata.disabled || false;
    const toDisable = !isDisabled;

    const resp = await fetch("/admin/api/disable-user", {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ user: user, disabled: toDisable }),
    });

    const result = await resp.json();

    if (result.error) {
        console.log(result.error.message);
        notify.add(result.error.message);
        return;
    }

    const index = users.findIndex((x) => x.id == user.id);
    originalUsers[index] = result;
    users = originalUsers;
}

async function updatePassword(user) {
    const resp = await fetch("/admin/api/update-password", {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(selectedUser),
    });

    const result = await resp.json();
    updatePasswordModal.close();
    console.log(result);
    notify.add("Updated password");
}

onMount(async () => {
    // confirmDeleteModal.open();
    await timeout(250);
    ready = true;
    console.log(users);
});

async function verifyEmail() {
    const user = modalContent.user;
    modalContent = false;
    const resp = await fetch("/admin/api/verify-email", {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(user),
    });
    const result = await resp.json();
    console.log(result);
    result.confirmed_at = result.email_confirmed_at;
    const index = users.findIndex((x) => x.id == user.id);
    originalUsers[index] = result;
    users = originalUsers;
}
</script>

<Modal bind:this={updatePasswordModal}>
    <div class="modal modal__updatePassword">
        <h1>Set Password</h1>

        <span class="info"
            >Please avoid manually setting a user password. This platform utilizes password-less authentication methods,
            such as magic links or OTP.</span>

        <span class="info">
            Utilize this function solely in situations where a user is unable to access their email.</span>

        <div class="inputBox">
            <input
                type={revealPassword ? "text" : "password"}
                placeholder="Enter Password"
                on:input={(e) => {
                    selectedUser.newPassword = e.target.value;
                }} />
            <button
                class="none icon"
                on:click={() => {
                    revealPassword = !revealPassword;
                }}>
                {#if revealPassword}
                    <Icon icon="mdi:hide" />
                {:else}
                    <Icon icon="mdi:show" />
                {/if}
            </button>
        </div>
        <div class="buttonGroup">
            <button
                class="icon alt"
                on:click={() => {
                    updatePassword(selectedUser);
                }}>
                Confirm
            </button>
            <button
                on:click={() => {
                    updatePasswordModal.close();
                }}>Cancel</button>
        </div>
    </div>
</Modal>

<Modal bind:this={confirmDeleteModal}>
    <div class="modal modal__deleteUser">
        <h1>Confirm to delete user</h1>

        <span>This is permanent! Are you sure you want to delete user "{selectedUser.email}" ?</span>
        <div class="buttonGroup">
            <button
                class="icon alt"
                on:click={() => {
                    deleteUser();
                }}>
                Confirm
            </button>
            <button
                on:click={() => {
                    confirmDeleteModal.close();
                }}>Cancel</button>
        </div>
    </div>
</Modal>

<Modal bind:this={inviteUserModal}>
    <div class="modal modal__createUser">
        <h1>Invite a new user</h1>

        <div class="field">
            <label for="create_email">User Email</label>
            <div class="inputBox">
                <div class="icon">
                    <Icon icon="carbon:email" width="24" />
                </div>
                <input
                    type="email"
                    id="create_email"
                    placeholder="Email"
                    bind:value={inviteUserEmail}
                    on:keydown={(e) => {
                        if (modalError.email) {
                            delete modalError.email;
                        }
                        if (e.key == "Enter") {
                            inviteUser();
                        }
                    }} />
            </div>
        </div>
        {#if modalError.email}
            <div class="error">
                <div class="icon">
                    <Icon icon="material-symbols:info-outline" height="20" />
                </div>
                <span> {modalError.email.message}</span>
            </div>
        {/if}
        <span class="info">
            Please ensure the email provided is a valid email address, an invitation will be send to the user email
            address.</span>
        <button class="alt" on:click={inviteUser}>Invite User</button>
    </div>
</Modal>

{#if modalContent}
    <Modal
        showModal={true}
        on:close={() => {
            modalContent = null;
        }}>
        {#if modalContent.type == "role"}
            <div class="modal modal__editRole">
                <h1>Edit Role</h1>

                <div><span>Email:</span> {modalContent.user.email}</div>
                <div><span>ID:</span> {modalContent.user.id}</div>

                <Select
                    items={roleSelectList}
                    rows={4}
                    defaultValue={modalContent.newRole}
                    on:change={(e) => {
                        console.log(e.detail);
                        modalContent.newRole = e.detail.value;
                    }} />

                <div class="table_wrapper">
                    <table class="role noHover noActionColumn {$theme}">
                        <thead>
                            <tr>
                                <th><div>Operation</div></th>
                                {#each roles as role}
                                    <th><div>{role}</div></th>
                                {/each}
                            </tr>
                        </thead>
                        <tbody>
                            {#each roleOperations as item}
                                <tr>
                                    <td><div>{item.operation}</div></td>
                                    {#each roles as role}
                                        <td><div>{item.roles.includes(role.toLowerCase()) ? "✔" : ""}</div></td>
                                    {/each}
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>

                <div class="buttonGroup">
                    <button
                        class="icon alt"
                        on:click={() => {
                            updateRole(modalContent);
                        }}>
                        Save
                    </button>
                    <button
                        on:click={() => {
                            modalContent = false;
                        }}>Cancel</button>
                </div>
            </div>
        {/if}

        {#if modalContent.type == "verifyEmail"}
            <div class="modal">
                <h1>Verify Email</h1>

                <span class="info"> Confirms the user's email address is authentic and belongs to the user. </span>
                <span class="info"> Only utilize this function if user cannot verify their email. </span>

                <div class="buttonGroup">
                    <button
                        class="icon alt"
                        on:click={() => {
                            verifyEmail(modalContent);
                        }}>
                        Verify
                    </button>
                    <button
                        on:click={() => {
                            modalContent = false;
                        }}>Cancel</button>
                </div>
            </div>
        {/if}
    </Modal>
{/if}

<h1>User Management</h1>
<div class="row">
    <div class="inputBox">
        <div class="icon">
            <Icon icon="akar-icons:search" hFlip={true} height="16" />
        </div>
        <input
            type="text"
            placeholder="Search by email"
            bind:value={searchEmailValue}
            on:input={filterByEmail}
            on:keydown={(e) => {
                if (e.key == "Enter") {
                    filterByEmail();
                }
            }} />
        {#if searchEmailValue}
            <button
                class="close icon none"
                on:click={() => {
                    searchEmailValue = null;
                    users = originalUsers;
                }}>
                <Icon icon="material-symbols:close" />
            </button>
        {/if}
    </div>
    <div class="buttons">
        <Request></Request>
        <button
            class="alt"
            on:click={() => {
                inviteUserModal.open();
            }}>Invite User</button>
    </div>
</div>
{#if ready}
    <div class="table_wrapper" transition:fly>
        <table class="users noHover noInnerBorder {$theme}">
            <thead>
                <tr>
                    <th><div>Email</div></th>
                    <th><div>Referral</div></th>
                    <th><div>Status</div></th>
                    <th><div>Role</div></th>
                    <th><div>Created</div></th>
                    <th><div>Verified</div></th>
                    <th><div>User ID</div></th>

                    <th></th>
                </tr>
            </thead>
            <tbody>
                {#if users.length}
                    {#each users as user (user.id)}
                        <tr>
                            <!-- Email -->
                            <td>
                                <div>
                                    <Tooltip
                                        position="center"
                                        value="Copy"
                                        clickedValue="Copied"
                                        on:click={() => {
                                            navigator.clipboard.writeText(user.email);
                                        }}>
                                        <span>{user.email}</span>
                                    </Tooltip>
                                </div>
                            </td>

                            <!-- Referral -->
                            <td>
                                <div>
                                    {user.user_metadata.referral || "–"}
                                </div>
                            </td>

                            <!-- status -->
                            <td>
                                <div>
                                    {#if user.user_metadata.disabled}
                                        <div class="banner red">Disabled</div>
                                    {:else}
                                        –
                                    {/if}
                                </div></td>

                            <!-- role -->
                            <td>
                                <div>
                                    {#if currentUser.user_metadata.role}
                                        <button
                                            class="none"
                                            on:click={() => {
                                                modalContent = {
                                                    type: "role",
                                                    user: user,
                                                    newRole: user.user_metadata.role || "reader",
                                                };
                                            }}>
                                            {#if user.user_metadata["role"] == "Updating"}
                                                <Icon icon="line-md:loading-twotone-loop" width="20" />
                                            {:else}
                                                {user.user_metadata["role"]
                                                    ? capitalizeFirstCharacter(user.user_metadata["role"])
                                                    : "Reader"}
                                            {/if}
                                        </button>
                                    {:else}
                                        <span>
                                            {user.user_metadata["role"]
                                                ? capitalizeFirstCharacter(user.user_metadata["role"])
                                                : "Reader"}
                                        </span>
                                    {/if}
                                </div>
                            </td>

                            <!-- Created -->
                            <td><div>{dayjs(new Date(user.created_at)).format("DD MMM YYYY HH:MM")}</div></td>

                            <td
                                ><div>
                                    {#if user.confirmed_at}
                                        {dayjs(new Date(user.confirmed_at)).format("DD MMM YYYY HH:MM")}
                                    {:else}
                                        <div class="banner orange">Pending Verification..</div>
                                    {/if}
                                </div>
                            </td>

                            <!-- UID -->
                            <td>
                                <div>
                                    <Tooltip
                                        value="Copy"
                                        clickedValue="Copied"
                                        on:click={() => {
                                            navigator.clipboard.writeText(user.id);
                                        }}>
                                        <span>{user.id}</span>
                                    </Tooltip>
                                </div>
                            </td>

                            <!-- blank -->
                            <td>
                                <Popover>
                                    <span slot="button">
                                        <button class="table__data__more"> ⋅⋅⋅ </button>
                                    </span>

                                    <span slot="popup">
                                        <div class="table__data__more__menu">
                                            {#if !user.confirmed_at}
                                                <button
                                                    class="none"
                                                    on:click={() => {
                                                        modalContent = { type: "verifyEmail", user: user };
                                                    }}>
                                                    Verify Email
                                                </button>
                                            {/if}

                                            <!-- Set password -->
                                            <button
                                                class=" none"
                                                on:click={() => {
                                                    if (!user.confirmed_at) {
                                                        notify.add("Email is not yet verified");
                                                        return;
                                                    }
                                                    updatePasswordModal.open();
                                                    revealPassword = false;
                                                    selectedUser = user;
                                                }}>
                                                Set password
                                            </button>

                                            <!-- Disable / Enable -->
                                            <button
                                                class=" none"
                                                on:click={() => {
                                                    disableUser(user);
                                                }}
                                                >{user.user_metadata.disabled ? "Enable Account" : "Disable Account"}
                                            </button>

                                            <!-- Delete User -->
                                            <button
                                                class=" none"
                                                on:click={() => {
                                                    selectedUser = user;
                                                    confirmDeleteModal.open();
                                                }}>Delete User</button>
                                        </div>
                                    </span>
                                </Popover>
                            </td>
                        </tr>
                    {/each}
                {:else}
                    <tr>
                        <td colspan="8" class="table__data_noResult">
                            <div>
                                <div class="icon">
                                    <Icon icon="tabler:alert-circle" height="20" />
                                </div>
                                {#if !originalUsers.length}
                                    <span>You have not invite any users</span>
                                {:else}
                                    <span>No users matched the search query "{searchEmailValue}"</span>
                                {/if}
                            </div>
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
{/if}

<style lang="scss">
h1 {
    margin: 0;
    @media screen and (max-width: $mobile) {
        // font-size: 1.75rem;
    }
}
.table_wrapper {
    @media screen and (max-width: $mobile) {
        width: calc(100vw - 60px - 4rem);
    }
}
table {
    &.users {
        th {
            text-align: left;
        }
        td {
            > div {
                padding-block: 0.5rem;
                width: inherit;
                white-space: nowrap;
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 0.875rem;
            }
            &:first-child {
                width: 200px;
            }
            &:nth-child(2) {
                width: 200px;
            }
            &:nth-child(3) {
                width: 100px;
            }
            &:nth-child(4) {
                width: 150px;
            }
            &:nth-child(5),
            &:nth-child(6) {
                width: 180px;
                > div {
                    font-size: 0.875rem;
                    color: var(--mono-400);
                    .pending {
                        width: fit-content;
                        padding: 0.25rem 0.5rem;
                        border-radius: 0.5rem;
                        border: 1px solid orange;
                        color: var(--orange-text);
                        background-color: color-mix(in srgb, var(--orange) 12%, transparent);
                    }
                }
            }

            &:nth-child(7) {
                width: 100px;
                div {
                    width: inherit;
                    text-overflow: clip;

                    span {
                        // cursor: text;
                        @include font-mono;
                        color: var(--mono-400);
                        width: 90px;
                        padding-right: 2px;
                        white-space: nowrap;
                        display: block;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        font-size: 0.875rem;
                    }
                }
            }
            &:last-child {
                width: 36px;
            }
        }

        .table__data__more {
            border: 0;
            padding: 0.125rem 0.5rem;
            height: fit-content;
            // height: 20px;
            align-items: center;
            display: flex;
        }
        .table__data__more__menu {
            display: flex;
            flex-direction: column;
            gap: 0;
            border: 1px solid var(--mono-200);
            background-color: var(--bg-alt);
            border-radius: 0.25rem;
            padding: 0;
            padding-block: 0.25rem;
            button {
                width: 100%;
                justify-content: flex-start;
                padding: 0.25rem;
                font-size: 0.875rem;
                padding: 0.5rem 1rem;
                border-radius: 0;
            }
        }
        .table__data_noResult {
            border-left: 1px solid var(--mono-200);
            border-radius: 0 0 0.25rem 0.25rem;
            > div {
                padding-block: 1rem;
                width: 100%;
                display: flex;
                color: var(--mono-400);
                align-items: center;
                font-size: 0.875rem;
                gap: 0.5rem;
                .icon {
                    width: fit-content;
                    display: flex;
                }
            }
        }
    }

    .banner {
        width: fit-content;
        padding: 0.25rem 0.5rem;
        border-radius: 0.5rem;
        &.orange {
            border: 1px solid orange;
            color: var(--orange-text);
            background-color: color-mix(in srgb, var(--orange) 12%, transparent);
        }
        &.red {
            border: 1px solid var(--red);
            color: var(--red);
            background-color: color-mix(in srgb, var(--red) 12%, transparent);
        }
    }

    &.role {
        th,
        td {
            font-size: 0.875rem;
        }
        th:not(:first-child) {
            text-align: center;
        }
        td {
            div {
                padding-block: 0.25rem;
            }
        }
        td:not(:first-child) {
            div {
                justify-content: center;
            }
        }
    }
}

.modal {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 400px;
    h1 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 24px;
        position: relative;
        width: fit-content;
        &:after {
            position: absolute;
            bottom: -0.5rem;
            left: 0;
            content: "";
            width: 100%;
            height: 4px;
            background-color: var(--accent-500);
        }
    }
    .info {
        color: var(--mono-500);
        font-size: 0.875rem;
    }
    div.error {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: var(--red);
        font-size: 0.875rem;
    }
    &.modal__editRole {
        min-width: 600px;
        min-height: 400px;
    }
    &.modal__createUser {
        .field {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .inputBox {
            gap: 1rem;
        }
        button {
            margin-top: 1rem;
            height: 40px;
        }
    }
    &.modal__updatePassword {
        .inputBox {
            input {
                width: 100%;
            }
            .icon {
                margin-left: auto;
            }
        }
    }
    &.modal__deleteUser {
        span {
            color: var(--mono-800);
        }
    }
    .buttonGroup {
        padding-top: 1rem;
        margin-top: auto;
        display: flex;
        flex-direction: row-reverse;
        margin-right: auto;
        gap: 0.5rem;
        button {
            width: 100px;
        }
    }
}

.row {
    padding-block: 1rem 0.5rem;
    display: flex;
    justify-content: space-between;
    @media screen and (max-width: $mobile) {
        flex-direction: column-reverse;
        gap: 1rem;
    }
    .icon {
        @include flex-center;
    }
    .inputBox {
        gap: 0.5rem;
        width: 300px;
        @media screen and (max-width: $mobile) {
            width: 100%;
            padding-block: 0.25rem;
        }
        .icon {
            color: var(--mono-400);
        }
        input {
            padding-block: 0.25rem;
            width: 100%;
            font-size: 0.875rem;
        }

        .close {
            margin-left: auto;
        }
    }
    .buttons {
        display: flex;
        gap: 1rem;
        @media screen and (max-width: $mobile) {
            justify-content: flex-end;
        }
        button {
            font-size: 0.875rem;
            padding-block: 0.5rem;
        }
    }
}
</style>
