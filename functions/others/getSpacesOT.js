import readXlsxFile from 'read-excel-file/node'
import fs from 'fs'
const path = './resources/spaces.xlsx'

export async function parseSpaceAndOccupancyType() {
    const ot = await readXlsxFile(path, { sheet: "OccupancyType" })

    const otData = []
    for (const [index, row] of ot.entries()) {
        if (index == 0) continue;

        otData.push({
            occupancyType: row[0],
            ref: row[1],
            pg: row[2],
            pg_def: row[3],
            pg_type: row[4],
            bca_acc_code: row[5],
            bca_acc_def: row[6],
            pub: row[8],
            nea: row[9],
        })

    }

    fs.writeFileSync('./../src/routes/(main)/occupancy-type/occupancyType.json', JSON.stringify(otData, null, 2))
    console.log('--Written occupancyType.json');

    const spaceNameData = []
    const spaceName = await readXlsxFile(path, { sheet: "SpaceName" })

    for (const [index, row] of spaceName.entries()) {
        if (index == 0) continue;


        spaceNameData.push({
            category: row[0],
            spaceName: row[1],
            occupancyType: row[2],
            remarks: row[4],
            functionalSpace: row[5],
            occupancyLoad: row[6],
            SCDF_remarks: row[8],
            BCA_notForPublic: row[9]
        })

    }

    fs.writeFileSync('./../src/routes/(main)/spacename/spaceName.json', JSON.stringify(spaceNameData, null, 2))
    console.log('--Written spaceName.json');
    return { ot: otData, spaceName: spaceNameData }
}