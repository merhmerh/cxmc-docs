const fs = require('fs')

const comp = JSON.parse(fs.readFileSync('./output/comp_id.json', 'utf-8'))
const rule = JSON.parse(fs.readFileSync('./output/rule_id.json', 'utf-8'))
const entity = JSON.parse(fs.readFileSync('./output/entity_id.json', 'utf-8'))

const ics = []
for (const item of comp) {
    const field = item.fields
    if (field.Status && field.Status.match(/not\sused|removed/i)) {
        continue;
    }

    // if (field.Beta !== true) {
    //     continue;
    // }

    ics.push(field["Identified Component"])
}

const unique_ic = [...new Set(ics)]
const arr = unique_ic.map(x => x = { IdentifiedComponent: x })


for (const item of comp) {
    const field = item.fields
    for (const ic of arr) {
        if (field["Identified Component"] == ic.IdentifiedComponent && field.Beta == true) {
            ic.Beta = true
        } else if (!ic.Beta) {
            ic.Beta = false
        }
    }
}


const t1 = performance.now()
for (const item of arr) {
    const IC = item.IdentifiedComponent
    const found = comp.filter(x => x.fields["Identified Component"] == IC)

    const SubTypeKeys = []
    for (const { fields } of found) {
        const subtype = fields["IFC4 Entity.Sub-Type"].toString()

        const entity = fields['IFC4 Entities']
        const predefinedType =
            subtype.charAt(subtype.length - 1) == "*"
                ? "USERDEFINED"
                : subtype.replace(entity, "").replace(/\./, "") || null;

        const objectType =
            subtype.charAt(subtype.length - 1) == "*" ? subtype.replace(entity, "").replace(/^\.(.+?)\*$/, "$1") : null;

        const key = `${entity}:${predefinedType}:${objectType}`;
        SubTypeKeys.push(key)
    }


    const gateway = []
    const regex = new RegExp(`^${IC}$`, "i")
    for (const { fields } of rule) {
        if (!fields["Identified Components"]) {
            continue;
        }
        const rule_ics = fields["Identified Components"].split(';').map(c => c.trim())
        const match = rule_ics.some(x => regex.test(x))

        if (fields["Status"] !== 'Finalised') {
            continue;
        }

        if (!match) continue;

        const agency = fields.Agency[0]
        if (!fields.Chapter) continue;
        const chapter = fields.Chapter[0]
        const clause = fields["Regulatory Requirement"][0]
        const code = fields["Codes and Standards"][0]
        const clauseNumber = fields["Clause Number"] ? fields["Clause Number"][0] : ""

        let agencyObject = gateway.find(obj => obj.Agency == agency)
        if (!agencyObject) {
            agencyObject = { Agency: agency, Requirement: [{ Code: code, Chapter: chapter, ClauseNumber: clauseNumber, Clause: [clause] }] }
            gateway.push(agencyObject)
            continue;
        }

        let reqObject = agencyObject.Requirement.find(obj => obj.Chapter === chapter)
        if (reqObject && !reqObject.Clause.includes(clause)) {
            reqObject.Clause.push(clause)
        }

    }


    let revit = [],
        archicad = [],
        tekla = [],
        bentley = []
    for (const { fields } of entity) {
        const rule_ics = fields["Identified Components"]
        const match = rule_ics.some(x => regex.test(x))

        if (!match) continue;
        revit = [...revit, ...fields["Revit Representation"].split(',').map(x => x.trim())]
        archicad = [...archicad, ...fields["Archicad Representation"].split(',').map(x => x.trim())]
        tekla = [...tekla, ...fields["Tekla Representation"].split(',').map(x => x.trim())]
        bentley = [...bentley, ...fields["Bentley Representation"].split(',').map(x => x.trim())]

    }

    item.representation = {
        Revit: [...new Set(revit)],
        ArchiCAD: [...new Set(archicad)],
        Tekla: [...new Set(tekla)],
        Bentley: [...new Set(bentley)]
    }

    item.gateway = gateway
    item.SubTypeKeys = SubTypeKeys
}

const t2 = performance.now()
const elapsed = t2 - t1
console.log(elapsed.toFixed(2), 'ms');



console.log(arr.length);
fs.writeFileSync(`./output/mg_comp.json`, JSON.stringify(arr, null, 2))
