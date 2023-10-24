const { google } = require('googleapis')

require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

const sheets = google.sheets({
    version: 'v4',
    auth: GOOGLE_API_KEY, // Replace with your authentication object
});


const content_id = '1Ew0ImhU3wUuHCaatyD9FN7oLf6vlDCBViC2NakuzyfE'
const areaScheme_id = '14_9NvXR8FbBpSI6w6s3lCjtmY_9bGG4dw4Tdzn4kPfc';


async function main() {

    const [pageContent, areaScheme, AGFName] = await Promise.all([
        getPageContent(),
        getAreaScheme(),
        getAGF_Name()
    ]);

    return { pageContent, areaScheme, AGFName };
}

module.exports = main

async function getPageContent() {
    const sheetNames = await listSheets(content_id)

    const result = []
    for (const sheetName of sheetNames) {
        const data = await getSheetContent(sheetName)
        result.push({
            path: sheetName,
            content: data
        })
    }

    return result
    // fs.writeFileSync(`./output/sheet.json`, JSON.stringify(result, null, 2))
    // fs.writeFileSync('./../src/routes/(main)/area-requirements/[pageName]/page_content.json', JSON.stringify(result, null, 2))
}

async function getAreaScheme() {
    const sheetNames = await listSheets(areaScheme_id)

    const area_sheets = []
    sheetNames.map(name => {
        const regex = new RegExp(/(^A[A-Z]{2}_.+)/)
        const match = name.match(regex)
        if (match) {
            area_sheets.push(match[1])
        }
    })

    const promises = []
    for (const sheetName of area_sheets) {

        promises.push(getAreaSheetContent(sheetName))
    }

    const result = []
    const data = await Promise.all(promises)
    for (const item of data) {
        result.push(item)
    }


    return result
    // fs.writeFileSync(`./output/area.json`, JSON.stringify(result, null, 2))
    // fs.writeFileSync('./../src/routes/(main)/area-requirements/[pageName]/table_content.json', JSON.stringify(result, null, 2))


}


async function getAGF_Name() {
    const totalRows = await sheets.spreadsheets.values.get({
        spreadsheetId: areaScheme_id,
        range: `AGF_Name!A1:B1000`,
    }).then(res => {
        return res.data.values.length
    })

    const result = await sheets.spreadsheets.values.get({
        spreadsheetId: areaScheme_id,
        range: `AGF_Name!A2:G${totalRows}`,
    }).then(res => {
        return res.data.values
    })

    return result
    // fs.writeFileSync('./../src/routes/(main)/area-requirements/[pageName]/agf-name/areaNames.json', JSON.stringify(result, null, 2))
}

// ------------------------------- //

async function getAreaSheetContent(sheetName) {

    if (sheetName == 'AGF_Name') {
        return { scheme: sheetName.trim(), data: [] }
    }

    const rows = await sheets.spreadsheets.values.get({
        spreadsheetId: areaScheme_id,
        range: `${sheetName}!A2:A`,
    }).then(res => {
        return res.data.values
    })

    return { scheme: sheetName.trim(), data: rows.flat() }
}


async function listSheets(spreadsheetId) {
    const sheetsName = []
    try {
        const response = await sheets.spreadsheets.get({
            spreadsheetId,
        });

        const sheetsList = response.data.sheets;

        if (sheetsList.length > 0) {
            sheetsList.forEach((sheet) => {
                sheetsName.push(sheet.properties.title)
            });
        }
    } catch (err) {
        console.error('Error listing sheets:', err);
    }
    return sheetsName
}

async function getSheetContent(sheetName) {
    const rows = await sheets.spreadsheets.values.get({
        spreadsheetId: content_id,
        range: `${sheetName}!A2:B`,
    }).then(res => {
        return res.data.values
    })

    const main_content = []
    for (let [content, type] of rows) {
        if (type == 'ref' || !type) {
            continue;
        } else if (type == 'images') {
            const urls = content.split(',').map(x => x.trim())

            const permLink = []
            urls.map(url => {
                const isGdrive = new RegExp(/^https:\/\/drive.google.com\/open\?id=/)
                if (isGdrive.exec(url)) {
                    const regex = /\?id=(.+?)&/
                    const id = url.match(regex) ? url.match(regex)[1] : ""
                    permLink.push(`https://drive.google.com/uc?export=view&id=${id}`)
                } else {
                    permLink.push(url)
                }
            })

            content = permLink
        }

        main_content.push({
            type,
            content
        })
    }
    return main_content
}


