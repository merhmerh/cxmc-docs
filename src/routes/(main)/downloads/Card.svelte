<script>
import Icon from "@iconify/svelte";
import { getPermission } from "$comp/supabase.store.js";
import { toMemoryUnit, timeout, isObjectEmpty, convertToHTMLAnchor } from "$fn/helper";
import { Popover, Tooltip } from "merh-forge-ui";
import dayjs from "dayjs";
import { page } from "$app/stores";
let isOpen = false;

export let data = {};
const supabase = $page.data.supabase;
const { role, permission } = getPermission();
const canUpload = permission.edit;

async function remove(item) {
    console.log(item.id);
    // @ts-ignore
    const { data: res, error } = await supabase.from("downloads").update({ active: false }).eq("id", item.id).select();
    if (error) {
        return console.log(error);
    }
    data.downloads = data.downloads.filter((x) => x.id !== item.id);
}

async function forceDownloadFile(file) {
    await timeout(500);
    try {
        // Fetch the file as a blob
        const response = await fetch(file.url);
        const blob = await response.blob();

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = file.title;

        link.click();

        window.URL.revokeObjectURL(link.href);
        link.remove();
    } catch (error) {
        console.error("Error:", error);
    }
}
</script>

{#if !isObjectEmpty(data)}
    <div class="card accordion">
        <button
            class="none noHover header"
            on:click={() => {
                isOpen = !isOpen;
            }}>
            <h3>{data.category}</h3>

            <div class="expand">
                <div class="icon">
                    <Icon icon="ic:round-expand-more" height="32" vFlip={isOpen} />
                </div>
            </div>
        </button>

        {#if isOpen}
            <div class="body">
                {#each data.downloads as row}
                    <div class="row">
                        <div class="content">
                            <span class="flex items-center">
                                {row.description}
                            </span>
                            <div class="flex items-center">
                                <button
                                    class="info none icon noHover"
                                    on:click={() => {
                                        row.showInfo = !row.showInfo;
                                    }}>
                                    <Icon icon="charm:info" height="18" />
                                </button>
                                {#if canUpload}
                                    <Popover>
                                        <span slot="button" class="popoverButton">
                                            <button class="none">⋅⋅⋅</button>
                                        </span>

                                        <span slot="popup" class="popoverPopup">
                                            <button class="none" on:click={() => remove(row)}>Remove</button>
                                        </span>
                                    </Popover>
                                {/if}
                            </div>
                        </div>

                        <a
                            href={row.download.url}
                            target="_blank"
                            on:click={async (e) => {
                                e.preventDefault();
                                row.downloading = !row.downloading;
                                await forceDownloadFile(row.download);
                                row.downloading = false;
                            }}
                            class="button none download">
                            <div class="icon" class:downloading={row.downloading}>
                                {#if row.downloading}
                                    <Icon icon="line-md:loading-twotone-loop" height="32" />
                                {:else if row.download.type.match(/pdf/)}
                                    <Icon icon="vscode-icons:file-type-pdf2" height="48" />
                                {:else if row.download.type.match(/xls|spreadsheet|csv/)}
                                    <Icon icon="vscode-icons:file-type-excel" height="48" />
                                {:else if row.download.type.match(/text/)}
                                    <Icon icon="vscode-icons:file-type-text" height="48" />
                                {:else if row.download.type.match(/zip/)}
                                    <Icon icon="vscode-icons:default-folder" height="48" />
                                {:else}
                                    <Icon icon="vscode-icons:default-file" height="48" />
                                {/if}
                            </div>

                            <div class="metadata">
                                <div class="title">{`${row.title}.${row.download.fileName.split(/\./)[1]}`}</div>
                                <div class="size">
                                    <Icon icon="ph:download" height="20" />
                                    <span>{toMemoryUnit(row.download.size)}</span>
                                </div>
                            </div>
                        </a>

                        {#if row.showInfo}
                            <div class="flex flex-col details">
                                <span
                                    >{"Uploaded: " +
                                        dayjs(new Date(row.created_at)).format("DD MMM YYYY - HH:MM")}</span>
                                <span>{`Type: ` + row.download.type}</span>
                                <span>{"Checksum (SHA256): " + row.checksum}</span>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
{/if}

<style lang="scss">
.card.accordion {
    padding: 1rem 2rem;
    background-color: var(--bg-p);
    gap: 1rem;
    @media screen and (max-width: $mobile) {
        padding: 0.25rem 1rem;
    }

    button.header {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s;

        h3 {
            padding: 0;
            margin: 0;
        }
        .expand > .icon {
            border-radius: 0.25rem;
            padding: 0.25rem;
        }
        &:hover {
            color: $url;
        }
    }

    .body {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .row {
            padding: 1rem;
            background-color: var(--bg-s);
            border: 1px solid var(--mono-100);
            border-radius: 0.5rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            @media screen and (max-width: $mobile) {
                &:last-child {
                    margin-bottom: 1rem;
                }
            }
            .content {
                padding-inline: 0rem;
                display: flex;
                width: 100%;
                align-items: center;
                justify-content: space-between;
            }
            button.info {
                color: var(--mono-400);
            }

            .download {
                display: flex;
                align-items: center;
                gap: 1rem;
                border-radius: 0.5rem;
                padding-inline: 1rem;
                padding-block: 0.5rem;
                background-color: $bg-p;
                box-shadow: 0 2px 5px rgba(#000, 12%);
                outline: 1px solid transparent;
                transition: all 0.3s;
                .icon {
                    padding: 0rem;
                    padding-block: 0.25rem;
                    &.downloading {
                        padding-block: 12px;
                        padding-inline: 8px;
                    }
                }
                &:hover {
                    box-shadow: none;
                    outline: 1px solid var(--url);
                    background-color: color-mix(in srgb, var(--accent) 6%, var(--bg-p));
                }
                .metadata {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    .title {
                        font-weight: 600;
                    }
                    .size {
                        display: flex;
                        align-items: center;
                        gap: 0.25rem;
                        span {
                            color: var(--mono);
                            font-size: 14px;
                        }
                    }
                }
            }
            .details {
                font-size: 0.875rem;
                color: var(--mono-500);
                font-family: var(--font-mono);
                @media screen and (max-width: $mobile) {
                    width: 100%;
                    overflow: auto;
                    span {
                        white-space: nowrap;
                    }
                }
            }
        }
    }
}

.popoverButton {
    border: 0;
    // padding: 0.125rem 0.5rem;
    height: fit-content;
    // height: 20px;
    align-items: center;
    display: flex;
    button {
        border-radius: 0.25rem;
        width: 24px;
        height: 24px;
    }
}
.popoverPopup {
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
        padding-inline: 1rem;
        border-radius: 0;
    }
}
</style>
