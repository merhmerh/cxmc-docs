import dotenv from "dotenv";
import { v4, v5 as uuidv5 } from "uuid";
import { getIfc } from "./revitMapping.js";
import fs from "fs";

const dnsNameSpace = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

const namespace = uuidv5("ifcsg-revit-shared-params-v1", dnsNameSpace);

const ifcsg = JSON.parse(fs.readFileSync("./src/temp.json"));

const props = getProps(ifcsg);

let file = `# Base Name: ifcsg-revit-shared-params-v1
# Base Namespace: ${dnsNameSpace}
*META\tVERSION\tMINVERSION
META\t2\t1
*GROUP\tID\tNAME
GROUP\t1\tifcsg
*PARAM\tGUID\tNAME\tDATATYPE\tDATACATEGORY\tGROUP\tVISIBLE\tDESCRIPTION\tUSERMODIFIABLE\tHIDEWHENNOVALUE
`;

for (const { name, ifcDataType } of props) {

    const dataType = mapDataType(ifcDataType)
    const uuid = uuidv5(name, namespace)
    file += `PARAM\t${uuid}\t${name}\t${dataType}\t\t1\t1\t\t1\t0\n`

}

fs.writeFileSync('./src/revitSharedParams.txt', file)



function mapDataType(ifcDataType) {
    const dataTypeMap = {
        length: "LENGTH",
        label: "TEXT",
        integer: "INTEGER",
        boolean: "YESNO",
        real: "NUMBER"
    }

    if (!dataTypeMap[ifcDataType.toLowerCase()]) {
        console.log('Invalid DataType', ifcDataType);
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
                result.push({ name: p.propertyName, ifcDataType: p.dataType });
            });
        }
    }
    return result
}
