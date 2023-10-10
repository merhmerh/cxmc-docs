const fs = require('fs')
require('dotenv').config();

const baseID = process.env.AIRTABLE_BASEID
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN

const comp_id = process.env.AIRTABLE_TABLE_ID_COMP
const pset_id = process.env.AIRTABLE_TABLE_ID_PSET
const rule_id = process.env.AIRTABLE_TABLE_ID_RULE
const entity_id = process.env.AIRTABLE_TABLE_ID_ENTITIES

async function getData(tableId, fileName) {
    const t1 = performance.now()
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


    fs.writeFileSync(`./output/${fileName}.json`, JSON.stringify(data, null, 2))
    const t2 = performance.now()
    console.log('Completed:', fileName, `${(t2 - t1).toFixed(2)}ms`);
    return data; // Return the accumulated data after the recursion is complete
}

async function main() {
    console.log('start');
    await Promise.all([
        await getData(pset_id, "pset_id"),
        await getData(comp_id, "comp_id"),
        await getData(rule_id, "rule_id"),
        await getData(entity_id, "entity_id"),
    ])
    console.log('end');
}

main()
