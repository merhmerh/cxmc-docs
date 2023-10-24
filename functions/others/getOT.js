const readXlsxFile = require('read-excel-file/node')

const path = '../spaces.xlsx'


const results = []



async function main() {

    const rows = await readXlsxFile(path, { sheet: "OccupancyType (unmerge)" })

    for (const [index, row] of rows.entries()) {
        results.push({
            occupancyType: row[1],
            ref: row[2],
            pg: row[3]

        })

    }

    console.log(results);
}

main()
console.log('end');