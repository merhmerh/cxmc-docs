const fs = require('fs')
require('dotenv').config();

const baseID = process.env.AIRTABLE_BASEID
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN

const comp_id = process.env.AIRTABLE_TABLE_ID_COMP
const pset_id = process.env.AIRTABLE_TABLE_ID_PSET
const rule_id = process.env.AIRTABLE_TABLE_ID_RULE
const entity_id = process.env.AIRTABLE_TABLE_ID_ENTITIES

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


    fs.writeFileSync(`./output/pset_id.json`, JSON.stringify(data, null, 2))
    return data; // Return the accumulated data after the recursion is complete
}

getData(pset_id)
