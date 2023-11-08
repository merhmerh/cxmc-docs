import fs from 'fs'
const comp = JSON.parse(fs.readFileSync('./output/comp_id.json', 'utf-8'))
const rule = JSON.parse(fs.readFileSync('./output/rule_id.json', 'utf-8'))
const entity = JSON.parse(fs.readFileSync('./output/entity_id.json', 'utf-8'))

export async function mergeData() {
    const ics = []
    for (const item of comp) {
        const field = item.fields
        if (field.Status && field.Status.match(/not\sused|removed/i)) {
            continue;
        }
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

            if (fields["Status"] !== 'Finalised') {
                continue;
            }


            const rule_ics = fields["Identified Components"].split(';').map(c => c.trim())
            const match = rule_ics.some(x => regex.test(x))
            if (!match) continue;



            const agency = fields.Agency[0]
            if (!fields.Chapter) continue;
            const chapter = fields.Chapter[0]
            const clause = fields["Regulatory Requirement"][0]
            const code = fields["Codes and Standards"][0]
            const clauseNumber = fields["Clause Number"] ? fields["Clause Number"][0] : ""

            // console.log(code, clauseNumber);


            let agencyObject = gateway.find(obj => obj.Agency == agency)

            // console.log(fields["Gateway"].join().split(','));
            const req = {
                Code: code,
                Chapter: chapter,
                ClauseNumber: clauseNumber,
                Clause: [clause],
                Gateway: fields["Gateway"].join().split(',')
            }

            if (!agencyObject) {
                agencyObject = { Agency: agency, Requirement: [req] }
                gateway.push(agencyObject)
                continue;
            }


            let reqObject = agencyObject.Requirement.find(obj => obj.Chapter === chapter)
            if (reqObject && !reqObject.Clause.includes(clause)) {
                reqObject.Clause.push(clause)
            }

            if (!agencyObject.Requirement.find(x => x.ClauseNumber == clauseNumber)) {
                agencyObject.Requirement.push(req)
            }
        }



        const g = []
        if (gateway.length) {
            for (const agency of gateway) {
                const input = agency.Requirement
                const output = [];

                input.forEach((item) => {
                    // Check if a chapter with the same name already exists in the output
                    const existingChapter = output.find((chapter) => chapter.chapterName === item.Chapter);

                    //find gateway type
                    const clauseNumber = item.ClauseNumber
                    const clauses = item.Clause
                    const gateway = item.Gateway

                    const data = {
                        clauseNumber,
                        clauses,
                    }

                    if (existingChapter) {
                        // Chapter already exists, add the clause to the existing chapter
                        existingChapter.clauseNumbers.push(data);
                    } else {
                        // Chapter does not exist, create a new chapter and add it to the output
                        const newChapter = {
                            chapterName: item.Chapter,
                            gateway,
                            clauseNumbers: [data],
                        };
                        // Add the new chapter to the output array
                        output.push(newChapter);
                    }
                });

                const sorted = output.sort((a, b) => b.clauseNumber = a.clauseNumber)

                // Create the final output object with code and chapters
                const finalOutput = {
                    code: input[0].Code, // Assuming all items have the same code
                    agency: agency.Agency,
                    chapters: sorted,
                };

                g.push(finalOutput)
            }
            // fs.writeFileSync('./output/test.json', JSON.stringify(g, null, 2))
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

        item.gateway = g
        item.SubTypeKeys = SubTypeKeys

    }

    fs.writeFileSync('./output/mg_comp.json', JSON.stringify(arr, null, 2))
    fs.writeFileSync('./../src/routes/(main)/identified-component/mg_comp.json', JSON.stringify(arr, null, 2))
    console.log('--Written mg_comp.json');

    const rules = []
    for (const { fields: f } of rule) {
        if (f['Status'] == 'Finalised') {
            const ic = f['Identified Components'].split(/\n/g).map(x => {
                return x.trim().replace(/;/g, "")
            })
            rules.push({
                agency: f["Agency"].join(),
                code: f["Codes and Standards"].join(),
                chapter: f["Chapter"].join(),
                clauseNumber: f["Clause Number"] ? f["Clause Number"].join() : null,
                clause: f["Regulatory Requirement"].join(),
                ruleGroup: f["Rule Group (Batch 1)"].join(),
                gateway: f['Gateway'].join().split(','),
                identifiedComponents: ic,
            })
        }
    }

    fs.writeFileSync('./output/rules.json', JSON.stringify(rules, null, 2))
    fs.writeFileSync('./../src/routes/(main)/api/ifcsg/get-code/rules.json', JSON.stringify(rules, null, 2))
    console.log('--Written rules.json');
}

