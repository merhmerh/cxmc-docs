<script>
import Icon from "@iconify/svelte";
import dayjs from "dayjs";
import { timeout } from "$fn/helper";
import { theme } from "$comp/theme.store";
import { Modal, Tooltip, notify } from "merh-forge-ui";

import { onMount } from "svelte";

let requests = [],
    loading,
    awaiting = false;
onMount(async () => {
    getRequest();
});

async function getRequest() {
    loading = true;
    const resp = await fetch("/admin/api/request-access-users");
    requests = await resp.json();
    await timeout(500);
    loading = false;
}

async function invite(req) {
    awaiting = true;

    try {
        const resp = await fetch("/admin/api/invite-user-by-email", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(req),
        });

        const user = await resp.json();

        await fetch("/admin/api/update-access-users", {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ type: "delete", email: user.email }),
        });

        requests = requests.filter((x) => x.email !== user.email);
    } catch (error) {
        notify.add(error.message);
    }

    await timeout(500);

    awaiting = false;
}

async function reject(req) {
    awaiting = true;

    await fetch("/admin/api/update-access-users", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "reject", email: req.email }),
    })
        .then((res) => res.json())
        .then((res) => {
            for (const [index, item] of requests.entries()) {
                if (item.email == res.email) {
                    requests[index] = res;
                    break;
                }
            }
        });

    await timeout(500);

    awaiting = false;
}

let modal;
</script>

<Modal modalPosition={"top"} exitOutsideClick={false} bind:this={modal}>
    <div class="modal">
        <h3>Requests</h3>
        {#if !loading}
            <div class="table_wrapper" class:awaiting>
                <table class="noHover {theme}">
                    <thead>
                        <tr>
                            <th><div>Email</div></th>
                            <th><div>Date Requested</div></th>
                            <th><div>Info</div></th>
                            <th><div>Status</div></th>
                            <th><div></div></th>
                        </tr>
                    </thead>

                    <tbody>
                        {#each requests as request}
                            <tr>
                                <td><div>{request.email}</div></td>
                                <td><div>{dayjs(request.created_at).format("DD MMM YYYY HH:mm")}</div></td>
                                <td
                                    ><div>
                                        {#if !request.info || request.info == "undefined"}
                                            –
                                        {:else}
                                            <Tooltip fixed width="200px" position="top" value={request.info}
                                                >{request.info}</Tooltip>
                                        {/if}
                                    </div></td>
                                <td><div>{request.status || "Pending"}</div></td>
                                <td
                                    ><div>
                                        <button
                                            class="icon invite"
                                            on:click={() => {
                                                invite(request);
                                            }}>
                                            Invite
                                        </button>
                                        <button
                                            class="icon warning"
                                            on:click={() => {
                                                reject(request);
                                            }}>
                                            Reject
                                        </button>
                                    </div></td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {:else}
            <!--  -->
            <div class="loading">
                <Icon icon="line-md:loading-twotone-loop" width="80" />
                <span>Loading...</span>
            </div>
        {/if}
    </div>
</Modal>
<button
    class="request"
    on:click={() => {
        getRequest();
        modal.open();
    }}>
    {#if requests.length}
        <div class="counter">{requests.length}</div>
    {/if}
    Requests
</button>

<style lang="scss">
.modal {
    width: 800px;
    display: flex;
    flex-direction: column;
    @media screen and (max-width: $mobile) {
        width: 100%;
    }
    .table_wrapper {
        &.awaiting {
            position: relative;
            pointer-events: none;

            &:before {
                pointer-events: none;
                position: absolute;
                content: "";
                height: 100%;
                width: 100%;
                --gradient-c-1: var(--bg-alt);
                --gradient-c-2: var(--bg-p);
                z-index: 1000;
                background-image: linear-gradient(
                    135deg,
                    var(--gradient-c-1) 25%,
                    var(--gradient-c-2) 25%,
                    var(--gradient-c-2) 50%,
                    var(--gradient-c-1) 50%,
                    var(--gradient-c-1) 75%,
                    var(--gradient-c-2) 75%,
                    var(--gradient-c-2) 100%
                );
                background-size: 12px 12px;
                opacity: 0.5;
            }
        }
    }
    table {
        width: 800px;
        // background-color: red;
        font-size: 0.875rem;
        th:last-child {
            border-left: 1px solid var(--mono-100);
        }
        td:first-child {
            width: 200px;
        }
        td:nth-child(2) {
            width: 160px;
            > div {
                color: var(--mono);
            }
        }
        td:nth-child(3) {
            width: 210px;
            > div {
                padding-block: 0.5rem;
                width: inherit;
                & :global(.container) {
                    display: flex;
                }
                & :global(.slot) {
                    white-space: nowrap;
                    display: block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 0.875rem;
                }
            }
        }
        td:nth-child(4) {
            width: 80px;
        }
        td:last-child {
            width: 150px;
            border-left: 1px solid var(--mono-100);
            > div {
                display: flex;
                justify-content: flex-end;
                flex-wrap: nowrap;
                gap: 0.5rem;
                button {
                    width: 60px;
                    font-size: 0.875rem;
                    padding: 0.25rem;
                    border-radius: 0.25rem;
                    &.invite {
                        background-color: var(--green);
                        color: var(--main-alt);
                        border: 1px solid transparent;
                    }
                }
            }
        }
    }
    .loading {
        display: flex;
        padding-block: 2rem;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        width: 800px;
        @media screen and (max-width: $mobile) {
            width: 100%;
        }
    }
}

button.request {
    position: relative;
    .counter {
        position: absolute;

        border: 2px solid var(--red);
        border-radius: 100%;
        background-color: var(--bg-p);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        width: 24px;
        height: 24px;
        right: -12px;
        top: -12px;
    }
}
</style>
