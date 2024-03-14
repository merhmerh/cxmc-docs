const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
require('dotenv').config();

const { nanoid } = require('nanoid')


const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SECRET = process.env.SUPABASE_SECRET

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET)

main()
async function main() {
    const t0 = performance.now()
    const result = await getIfc({ beta: true })

    const pset_obj = sortPset(result)
    // fs.writeFileSync('./output/test.json', JSON.stringify(pset_obj, null, 2))

    let mapping = ""
    for (const [psetName, { entity, prop }] of Object.entries(pset_obj)) {
        mapping += `\nPropertySet:\t${psetName}\tI\t${entity}\n`
        for (const p of prop) {
            mapping += `\t${p.propertyName}\t${p.dataType}\n`
        }
    }

    const t1 = performance.now()
    console.log('done in', (t1 - t0).toFixed(2));
    fs.writeFileSync('./output/Revit-IFC-Mapping-Configuration.txt', mapping)

    const fileName = `Revit-IFC-Mapping-Configuration-7a219af1fg.txt`
    await supabase
        .storage
        .from('public')
        .upload(`downloads/revit-ifc-mapping-configuration/${fileName}`, mapping)
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

