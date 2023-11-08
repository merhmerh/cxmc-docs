import { onRequest } from "firebase-functions/v2/https";
import * as functions from 'firebase-functions';
import { updateIfcSG } from "./src/airtable.js";
import { updateAreaReq } from './src/areaReq.js'
import { uuid, getJsonSize, sortObject } from "./src/helper.js";
import { generateRevitIfcMappingTable } from "./src/revitMapping.js";

const logger = functions.logger

const opts = {
    cors: ["cxmc-ifcsg.netlify.app/", "cx.builtsearch.com", "localhost:5173"],
    region: "asia-southeast1"
}


export const scheduleSyncAsia = functions.region('asia-southeast1')
    .pubsub.schedule("0 */4 * * *")
    .timeZone("Asia/Singapore").onRun(async (context) => {
        logger.log('--start schedule --')

        try {
            await updateIfcSG()
            logger.log('AreaSync success')
            await updateAreaReq()
            logger.log('IfcSync success')
        } catch (error) {
            logger.log(error)
        }

        console.log('--end schedule--');
    })

export const dataSync = onRequest(opts, async (req, res) => {
    logger.log('--start http invoke--')

    try {
        const result = await updateIfcSG()
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send(error)
    }

    logger.log('--end http invoke--')
})

export const areaSync = onRequest(opts, async (req, res) => {
    logger.log('--start http invoke--')

    try {
        const result = await updateAreaReq()
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send(error)
    }

    logger.log('--end http invoke--')
})

export const revitIfcMapping = onRequest(opts, async (req, res) => {
    // generateRevitIfcMappingTable().then(result => {
    //     res.status(200).send(result)
    // }).catch(err => {
    //     res.status(400).send(err)
    // })
})
