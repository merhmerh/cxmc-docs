const fs = require('fs')
require('dotenv').config();

const comp_id = process.env.AIRTABLE_TABLE_ID_COMP
const pset_id = process.env.AIRTABLE_TABLE_ID_PSET
const baseID = process.env.AIRTABLE_BASEID
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN

async function get() {
    const resp = await fetch(`${baseID}/${comp_id}`, {
        headers: {
            "Authorization": `Bearer ${AIRTABLE_TOKEN}`
        }
    })

    const res = await resp.json()

    console.log(res);
    fs.writeFileSync('test.json', JSON.stringify(res, null, 2))
}

get()