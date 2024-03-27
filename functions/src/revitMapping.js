import fs from "fs";
import dotenv from "dotenv";
import { supabase, calcChecksum, uuid } from "./helper.js";
dotenv.config();

export function generateRevitIfcMappingTable() {
    return new Promise(async (resolve, reject) => {
        const t0 = performance.now();
        const result = await getIfc({ beta: true });

        const pset_obj = sortPset(result);

        const typeEntities = getIfcTypes();
        let mapping = "";

        for (const [psetName, { entity, prop }] of Object.entries(pset_obj)) {
            mapping += `\nPropertySet:\t${psetName}\tI\t${entity}\n`;
            for (const p of prop) {
                mapping += `\t${p.propertyName}\t${p.dataType}\n`;
            }

            if (typeEntities.includes(entity + "Type")) {
                mapping += `\nPropertySet:\t${psetName}\tT\t${entity}Type\n`;
                for (const p of prop) {
                    mapping += `\t${p.propertyName}\t${p.dataType}\n`;
                }
            }
        }

        const t1 = performance.now();
        console.log("Mapping Generated in", (t1 - t0).toFixed(2));

        fs.writeFileSync("./src/revit/Revit_IFC-Mapping-Configuration.txt", mapping);
    });
}

function sortPset(ifcsg) {
    const psets = {};

    for (const { entity, pset } of ifcsg) {
        if (!pset) continue;
        for (const [psetName, prop] of Object.entries(pset)) {
            if (!psets[psetName]) {
                psets[psetName] = { entity: entity, prop: [] };
            }

            prop.forEach((p) => {
                if (psets[psetName].prop.find((x) => x.propertyName == p.propertyName)) {
                    return;
                }
                psets[psetName].prop.push(p);
            });
        }
    }

    return psets;
}

export async function getIfc(opt) {
    const { data, error } = await supabase.from("ifcsg").select();
    if (error) {
        console.log(error);
        return;
    }
    // const result = data
    const { beta } = opt;

    const result = data.filter((x) => {
        if (!beta) {
            return x;
        } else {
            return x.beta == true;
        }
    });

    for (const item of result) {
        if (!item.pset) continue;

        // if (item.key !== 'IfcBuilding:null:null') continue;

        let psets = {};
        for (const [psetName, prop] of Object.entries(item.pset)) {
            const betaProps = prop.filter((x) => {
                if (!beta) {
                    return x;
                } else {
                    return x.beta == true;
                }
            });

            if (betaProps.length) {
                psets[psetName] = betaProps;
            }
        }

        if (Object.entries(psets).length == 0) {
            psets = null;
        }
        item.pset = psets;
    }

    return result;
}

function getIfcTypes() {
    const file = fs.readFileSync("./resources/ifcTypes.txt", "utf8").split("\n").slice(1);
    const re = /Ifc(.+?)Type$/;
    return file.map((x) => x.split("\t")[0].trim()).filter((c) => c.match(re));
}
