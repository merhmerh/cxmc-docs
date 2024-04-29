<script>
import { v5 as uuidv5 } from "uuid";
import { uuid } from "$fn/helper.js";
import Icon from "@iconify/svelte";
import RevitParam from "./revitParam.svelte";
import { onMount } from "svelte";
import { notify } from "merh-forge-ui";

let mappingFile = "";
let paramFile = "";
let newMappingFile, newParamFile;
let ifcData = [];
let complete;

class IfcItem {
    constructor() {
        this.id = uuid();
        this.IfcEntity = "";
        this.PredefinedType = "";
        this.ObjectType = "";
        this.props = [
            {
                id: uuid(),
                PropertySet: "",
                PropertyName: "",
                DataType: "",
            },
        ];
    }
}

onMount(async () => {
    ifcData.push(new IfcItem());
    ifcData = ifcData;
});

function uploadFile(type) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            if (type === "ifc") {
                mappingFile = content;
            } else if (type === "param") {
                paramFile = content;
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

async function generate() {
    //convert to props list
    const props = [];
    for (const ifc of ifcData) {
        for (const prop of ifc.props) {
            if (!ifc.IfcEntity || !prop.PropertyName || !prop.PropertySet || !prop.DataType) {
                notify.add("All fields are required");
                return;
            }

            props.push({
                Entity: ifc.IfcEntity,
                PropertySet: prop.PropertySet,
                PropertyName: prop.PropertyName,
                DataType: prop.DataType,
            });
        }
    }

    newParamFile = createSharedParamFile(paramFile, props);
    newMappingFile = createMappingFile(mappingFile, props);
    if (!newParamFile) return;
    if (!newMappingFile) return;

    complete = true;
    downloadFile("newParam.txt", newParamFile, "text/plain");
    downloadFile("newMapping.txt", newMappingFile, "text/plain");
}
function downloadFile(fileName, data, type) {
    const blob = new Blob([data], { type: type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
}

function createSharedParamFile(param, props) {
    const dnsNameSpace = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    const namespace = uuidv5("ifcsg-revit-shared-params-v1", dnsNameSpace);

    for (const prop of props) {
        const guid = uuidv5(prop.PropertyName, namespace);

        const dataType = mapDataType(prop.DataType);

        if (!dataType) {
            notify.add("Invalid DataType");
            return false;
        }
        const str = `PARAM\t${guid}\t${prop.PropertyName}\t${dataType}\t\t1\t1\t\t1\t0\n`;
        param += str;
    }

    function mapDataType(ifcDataType) {
        //ifcDataType : revitSharedParamDataType
        const dataTypeMap = {
            length: "LENGTH",
            label: "TEXT",
            integer: "INTEGER",
            boolean: "YESNO",
            real: "NUMBER",
            area: "AREA",
        };

        if (!dataTypeMap[ifcDataType.toLowerCase()]) {
            console.log("Invalid DataType", ifcDataType);
            return false;
        }

        return dataTypeMap[ifcDataType.toLowerCase()];
    }

    return param;
}

function createMappingFile(mapping, props) {
    const groups = mapping.trim().split("\n\n");
    //convert to json
    const mappingJSON = [];
    for (const group of groups) {
        const lines = group.split("\n");

        const [_, pset, type, entity] = lines[0].split("\t");
        const data = {
            PropertySet: pset,
            Type: type,
            Entity: entity,
            Properties: [],
        };

        for (const item of lines.slice(1)) {
            const [_, PropertyName, DataType] = item.split("\t");
            data.Properties.push({ PropertyName, DataType });
        }

        mappingJSON.push(data);
    }

    outer: for (const prop of props) {
        let n = 0;
        for (const x of mappingJSON) {
            const psetMatch = x.PropertySet === prop.PropertySet;
            const entityMatch = x.Entity.replace("Type", "") === prop.Entity;

            if (psetMatch && entityMatch) {
                n++;
                x.Properties.push({
                    PropertyName: prop.PropertyName,
                    DataType: prop.DataType,
                });
                if (n == 2) continue outer;
            }
        }

        //if not found, create new group
        const data_i = {
            PropertySet: prop.PropertySet,
            Type: "I",
            Entity: prop.Entity,
            Properties: [
                {
                    PropertyName: prop.PropertyName,
                    DataType: prop.DataType,
                },
            ],
        };
        const data_t = structuredClone(data_i);
        data_t.Type = "T";
        [data_i, data_t].forEach((data) => mappingJSON.push(data));
    }

    //convert back to string
    let newMappingTextFile = "";
    for (const group of mappingJSON) {
        newMappingTextFile += `PropertySet:\t${group.PropertySet}\t${group.Type}\t${group.Entity}\n`;
        for (const prop of group.Properties) {
            newMappingTextFile += `\t${prop.PropertyName}\t${prop.DataType}\n`;
        }
        newMappingTextFile += "\n";
    }
    return newMappingTextFile;
}

function downloadAgain() {
    downloadFile("newParam.txt", newParamFile, "text/plain");
    downloadFile("newMapping.txt", newMappingFile, "text/plain");
}
</script>

<div class="container">
    <h2>Step 1.</h2>
    <div class="buttons">
        <button class="none" on:click={() => uploadFile("ifc")}>
            {#if !mappingFile}
                <Icon icon="mdi:checkbox-blank-outline" width="24" height="24" />
            {:else}
                <Icon icon="mdi:checkbox-outline" width="24" height="24" />
            {/if}
            Upload Revit IFC Mapping File
        </button>

        <button class="none" on:click={() => uploadFile("param")}>
            {#if !paramFile}
                <Icon icon="mdi:checkbox-blank-outline" width="24" height="24" />
            {:else}
                <Icon icon="mdi:checkbox-outline" width="24" height="24" />
            {/if}
            Upload Revit Shared Parameter File
        </button>
    </div>
    {#if mappingFile && paramFile}
        <h2>Step 2.</h2>
        <button
            on:click={() => {
                ifcData.push(new IfcItem());
                ifcData = ifcData;
            }}>Add New IFC</button>
        {#each ifcData as item (item.id)}
            <RevitParam
                bind:data={item}
                on:deleteItem={() => {
                    if (ifcData.length == 1) {
                        notify.add("At least one IFC must be present");
                        return;
                    }
                    ifcData = ifcData.filter((i) => i.id !== item.id);
                }} />
        {/each}

        <div class="divider"></div>
        <button class="alt" on:click={generate}>Generate IFC</button>
    {/if}

    {#if complete}
        <h2 id="done">DONE!</h2>
        <span>
            Your download will begin shortly. If it doesn't start automatically, please <button
                class="none"
                on:click={downloadAgain}><code>click here</code></button>
            to download manually.
        </span>
    {/if}
</div>

<style lang="scss">
.container {
    padding-bottom: 10rem;
    grid-column: 1 / -1;
    width: 900px;
    padding-top: 2rem;
    margin-inline: auto;
    .buttons {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        button {
            gap: 0.5rem;
        }
    }
}
.divider {
    width: 100%;
    height: 1px;
    background-color: var(--mono-100);
    margin-block: 2rem;
}
</style>
