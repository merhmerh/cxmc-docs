const functions = require('firebase-functions');
const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto');
const { google } = require('googleapis')

require('dotenv').config();

const comp_id = process.env.AIRTABLE_TABLE_ID_COMP
const pset_id = process.env.AIRTABLE_TABLE_ID_PSET
const baseID = process.env.AIRTABLE_BASEID
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY



// --- every 4 hour --- //
exports.scheduleSyncAsia = functions
    .region('asia-southeast1')
    .pubsub.schedule("0 */4 * * *")
    .timeZone("Asia/Singapore")
    .onRun(async (context) => {
        logger.log('--start schedule --')
        // const result = await getResult()

        const result = await getFromAirtable()

        const jsonString = JSON.stringify(result)
        logger.log('Result size from airtable:', getJsonSize(jsonString))

        const sha256 = crypto.createHash('sha256');
        const sorted = sortObject(JSON.parse(jsonString))
        sha256.update(JSON.stringify(sorted));
        const checksum = sha256.digest('hex');

        await uploadToDB(checksum, result)

        //do something with the result
        console.log('--end schedule--');
    })


// --- http request ---  //

const opts = {
    cors: ["cxmc-ifcsg.netlify.app/", "localhost:5173"],
    region: "asia-southeast1"
}

exports.dataSync = onRequest(opts, async (req, res) => {
    logger.log('--start http invoke--')

    const result = await getFromAirtable()

    const jsonString = JSON.stringify(result)
    logger.log('Result size from airtable:', getJsonSize(jsonString))

    const sha256 = crypto.createHash('sha256');
    const sorted = sortObject(JSON.parse(jsonString))
    sha256.update(JSON.stringify(sorted));
    const checksum = sha256.digest('hex');

    const resp = await uploadToDB(checksum, result)

    logger.log('--end http invoke--')
    res.status(200).send(resp)
})

async function getFromAirtable() {
    const comp = await getData(comp_id)
    const pset = await getData(pset_id)

    const data = {
        airtable: { comp, pset }
    }

    return data
}

async function getData(tableId) {
    const data = [];

    async function fetchPage(offset) {
        let query = ''

        if (offset) {
            query = `?offset=${offset}`
        }
        const resp = await fetch(`${baseID}/${tableId}${query}`, {
            headers: {
                "Authorization": `Bearer ${AIRTABLE_TOKEN}`
            }
        })

        const res = await resp.json()
        data.push(...res.records)
        const nextOffset = res.offset
        if (nextOffset) {
            await fetchPage(nextOffset)
        }
    }

    await fetchPage(); // Call the recursive function

    return data; // Return the accumulated data after the recursion is complete
}


async function uploadToDB(checksum, json) {
    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_SECRET = process.env.SUPABASE_SECRET

    const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET)

    //get latest data
    const { data: last, error: last_error } = await supabase
        .from('airtable')
        .select()
        .order('id', { ascending: false })
        .limit(1)

    if (last[0].checksum == checksum) {

        const { error: updateError } = await supabase
            .from('airtable')
            .update({ last_updated: new Date().toISOString() })
            .eq("id", last[0].id)

        logger.log(updateError)

        logger.log('Checksum is same, updated timestamp, retrieving latest data')
        return last
    }

    const { data, error } = await supabase
        .from('airtable')
        .insert({
            checksum: checksum,
            result: json
        })
        .select()

    if (error) {
        return (error)
    }

    return data
}

function getJsonSize(jsonString) {
    const sizeInBytes = new TextEncoder().encode(jsonString).length;
    const sizeInMB = sizeInBytes / (1024 * 1024)
    return `${parseFloat(sizeInMB).toFixed(2)}MB`
}

function sortObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(sortObject);
    }

    const sortedKeys = Object.keys(obj).sort();
    const sortedObject = {};

    sortedKeys.forEach(key => {
        sortedObject[key] = sortObject(obj[key]);
    });

    return sortedObject;
}

exports.gfaSync = onRequest(opts, async (req, res) => {

    const API_KEY = GOOGLE_API_KEY
    const sheets = google.sheets('v4');
    const SPREADSHEET_ID = '14_9NvXR8FbBpSI6w6s3lCjtmY_9bGG4dw4Tdzn4kPfc';

    const sheetName = 'DC Spaces';
    const rows = await sheets.spreadsheets.values.get({
        auth: API_KEY,
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!B1:B1000`,
    }).then(res => {
        return res.data.values.length
    })

    const sheetResult = await sheets.spreadsheets.values.get({
        auth: API_KEY,
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1:K${rows}`,
    }).then(res => {
        return res.data.values
    });


    const header = sheetResult[0].map(x => x)


    const result = []
    for (let i = 1; i < sheetResult.length; i++) {

        const row = sheetResult[i]
        const data = {}


        for (const [index, key] of header.entries()) {
            const invalid = ['#N/A']

            let value = row[index] ? row[index].trim() : null
            if (!value) { value = null }
            if (invalid.includes(value)) {
                value = null
            }

            data[key] = value
        }
        result.push(data)
    }

    res.status(200).send(result)

})