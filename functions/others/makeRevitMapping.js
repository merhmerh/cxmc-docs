const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SECRET = process.env.SUPABASE_SECRET

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET)

main()
async function main() {
    const result = await getIfc({ beta: true })

    let mapping = ""
    for (const { entity, pset } of result) {
        if (!pset) continue;

        for (const [psetName, prop] of Object.entries(pset)) {
            mapping += `PropertySet:\t${psetName}\tI\t${entity}\n`

            prop.forEach(p => {
                mapping += `\t${p.propertyName}\t${p.dataType}\n`
            })

        }
        mapping += `\n`
    }

    fs.writeFileSync('./output/Revit_IFC_Mapping.txt', mapping)
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

    fs.writeFileSync('./output/test.json', JSON.stringify(result, null, 2))

    return result

}

