<script>
import { onMount } from "svelte";

let entities;

// onMount(() => {
//     const ifcRaw = JSON.parse(localStorage.getItem("airtable")).result.airtable;

//     const pset = sanitizePset(ifcRaw.pset);
//     const ifcData = sanitizeAirtableComp(ifcRaw.comp, pset);

//     const entitiesRaw = ifcData.map((x) => x.entity);
//     const subtypes = mutateData(ifcData);
//     let list = [];
//     for (const [key, value] of Object.entries(subtypes)) {
//         list.push({ entity: key, subtypes: value.types.length });
//     }
//     entities = {
//         total: [...new Set(entitiesRaw)].length,
//         subtypes: list.sort((a, b) => b.subtypes - a.subtypes),
//     };
//     console.log(entities.subtypes);
// });

// function sanitizePset(pset) {
//     const simplifiedPset = {};
//     pset.forEach((row) => {
//         const propsString = row.fields["Properties [Data Type]"];
//         const allProps = [];
//         if (propsString) {
//             const arr = propsString.split(";");
//             for (const value of arr) {
//                 const trimmed = value.trim().replace("\n", "");
//                 const propertyName = trimmed.replace(/(.*?)\[(.*?)\]/, "$1").trim();
//                 const measureResource = "";
//                 const dataType = trimmed.replace(/(.*?)\[(.*?)\]/, "$2").trim();
//                 allProps.push({ propertyName, dataType, measureResource });
//             }
//         }

//         row.fields.props = allProps;

//         const entities = row.fields["IFC4 Entities"] ?? [];

//         // if (!entity) return;
//         entities.forEach((entity) => {
//             if (!simplifiedPset[entity]) {
//                 simplifiedPset[entity] = {};
//             }

//             if (!simplifiedPset[entity][row.fields["Property Set"]]) {
//                 simplifiedPset[entity][row.fields["Property Set"]] = allProps;
//             }
//         });
//     });
//     return simplifiedPset;
// }

// function sanitizeAirtableComp(obj, pset) {
//     const ifc = {};
//     for (const row of obj) {
//         const item = row.fields;
//         const entity = item["IFC4 Entities"][0];

//         let subtype = item["IFC4 Entity.Sub-Type"];

//         if (Array.isArray(subtype)) {
//             subtype = subtype[0];
//         }

//         const predefinedType =
//             subtype.charAt(subtype.length - 1) == "*" ? "USERDEFINED" : subtype.replace(entity, "").replace(/\./, "");

//         const objectType =
//             subtype.charAt(subtype.length - 1) == "*" ? subtype.replace(entity, "").replace(/^\.(.*?)\*$/, "$1") : null;

//         const componentName = subtype.replace(entity, "").replace(/\./g, "").replace(/\*/g, "");
//         const key = `${entity}:${predefinedType}:${objectType}`;

//         const status = (() => {
//             const v = item["Status"] || "required";
//             const exclude = ["to be removed", "not used"];

//             if (exclude.includes(v.toLowerCase())) {
//                 return false;
//             } else {
//                 return true;
//             }
//         })();

//         if (!ifc[key]) {
//             ifc[key] = {
//                 identifiedComponent: item["Identified Component"],
//                 entity,
//                 predefinedType,
//                 objectType,
//                 pset: {},
//                 status: status,
//                 componentName,
//             };
//         }

//         const propsString = item["Properties [Data Type]"];

//         const props = [];
//         if (propsString) {
//             const arr = propsString.split(";");
//             for (const value of arr) {
//                 const trimmed = value.trim().replace("\n", "");
//                 const propertyName = trimmed.replace(/(.*?)\[(.*?)\]/, "$1").trim();
//                 const measureResource = "";
//                 const dataType = trimmed.replace(/(.*?)\[(.*?)\]/, "$2").trim();
//                 props.push({ propertyName, dataType, measureResource });
//             }
//         }
//         if (ifc[key].props) {
//             ifc[key].props.push(props);
//         } else {
//             ifc[key].props = props;
//         }
//     }

//     const result = [];
//     for (const [key, obj] of Object.entries(ifc)) {
//         let propList = obj.props.map((x) => x.propertyName);
//         const EntityPsets = pset[obj.entity];

//         propList.forEach((prop) => {
//             if (!EntityPsets) return;
//             outerLoop: for (const [pset, list] of Object.entries(EntityPsets)) {
//                 // const psetPropList = list.map((x) => x.propertyName);
//                 for (const pset_prop of list) {
//                     if (pset_prop.propertyName == prop) {
//                         if (!obj.pset[pset]) {
//                             obj.pset[pset] = [];
//                         }
//                         obj.pset[pset].push(pset_prop);

//                         break outerLoop;
//                     }
//                 }
//             }
//         });

//         delete obj.props;
//         if (!Object.entries(obj.pset).length) {
//             delete obj.pset;
//         }
//         result.push({ ...obj, key: key });
//     }

//     result.sort((a, b) => {
//         // if (a.status !== b.status) {
//         //     return b.status - a.status;
//         // }

//         if (a.key < b.key) {
//             return -1;
//         }
//         if (a.key > b.key) {
//             return 1;
//         }

//         // if (a.componentName < b.componentName) {
//         //     return -1;
//         // }
//         // if (a.componentName > b.componentName) {
//         //     return 1;
//         // }

//         return 0;
//     });

//     // result.sort((a, b) => {
//     //     if (a.status !== b.status) {
//     //         return b.status - a.status;
//     //     }
//     //     return 0;
//     // });

//     return result;
// }

// function mutateData(data) {
//     const map = new Map();
//     for (const row of data) {
//         const c = {
//             entity: row.entity,
//             subtype: row.objectType == null ? row.predefinedType : row.objectType,
//             key: row.key,
//             status: row.status,
//         };
//         if (!map.has(row.entity)) {
//             map.set(row.entity, [c]);
//         } else {
//             map.get(row.entity).push(c);
//         }
//     }

//     const sorted = Array.from(map).sort((a, b) => a[1] - b[1]);

//     const result = {};
//     for (const [key, arr] of sorted) {
//         let keywords = [key];
//         for (const type of arr) {
//             keywords.push(type.subtype);
//         }
//         keywords = keywords.join(",");
//         result[key] = {
//             keywords,
//             selected: false,
//             types: arr,
//         };
//     }

//     return result;
// }
</script>

<h1>ADMIN PORTAL</h1>

<!-- <div class="dashboard">
    <div class="row">
        {#if entities}
            <div class="card card__entity">
                <div>
                    Number of IfcEntity: {entities.total}
                </div>
                <div>Entity with most subtypes</div>
                <ul>
                    {#each Array(10) as _, i}
                        <li>{entities.subtypes[i].entity}: {entities.subtypes[i].subtypes}</li>
                    {/each}
                </ul>
            </div>
        {/if}
        <div class="card"></div>
        <div class="card"></div>
        <div class="card"></div>
    </div>
</div> -->

<style lang="scss">
.row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 3rem;
}
.card {
    background-color: var(--bg-s);
    height: 400px;
    border-radius: 0.5rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    &.card__entity {
        font-size: 1rem;
        ul {
            margin: 0;
            padding: 0;
            li {
                margin: 0;
                padding: 0;
                padding-block: 0.25rem;
                list-style-type: none;
            }
        }
    }
}
</style>
