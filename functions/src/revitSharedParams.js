import { v5 as uuidv5 } from "uuid";
import { getIfc } from "./revitMapping.js";
import fs from "fs";

const dnsNameSpace = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

const namespace = uuidv5("ifcsg-revit-shared-params-v1", dnsNameSpace);


let file = `# Base Name: ifcsg-revit-shared-params-v1
# Base Namespace: ${dnsNameSpace}
# Generated with uuidv5(propertyName,uuidv5(baseName,baseNameSpace))
*META\tVERSION\tMINVERSION
META\t2\t1
*GROUP\tID\tNAME
GROUP\t1\tifcsg
*PARAM\tGUID\tNAME\tDATATYPE\tDATACATEGORY\tGROUP\tVISIBLE\tDESCRIPTION\tUSERMODIFIABLE\tHIDEWHENNOVALUE
`;


export async function getSharedParams(isBeta = true) {
    const ifcsg = await getIfc({ beta: isBeta })
    const props = getProps(ifcsg);

    const result = []

    addIfcObjectType()
    function addIfcObjectType() {
        const guid = uuidv5('IfcObjectType', namespace)
        file += `PARAM\t${guid}\t${'IfcObjectType'}\t${'TEXT'}\t\t1\t1\t\t1\t0\n`
        result.push({
            guid,
            name: 'IfcObjectType',
            dataType: 'TEXT',
            entity: 'all',
        })
    }

    for (const { name, ifcDataType, entity } of props) {

        const dataType = mapDataType(ifcDataType)
        if (!dataType) {
            console.log('--invalid data type:', entity, name);
        }
        const guid = uuidv5(name, namespace)
        file += `PARAM\t${guid}\t${name}\t${dataType}\t\t1\t1\t\t1\t0\n`
        result.push({
            guid,
            name,
            dataType,
            entity,
        })

    }

    fs.writeFileSync('./src/revit/Revit_SharedParameters.txt', file)

    return { result, file }
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
    }

    if (!dataTypeMap[ifcDataType.toLowerCase()]) {
        console.log('Invalid DataType', ifcDataType);
        return false
    }

    return dataTypeMap[ifcDataType.toLowerCase()]

}

function getProps(ifcsg) {
    const result = [];
    for (const { entity, pset } of ifcsg) {
        if (!pset) continue;

        for (const [psetName, prop] of Object.entries(pset)) {
            prop.forEach((p) => {
                if (result.find((x) => x.name == p.propertyName)) return;
                result.push({ name: p.propertyName, ifcDataType: p.dataType, entity: entity });
            });
        }
    }

    return result
}
