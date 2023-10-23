
const fs = require('fs')

const comp_id = JSON.parse(fs.readFileSync('./output/comp_id.json', 'utf-8'))
const pset_id = JSON.parse(fs.readFileSync('./output/pset_id.json', 'utf-8'))


const ifcsg = { comp_id, pset_id }

const temp_list = []

const pset = sanitizePset(ifcsg.pset_id);
const rawIfcData = sanitizeAirtableComp(ifcsg.comp_id, pset);

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

    const betaProps = []
    for (const item of comp_id) {
        const f = item.fields
        const betaPropString = f['Beta Properties [Data Type]']
        const props = [];
        if (betaPropString) {
            const arr = betaPropString.split(";");
            for (const value of arr) {
                const trimmed = value.trim().replace("\n", "");
                const propertyName = trimmed.replace(/(.*?)\[(.*?)\]/, "$1").trim();
                const dataType = trimmed.replace(/(.*?)\[(.*?)\]/, "$2").trim();
                props.push({ propertyName, dataType });
            }
        }

        let subtype = f["IFC4 Entity.Sub-Type"];

        if (Array.isArray(subtype)) {
            subtype = subtype[0];
        }

        if (props.length) {
            betaProps.push({ subtype, props })
        }
    }

    const clonedPset = JSON.parse(JSON.stringify(simplifiedPset))

    for (const { subtype, props: betaPropsArray } of betaProps) {
        const entity = subtype.split(/\./)[0]
        if (clonedPset[entity]) {
            let betaPropName = betaPropsArray.map(x => x.propertyName)

            for (const [pset, props] of Object.entries(clonedPset[entity])) {
                for (const [index, prop] of props.entries()) {
                    if (betaPropName.includes(prop.propertyName)) {
                        clonedPset[entity][pset][index].beta = true
                    }
                }
            }
        }
    }

    return clonedPset;
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


        if (item["Beta"]) {
            temp_list.push(key);
        }

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
                beta: item["Beta"] ? true : false
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



fs.writeFileSync(`./output/test.json`, JSON.stringify(rawIfcData, null, 2))

// console.log(temp_list.sort());


function checkMultipleICtoSubtypes() {
    let subtypes = []
    for (const item of comp_id) {
        const f = item.fields

        subtypes.push(f["IFC4 Entity.Sub-Type"])
    }
    subtypes = [... new Set(subtypes)]

    const obj = {}
    for (const subtype of subtypes) {
        obj[subtype] = []
        for (const item of comp_id) {
            const f = item.fields
            if (f["IFC4 Entity.Sub-Type"] == subtype) {

                const status = (() => {
                    const v = f["Status"] || "required";
                    const exclude = ["to be removed", "not used"];

                    if (exclude.includes(v.toLowerCase())) {
                        return false;
                    } else {
                        return true;
                    }
                })();

                if (status) {
                    obj[subtype].push(f["Identified Component"])
                }
            }
        }
    }
    let string = ""
    for (const [key, arr] of Object.entries(obj)) {
        if (arr.length > 1) {
            const arrString = arr.map(x => `"${x}"`).join(',')
            string += `${key}: ${arrString} \n`
        }
    }

    fs.writeFileSync(`./output/test3.json`, string)

}