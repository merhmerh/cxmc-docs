import { sanitizePset } from "../src/airtable.js";
import fs from "fs";
import comp_id from "../output/comp_id.json" assert { type: "json" };
import pset_id from "../output/pset_id.json" assert { type: "json" };

const pset = sanitizePset(comp_id, pset_id);
fs.writeFileSync("./output/test.json", JSON.stringify(pset, null, 2));

const rawIfcData = sanitizeAirtableComp(comp_id, pset);

fs.writeFileSync("./output/rawIfcData.json", JSON.stringify(rawIfcData, null, 2));

export function sanitizeAirtableComp(obj, pset) {
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

        let componentName = subtype.replace(entity, "").replace(/\./g, "").replace(/\*/g, "");
        if (!predefinedType && !objectType) {
            componentName = entity.replace(/^ifc/i, "").toUpperCase();
            // console.log(componentName);
        }

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

        if (!status) {
            continue;
        }

        if (!ifc[key]) {
            ifc[key] = {
                identifiedComponent: item["Identified Component"],
                entity,
                predefinedType,
                objectType,
                pset: {},
                status: status,
                componentName,
                beta: item["Beta"] ? true : false,
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

        if (propList.includes("ParkingType")) {
            console.log(key);
            // console.log(EntityPsets["SGPset_BuildingElementProxy"]);
        }
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
