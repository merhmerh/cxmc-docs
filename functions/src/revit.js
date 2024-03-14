import { generatePickListXML } from "./revitBITPickList.js";
import { generateBIT_XML } from "./revitBITSharedParams.js";
import { generateRevitIfcMappingTable } from "./revitMapping.js";
import { getSharedParams } from "./revitSharedParams.js";

main()
async function main() {

    getSharedParams().then(() => {
        console.log('--Written Shared Parameter (txt)');
    })

    generateRevitIfcMappingTable().then(() => {
        console.log('--Written IFC Mapping Table (txt)');
    })


    generateBIT_XML().then(() => {
        console.log('--Written BIT Params (xml)');
    })

    generatePickListXML().then(() => {
        console.log('--Written Pick List (xlsx)');
    })


}