const functions = require('firebase-functions');
const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto');
const { google } = require('googleapis')
const getGFAData = require('../src/areaReq.js')



require('dotenv').config();

const comp_id = process.env.AIRTABLE_TABLE_ID_COMP
const pset_id = process.env.AIRTABLE_TABLE_ID_PSET
const baseID = process.env.AIRTABLE_BASEID
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY


const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SECRET = process.env.SUPABASE_SECRET

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET)


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

        const resp = await uploadToDB(checksum, result)
        await reset_IFCSG_Database(resp)


        //update area-req
        try {
            const result = await getGFAData()

            try {
                await supabase.from('areaRequirement')
                    .delete()
                    .neq('id', 0)
            } catch (error) {
                console.log(error);
            }

            const { data, error } = await supabase
                .from('areaRequirement')
                .insert({ data: result })
        } catch (error) {
            console.log(error);
        }

        console.log('--end schedule--');
    })


// --- http request ---  //

const opts = {
    cors: ["cxmc-ifcsg.netlify.app/", "cx.builtsearch.com", "localhost:5173"],
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

    const ifcsg = await reset_IFCSG_Database(resp)
    logger.log('--end http invoke--')
    res.status(200).send(ifcsg)
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

// exports.gfaSync = onRequest(opts, async (req, res) => {

//     const API_KEY = GOOGLE_API_KEY
//     const sheets = google.sheets('v4');
//     const SPREADSHEET_ID = '14_9NvXR8FbBpSI6w6s3lCjtmY_9bGG4dw4Tdzn4kPfc';

//     const sheetName = 'DC Spaces';
//     const rows = await sheets.spreadsheets.values.get({
//         auth: API_KEY,
//         spreadsheetId: SPREADSHEET_ID,
//         range: `${sheetName}!B1:B1000`,
//     }).then(res => {
//         return res.data.values.length
//     })

//     const sheetResult = await sheets.spreadsheets.values.get({
//         auth: API_KEY,
//         spreadsheetId: SPREADSHEET_ID,
//         range: `${sheetName}!A1:K${rows}`,
//     }).then(res => {
//         return res.data.values
//     });


//     const header = sheetResult[0].map(x => x)


//     const result = []
//     for (let i = 1; i < sheetResult.length; i++) {

//         const row = sheetResult[i]
//         const data = {}


//         for (const [index, key] of header.entries()) {
//             const invalid = ['#N/A']

//             let value = row[index] ? row[index].trim() : null
//             if (!value) { value = null }
//             if (invalid.includes(value)) {
//                 value = null
//             }

//             data[key] = value
//         }
//         result.push(data)
//     }

//     res.status(200).send(result)

// })



exports.areaSync = onRequest(opts, async (req, res) => {
    logger.log('--start http invoke--')

    const result = await getGFAData()

    try {
        await supabase.from('areaRequirement')
            .delete()
            .neq('id', 0)
    } catch (error) {
        res.status(400).send(error)
    }

    const { data, error } = await supabase
        .from('areaRequirement')
        .insert({ data: result })

    if (error) {
        res.status(400).send(error)
    }

    res.status(200).send(result)
    logger.log('--end http invoke--')
})




async function reset_IFCSG_Database(data) {
    const ifcsg = data[0].result.airtable

    const { data: properties, error: propError } = await supabase.from('property').select()

    const pset = sanitizePset(ifcsg.comp, ifcsg.pset);
    const rawIfcData = sanitizeAirtableComp(ifcsg.comp, pset);

    for (const [index, item] of rawIfcData.entries()) {
        const entity = item.entity;
        const matchingProps = properties.filter(
            (x) => x.Entity === entity && item.pset && item.pset[x.PropertySet],
        );

        if (matchingProps.length) {
            for (const prop of matchingProps) {
                const pset = item.pset[prop.PropertySet];
                const propIndex = pset.findIndex((row) => row.propertyName === prop.PropertyName);

                if (propIndex !== -1) {
                    rawIfcData[index].pset[prop.PropertySet][propIndex] = { ...pset[propIndex], ...prop };
                }
            }
        }
    }

    const result = rawIfcData

    try {
        await supabase.from('ifcsg')
            .delete()
            .neq('key', 0)
    } catch (error) {
        return error
    }

    const { data: ifcData, error: ifcsgError } = await supabase
        .from('ifcsg')
        .insert(result)

    if (ifcsgError) {
        return ifcsgError
    }

    return result
}

function sanitizePset(comp, pset) {
    const simplifiedPset = {};
    pset.forEach((row) => {
        const propsString = row.fields["Properties [Data Type]"];
        const allProps = [];
        if (propsString) {
            const arr = propsString.split(";");
            for (const value of arr) {
                const trimmed = value.trim().replace("\n", "");
                const propertyName = trimmed.replace(/(.*?)\[(.*?)\]/, "$1").trim();
                const measureResource = "";
                const dataType = trimmed.replace(/(.*?)\[(.*?)\]/, "$2").trim();
                allProps.push({ propertyName, dataType, measureResource });
            }
        }

        row.fields.props = allProps;

        const entities = row.fields["IFC4 Entities"] ?? [];

        entities.forEach((entity) => {
            if (!simplifiedPset[entity]) {
                simplifiedPset[entity] = {};
            }

            if (!simplifiedPset[entity][row.fields["Property Set"]]) {
                simplifiedPset[entity][row.fields["Property Set"]] = allProps;
            }
        });
    });

    const betaProps = []
    for (const item of comp) {
        const f = item.fields
        const betaPropString = f['Beta Properties [Data Type]']
        const props = [];
        if (betaPropString) {
            const arr = betaPropString.split(";");
            for (const value of arr) {
                const trimmed = value.trim().replace("\n", "");
                const propertyName = trimmed.replace(/(.*?)\[(.*?)\]/, "$1").trim();
                const dataType = trimmed.replace(/(.*?)\[(.*?)\]/, "$2").trim();
                props.push({ propertyName, dataType });
            }
        }

        let subtype = f["IFC4 Entity.Sub-Type"];

        if (Array.isArray(subtype)) {
            subtype = subtype[0];
        }

        if (props.length) {
            betaProps.push({ subtype, props })
        }
    }

    const clonedPset = JSON.parse(JSON.stringify(simplifiedPset))

    for (const { subtype, props: betaPropsArray } of betaProps) {
        const entity = subtype.split(/\./)[0]
        if (clonedPset[entity]) {
            let betaPropName = betaPropsArray.map(x => x.propertyName)

            for (const [pset, props] of Object.entries(clonedPset[entity])) {
                for (const [index, prop] of props.entries()) {
                    if (betaPropName.includes(prop.propertyName)) {
                        clonedPset[entity][pset][index].beta = true
                    }
                }
            }
        }
    }

    return clonedPset;
}

function sanitizeAirtableComp(obj, pset) {
    const ifc = {};
    for (const row of obj) {
        const item = row.fields;
        const entity = item["IFC4 Entities"][0];

        let subtype = item["IFC4 Entity.Sub-Type"];

        if (Array.isArray(subtype)) {
            subtype = subtype[0];
        }

        const predefinedType =
            subtype.charAt(subtype.length - 1) == "*"
                ? "USERDEFINED"
                : subtype.replace(entity, "").replace(/\./, "") || null;

        const objectType =
            subtype.charAt(subtype.length - 1) == "*" ? subtype.replace(entity, "").replace(/^\.(.*?)\*$/, "$1") : null;

        let componentName = subtype.replace(entity, "").replace(/\./g, "").replace(/\*/g, "");
        if (!predefinedType && !objectType) {
            componentName = entity.replace(/^ifc/i, "").toUpperCase()
            console.log(componentName);
        }

        const key = `${entity}:${predefinedType}:${objectType}`;

        const status = (() => {
            const v = item["Status"] || "required";
            const exclude = ["to be removed", "not used"];

            if (exclude.includes(v.toLowerCase())) {
                return false;
            } else {
                return true;
            }
        })();

        if (!status) {
            continue;
        }

        if (!ifc[key]) {
            ifc[key] = {
                identifiedComponent: item["Identified Component"],
                entity,
                predefinedType,
                objectType,
                pset: {},
                status: status,
                componentName,
                beta: item["Beta"] ? true : false
            };
        }

        const propsString = item["Properties [Data Type]"];

        const props = [];
        if (propsString) {
            const arr = propsString.split(";");
            for (const value of arr) {
                const trimmed = value.trim().replace("\n", "");
                const propertyName = trimmed.replace(/(.*?)\[(.*?)\]/, "$1").trim();
                const measureResource = "";
                const dataType = trimmed.replace(/(.*?)\[(.*?)\]/, "$2").trim();
                props.push({ propertyName, dataType, measureResource });
            }
        }

        if (ifc[key].props) {
            ifc[key].props.push(props);
        } else {
            ifc[key].props = props;
        }
    }

    const result = [];
    for (const [key, obj] of Object.entries(ifc)) {
        let propList = obj.props.map((x) => x.propertyName);
        const EntityPsets = pset[obj.entity];

        propList.forEach((prop) => {
            if (!EntityPsets) return;
            outerLoop: for (const [pset, list] of Object.entries(EntityPsets)) {
                for (const pset_prop of list) {
                    if (pset_prop.propertyName == prop) {
                        if (!obj.pset[pset]) {
                            obj.pset[pset] = [];
                        }
                        obj.pset[pset].push(pset_prop);

                        break outerLoop;
                    }
                }
            }
        });

        delete obj.props;
        if (!Object.entries(obj.pset).length) {
            delete obj.pset;
        }
        result.push({ ...obj, key: key });
    }

    result.sort((a, b) => {
        if (a.key < b.key) {
            return -1;
        }
        if (a.key > b.key) {
            return 1;
        }
        return 0;
    });

    return result;
}