import writeXlsxFile from "write-excel-file/node";
// import fs from 'fs'
import { supabase } from "./helper.js";
import { parseSpaceAndOccupancyType } from "../others/getSpacesOT.js";

export async function generatePickListXML() {

    const agfName_data = await (async () => {
        const { data } = await supabase.from('areaRequirement').select().single()
        const agfNameData = data.data.AGFName

        const categories = {}
        for (const item of agfNameData) {
            const name = item[0]
            const category = item[2]


            if (category.match(/^\!/)) continue;
            if (!name) continue;

            if (!categories[category]) {
                categories[category] = []
            }

            if (categories[category].includes(name)) continue;
            categories[category].push(name)
        }


        const sortedKeys = Object.keys(categories).sort();

        const sortedObject = {};
        for (const key of sortedKeys) {
            sortedObject[key] = categories[key];
        }

        const rowData = []
        for (const [category, names] of Object.entries(sortedObject)) {
            const categoryRow = [
                { type: String, value: category },
                { type: String, value: "" },
                { type: Number, value: 2 },
                { type: String, value: "-2000160" }
            ]

            const rows = names.map(x => {
                return [
                    { type: String, value: x },
                    { type: String, value: "" },
                    { type: Number, value: 3 },
                    { type: String, value: "-2000160" }
                ]
            })

            const data = [categoryRow, ...rows]
            rowData.push(...data)
        }

        return rowData
    })()
    const sheet_afgName_data = createSheetData("AGF_Name", "preset AGF_Name of a space", agfName_data)


    const { ot: occupancyTypeArray, spaceName: spaceNameArr } = await parseSpaceAndOccupancyType()

    const spaceNameData = (() => {
        const categories = {}
        for (const item of spaceNameArr) {
            if (item.spaceName == 'any') continue
            if (!categories[item.category]) {
                categories[item.category] = []
            }

            if (categories[item.category].includes(item.spaceName)) continue;
            categories[item.category].push(item.spaceName)
        }

        const sortedKeys = Object.keys(categories).sort();

        const sortedObject = {};
        for (const key of sortedKeys) {
            sortedObject[key] = categories[key];
        }

        const rowData = []
        for (const [category, spaceNames] of Object.entries(sortedObject)) {
            const categoryRow = [
                { type: String, value: category },
                { type: String, value: "" },
                { type: Number, value: 2 },
                { type: String, value: "-2000160" }
            ]

            const rows = spaceNames.map(x => {
                return [
                    { type: String, value: x },
                    { type: String, value: "" },
                    { type: Number, value: 3 },
                    { type: String, value: "-2000160" }
                ]
            })

            const data = [categoryRow, ...rows]
            rowData.push(...data)
        }

        return rowData
    })()

    const sheet_SpaceName_data = createSheetData("SpaceName", "preset spacename of a space", spaceNameData)

    const occupancyType = occupancyTypeArray.map(x => (x.occupancyType.trim()))
    const occupancyTypeData = occupancyType.map(x => {
        const rowData = [{ type: String, value: x },
        { type: String, value: "" },
        { type: Number, value: 2 },
        { type: String, value: "-2000160" }]
        return rowData
    })

    const sheet_OccupancyType_data = createSheetData("OccupancyType", "preset occupancy type of a space", occupancyTypeData)


    await writeXlsxFile([sheet_OccupancyType_data, sheet_SpaceName_data, sheet_afgName_data], {
        sheets: ['OccupancyType', 'SpaceName', 'AGF_NAME'],
        filePath: './src/revit/Revit_BIT-PickList.xlsx'
    })
}

function createSheetData(title, description, rowData) {
    const sheetInfo = createSheetInfo(title, description)
    return [
        ...sheetInfo,
        [{ value: "NUMBER" }, { value: "DESCRIPTION" }, { value: "LEVEL" }, { value: "REVIT CATEGORY" }],
        ...rowData
    ]

    function createSheetInfo(title, description) {
        const d = {
            TITLE: title,
            DESCRIPTION: description,
            VERSION: "0.0.1",
            FUNCTION: "SPACE",
            ["NUMBER PARAMETER"]: title,
            ["DESCRIPTION PARAMETER"]: ""
        }
        const result = []
        for (const [key, value] of Object.entries(d)) {
            result.push([{ type: String, value: key }, { type: String, value: value }])
        }
        return result
    }
}