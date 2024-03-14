<script>
import { isMobile } from "$comp/device.store";
import { goto } from "$app/navigation";
import { replaceSpaceWithDash, debounce, escapeRegex, timeout } from "$fn/helper";
import { createEventDispatcher } from "svelte";
import { page } from "$app/stores";
import { Modal, Select } from "merh-forge-ui";

const dispatch = createEventDispatcher();
export let data;
let input, searchString, list, modal, select, newRG_ID, newRG_Name;

data = [
    { rg: "gfa:27", agency: "URA", name: "VOID" },
    { rg: "ssw:1.2.1", agency: "PUB", name: "Manhole" },
];
list = data;

function filter() {
    if (!searchString) {
        list = data;
        return;
    }
    const regex = new RegExp(escapeRegex(searchString), "i");

    list = data.filter((x) => regex.test(`${x.rg}${x.agency}${x.name}`));

    if (list.length == 0) {
        console.log("no result found");
        return;
    }

    list = list;

    if ($isMobile) return;
    search(`/rg-ifc/${replaceSpaceWithDash(list[0].rg)}`);
}

const search = debounce(updateURL, 300);

function updateURL(url) {
    goto(url, {
        keepFocus: true,
    });
}

function handleKeyDown(e) {
    if (e.ctrlKey && e.code == "KeyE") {
        e.preventDefault();
        input.focus();
        if (input.value) {
            input.select();
        }
    }
}

async function addRG() {
    const newRGData = {
        rg: newRG_ID,
        agency: select.getValue(),
        name: newRG_Name,
    };

    await timeout(500);
    modal.hide();
    newRG_ID = "";
    newRG_Name = "";
    data.push(newRGData);
    list = data;

    search(`/rg-ifc/${replaceSpaceWithDash(newRGData.rg)}`);
}
</script>

<svelte:window on:keydown={handleKeyDown} />

<Modal bind:this={modal} let:closeFromChild>
    <div class="modal">
        <h3>New RuleGroup</h3>
        <div class="field">
            <label for="">Agency</label>
            <Select
                bind:this={select}
                items={["URA", "BCA", "LTA", "SCDF", "NPARKS", "NEA", "PUB"]}
                searchable
                rows={[4]}
                style={{ borderRadius: ".25rem", padding: ".5rem" }}></Select>
        </div>

        <div class="field">
            <label for="">Rule Group ID</label>
            <input type="" bind:value={newRG_ID} />
        </div>

        <div class="field">
            <label for="">Name</label>
            <input type="" bind:value={newRG_Name} />
            <span class="info">A shortname to describe this rule</span>
        </div>

        <div class="buttonGroup">
            <button class="alt" on:click={addRG}>Add</button>
            <button class="" on:click={closeFromChild}>Cancel</button>
        </div>
    </div>
</Modal>

<div class="container">
    <div class="inputBox">
        <input
            class="placeholder-smaller"
            bind:this={input}
            type="search"
            bind:value={searchString}
            on:input={filter}
            spellcheck="false"
            on:keydown={(e) => {
                if (e.key == "Enter" && $isMobile) {
                    filter();
                }
            }}
            placeholder="Search..." />
        <div class="kbs">
            <code>Ctrl</code>
            <code>E</code>
        </div>
    </div>
    <div class="scrollable">
        {#each list as { rg, agency, name }}
            <div class="item">
                <a href="/rg-ifc/{rg}" class:selected={$page.params.rg == replaceSpaceWithDash(rg)}>
                    <span>{name}</span>
                </a>
            </div>
        {/each}
        {#if !list.length}
            <div class="noResult">
                <span class="no_result">No result found for '{searchString}'</span>
            </div>
        {/if}
    </div>
    <button
        class="add"
        on:click={() => {
            modal.show();
        }}>Add Rule Group</button>
</div>

<style lang="scss">
.container {
    display: flex;
    flex-direction: column;
    padding-block: 1rem;
    height: 100%;
    padding-inline: 1rem 1rem;
    .inputBox {
        display: grid;
        grid-template-columns: auto auto;
        width: 100%;
        margin-block: 0.5rem;
        input {
            min-width: 0;
            padding-right: 0;
        }
    }
    .scrollable {
        padding-right: 0.5rem;
        display: flex;
        flex-direction: column;
        scrollbar-gutter: stable;
        overflow-y: auto;
        padding-bottom: 6rem;
        a {
            justify-content: space-between;
            align-items: center;
            display: flex;
            text-decoration: none;
            padding-inline: 0;
            padding-block: 4px;
            span {
                font-size: 1rem;
                color: var(--main);
                font-size: 0.875rem;
                transition: all 0.3s;
                width: 100%;
                background-color: var(--bg-s);
                border-radius: 0.5rem;
                padding: 0.5rem;
                &:hover {
                    color: $url;
                }
            }
            &:hover {
                span {
                    background-color: $bg-alt;
                }
            }

            &.selected {
                span {
                    background-color: var(--accent);
                    color: var(--main-alt);
                }
            }
        }
    }
    button.add {
        display: flex;
        height: fit-content;
        margin-top: auto;
    }
}

.modal {
    width: 400px;
    @media screen and (max-width: $mobile) {
        width: 100%;
    }
}

.no_result {
    font-size: 0.875rem;
    padding: 0.5rem 0rem;
    border-radius: 0.25rem;
}
</style>
