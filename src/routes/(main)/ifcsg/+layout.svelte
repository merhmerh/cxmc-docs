<script>
import { onMount } from "svelte";
import dayjs from "dayjs";
import Icon from "@iconify/svelte";
import Sidebar from "./Sidebar.svelte";
import { goto } from "$app/navigation";
import { Select } from "merh-forge-ui";
import { ifcData, version } from "./ifcsg.store";
import { isMobile } from "$comp/device.store";
export let data;

const { supabase, versions, properties } = data;

let fetchStatus, ready, latestVersionTime, showMobileSidebar;

onMount(async () => {
    await loadIfcData(versions[0]);
    console.log($ifcData);
    // ready = true;
});

async function load(v) {
    $version = v.value;
    if (versions[0] != v) {
        const { data: db_data, error } = await supabase.from("airtable").select().eq("id", v.value);
        const res = db_data[0];
        latestVersionTime = dayjs(res.last_updated).format("DD/MM/YYYY HH:mm:ss");
        return res.result.airtable;
    }

    const localData = await isChecksumSame();

    if (!localData) {
        console.log("fetching");
        fetchStatus = "fetching";
        const { data: db_data, error } = await supabase
            .from("airtable")
            .select()
            .order("id", { ascending: false })
            .limit(1);

        // const result = await resp.json();
        console.log("fetch completed");
        const res = db_data[0];
        localStorage.setItem("airtable", JSON.stringify(res));
        latestVersionTime = dayjs(res.last_updated).format("DD/MM/YYYY HH:mm:ss");
        return res.result.airtable;
    } else {
        latestVersionTime = dayjs(localData.last_updated).format("DD/MM/YYYY HH:mm:ss");
        return localData.result.airtable;
    }
}

async function isChecksumSame() {
    // checked for freshness
    const { data, error } = await supabase
        .from("airtable")
        .select("checksum,last_updated")
        .order("id", { ascending: false })
        .limit(1);

    const db_lastUpdated = data[0].last_updated;
    const db_checksum = data[0].checksum;

    const localStorageRawData = localStorage.getItem("airtable");

    if (!localStorageRawData) {
        return false;
    }

    const localStorageData = JSON.parse(localStorageRawData);
    const localStorageChecksum = localStorageData.checksum;

    if (db_checksum !== localStorageChecksum) {
        return false;
    }

    if (db_lastUpdated !== localStorageData.last_updated) {
        localStorageData.last_updated = db_lastUpdated;
        localStorage.setItem("airtable", JSON.stringify(localStorageData));
    }

    return localStorageData;
}

function sanitizePset(pset) {
    const simplifiedPset = {};
    pset.forEach((row) => {
        const propsString = row.fields["Properties [Data Type]"];
        const allProps = [];
        if (propsString) {
            const arr = propsString.split(";");
            for (const value of arr) {
                const trimmed = value.trim().replace("\n", "");
                const propertyName = trimmed.replace(/(.*?)\[(.*?)\]/, "$1").trim();
                const measureResource = "";
                const dataType = trimmed.replace(/(.*?)\[(.*?)\]/, "$2").trim();
                allProps.push({ propertyName, dataType, measureResource });
            }
        }

        row.fields.props = allProps;

        const entities = row.fields["IFC4 Entities"] ?? [];

        entities.forEach((entity) => {
            if (!simplifiedPset[entity]) {
                simplifiedPset[entity] = {};
            }

            if (!simplifiedPset[entity][row.fields["Property Set"]]) {
                simplifiedPset[entity][row.fields["Property Set"]] = allProps;
            }
        });
    });
    return simplifiedPset;
}

function sanitizeAirtableComp(obj, pset) {
    const ifc = {};
    for (const row of obj) {
        const item = row.fields;
        const entity = item["IFC4 Entities"][0];

        let subtype = item["IFC4 Entity.Sub-Type"];

        if (Array.isArray(subtype)) {
            subtype = subtype[0];
        }

        const predefinedType =
            subtype.charAt(subtype.length - 1) == "*"
                ? "USERDEFINED"
                : subtype.replace(entity, "").replace(/\./, "") || null;

        const objectType =
            subtype.charAt(subtype.length - 1) == "*" ? subtype.replace(entity, "").replace(/^\.(.*?)\*$/, "$1") : null;

        const componentName = subtype.replace(entity, "").replace(/\./g, "").replace(/\*/g, "");
        const key = `${entity}:${predefinedType}:${objectType}`;

        const status = (() => {
            const v = item["Status"] || "required";
            const exclude = ["to be removed", "not used"];

            if (exclude.includes(v.toLowerCase())) {
                return false;
            } else {
                return true;
            }
        })();

        if (!ifc[key]) {
            ifc[key] = {
                identifiedComponent: item["Identified Component"],
                entity,
                predefinedType,
                objectType,
                pset: {},
                status: status,
                componentName,
            };
        }

        const propsString = item["Properties [Data Type]"];

        const props = [];
        if (propsString) {
            const arr = propsString.split(";");
            for (const value of arr) {
                const trimmed = value.trim().replace("\n", "");
                const propertyName = trimmed.replace(/(.*?)\[(.*?)\]/, "$1").trim();
                const measureResource = "";
                const dataType = trimmed.replace(/(.*?)\[(.*?)\]/, "$2").trim();
                props.push({ propertyName, dataType, measureResource });
            }
        }
        if (ifc[key].props) {
            ifc[key].props.push(props);
        } else {
            ifc[key].props = props;
        }
    }

    const result = [];
    for (const [key, obj] of Object.entries(ifc)) {
        let propList = obj.props.map((x) => x.propertyName);
        const EntityPsets = pset[obj.entity];

        propList.forEach((prop) => {
            if (!EntityPsets) return;
            outerLoop: for (const [pset, list] of Object.entries(EntityPsets)) {
                for (const pset_prop of list) {
                    if (pset_prop.propertyName == prop) {
                        if (!obj.pset[pset]) {
                            obj.pset[pset] = [];
                        }
                        obj.pset[pset].push(pset_prop);

                        break outerLoop;
                    }
                }
            }
        });

        delete obj.props;
        if (!Object.entries(obj.pset).length) {
            delete obj.pset;
        }
        result.push({ ...obj, key: key });
    }

    result.sort((a, b) => {
        if (a.key < b.key) {
            return -1;
        }
        if (a.key > b.key) {
            return 1;
        }
        return 0;
    });

    return result;
}

async function loadIfcData(v) {
    try {
        const ifcsg = await load(v);
        const pset = sanitizePset(ifcsg.pset);
        const rawIfcData = sanitizeAirtableComp(ifcsg.comp, pset);

        for (const [index, item] of rawIfcData.entries()) {
            const entity = item.entity;
            const matchingProps = properties.filter(
                (x) => x.Entity === entity && item.pset && item.pset[x.PropertySet],
            );

            if (matchingProps.length) {
                for (const prop of matchingProps) {
                    const pset = item.pset[prop.PropertySet];
                    const propIndex = pset.findIndex((row) => row.propertyName === prop.PropertyName);

                    if (propIndex !== -1) {
                        rawIfcData[index].pset[prop.PropertySet][propIndex] = { ...pset[propIndex], ...prop };
                    }
                }
            }
        }

        rawIfcData.latestVersionTime = latestVersionTime;
        $ifcData = rawIfcData;

        fetchStatus = "success";
        ready = true;
    } catch (error) {
        fetchStatus = "fail";
        console.log(error);
    }
    console.log("loaded version:", v.value);
}
</script>

<svelte:window
    on:scroll={() => {
        if (showMobileSidebar) {
            // document.body.style.overflow = "hidden";
        }
    }} />

{#if !ready && fetchStatus == "fetching"}
    <div class="loading">
        {#if fetchStatus == "fetching"}
            <div class="icon">
                <!-- <Icon icon="svg-spinners:blocks-wave" height="128" /> -->
                <Icon icon="line-md:loading-twotone-loop" height="128" />

                <p>Fetching data...</p>
            </div>
        {:else if fetchStatus == "fail"}
            <h3>Error in parsing latest result, please choose a older version</h3>
            <Select
                items={versions}
                placeholder="Select Version"
                style={{ borderRadius: "0.25rem", padding: ".5rem" }}
                on:change={(e) => {
                    goto(`/ifcsg`);
                    loadIfcData(e.detail);
                }} />
        {/if}
    </div>
{/if}

{#if $isMobile}
    <div class="m__header">
        <button
            class="none noHover m__sidebar__toggle"
            on:click={() => {
                showMobileSidebar = !showMobileSidebar;
            }}>
            <Icon icon="bi:filter-right" hFlip={true} height="24" />
        </button>
    </div>
{/if}

<div class="sidebar" class:m__show={showMobileSidebar}>
    {#if $ifcData}
        <Sidebar
            on:onNavigate={() => {
                showMobileSidebar = false;
            }} />
    {/if}
</div>

<div class="content">
    <div class="content__header">
        <div class="content__header__left"></div>

        <div class="content__header__right">
            <div class="content__header__version-select">
                <Select
                    items={versions}
                    defaultValue={[0]}
                    style={{ borderRadius: "0.25rem", padding: ".5rem" }}
                    on:change={(e) => {
                        goto(`/ifcsg`);
                        loadIfcData(e.detail);
                    }} />
            </div>

            <div class="content__header__reload">
                <button
                    class="icon none"
                    on:click={() => {
                        localStorage.removeItem("airtable");
                        location.reload();
                    }}>
                    <Icon icon="ic:baseline-refresh" height="20" />
                </button>
            </div>
        </div>
    </div>
    {#if $ifcData}
        <slot />
    {/if}
</div>

<style lang="scss">
.m__header {
    position: sticky;
    width: 100vw;
    top: 70px;
    z-index: 100;
    height: 32px;
    padding-inline: 0.5rem;
    border-bottom: 1px solid var(--grey-lightest);
    background-color: $bg-p;
    background: rgba(var(--bg-rgb), 95%);
}
button.m__sidebar__toggle {
    padding: 0.25rem;
    color: var(--mono);
}

.sidebar {
    position: sticky;
    top: 70px;
    height: calc(100svh - 70px);
    overflow-y: auto;
    border-right: 1px solid $grey-lighter;
    @media screen and (max-width: $mobile) {
        position: fixed;
        left: 0px;
        top: calc(70px + 32px);
        height: calc(100svh - 70px - 32px);
        z-index: 100;
        transform: translateX(-100%);
        background-color: $bg-p;
        max-width: 90vw;
        transition: all 0.3s;
        &.m__show {
            transform: translateX(0%);
        }
    }
}

.content {
    padding-top: 2rem;
    margin-inline: auto;
    width: 100%;
    max-width: min(calc(100vw - 300px), 1500px);
    min-height: calc(100svh - 70px);
    padding-bottom: 100px;
    padding-inline: 2rem;
    @media screen and (max-width: $mobile) {
        width: 100%;
        max-width: none;
        padding-inline: 1rem;
        font-size: 0.875rem;
        padding-top: 1rem;
    }

    .content__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .content__header__right {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            @media screen and (max-width: $mobile) {
                width: 100%;
            }
            .content__header__version-select {
                width: 250px;
                font-size: 0.875rem;
                @media screen and (max-width: $mobile) {
                    width: 100%;
                }
            }
            .content__header__reload {
                display: flex;
                button {
                    display: flex;
                    height: 100%;
                    padding: 0.5rem;
                    border: 1px solid var(--mono-300);
                }
            }
        }
    }
}

.loading {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    grid-column: 1 / -1;
    width: 100vw;
    height: 100vh;
    @include bg-blur;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .icon {
        display: flex;
        flex-direction: column;
        color: var(--grey-light);
    }
}
</style>
