import fs from 'fs'
import dotenv from 'dotenv';
import { supabase, calcChecksum, uuid } from './helper.js'
dotenv.config()

export function generateRevitIfcMappingTable() {
    return new Promise(async (resolve, reject) => {
        const t0 = performance.now()
        const result = await getIfc({ beta: true })

        const pset_obj = sortPset(result)

        let mapping = ""
        for (const [psetName, { entity, prop }] of Object.entries(pset_obj)) {
            mapping += `\nPropertySet:\t${psetName}\tI\t${entity}\n`
            for (const p of prop) {
                mapping += `\t${p.propertyName}\t${p.dataType}\n`
            }
        }

        const t1 = performance.now()
        console.log('Mapping Generated in', (t1 - t0).toFixed(2));

        const title = 'Revit-IFC-Mapping-Configuration'

        // fs.writeFileSync('./output/Revit-IFC-Mapping-Configuration.txt', mapping)

        const checksum = calcChecksum(mapping)
        const fileName = `${title}-${uuid(8)}.txt`
        const blob = new Blob([JSON.stringify(mapping)])
        const fileSize = blob.size;

        //check if exits
        const { data, error } = await supabase.from('downloads').select()
            .match({ checksum: checksum, title: title })


        if (data.length) {
            return resolve({ message: "Mapping existed, checksum matches", data: mapping })
        }

        //Does not exist -> upload
        try {
            const path = `downloads/revit-ifc-mapping-configuration/${fileName}`
            await supabase
                .storage
                .from('public')
                .upload(path, mapping)

            const { data: url } = supabase.storage.from("public").getPublicUrl(path);

            const { data, error } = await supabase.from('downloads').insert({
                category: 'Revit',
                description: 'Revit IFC Parameter Mapping Table',
                fileName: fileName,
                fileSize: fileSize,
                type: "text/plain",
                checksum: checksum,
                url: url.publicUrl,
                title: title,
            }).select()

            resolve({ message: "Success", data: mapping })
        } catch (error) {
            reject(error)
        }
    })
}

function sortPset(ifcsg) {

    const psets = {}

    for (const { entity, pset } of ifcsg) {
        if (!pset) continue;
        for (const [psetName, prop] of Object.entries(pset)) {
            if (!psets[psetName]) {
                psets[psetName] = { entity: entity, prop: [] }
            }

            prop.forEach(p => {
                if (psets[psetName].prop.find(x => x.propertyName == p.propertyName)) {
                    return
                }
                psets[psetName].prop.push(p)
            })

        }
    }

    return psets
}

async function getIfc(opt) {
    const { data, error } = await supabase
        .from("ifcsg")
        .select()

    // const result = data
    const { beta } = opt

    const result = data.filter(x => {
        if (!beta) {
            return x
        } else {
            return x.beta == true
        }
    })


    for (const item of result) {
        if (!item.pset) continue;

        // if (item.key !== 'IfcBuilding:null:null') continue;

        let psets = {};
        for (const [psetName, prop] of Object.entries(item.pset)) {

            const betaProps = prop.filter(x => {
                if (!beta) {
                    return x
                } else {
                    return x.beta == true
                }
            })

            if (betaProps.length) {
                psets[psetName] = betaProps
            }
        }

        if (Object.entries(psets).length == 0) {
            psets = null
        }
        item.pset = psets
    }

    // fs.writeFileSync('./output/test.json', JSON.stringify(result, null, 2))

    return result

}

