import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { customAlphabet } from 'nanoid'
import crypto from 'crypto'
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SECRET = process.env.SUPABASE_SECRET

export const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET)


const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const uuid = customAlphabet(alphabet, 20);

export function getJsonSize(jsonString) {
    const sizeInBytes = new TextEncoder().encode(jsonString).length;
    const sizeInMB = sizeInBytes / (1024 * 1024)
    return `${parseFloat(sizeInMB).toFixed(2)}MB`
}


export function sortObject(obj) {
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

export function calcChecksum(data, alg = "sha256") {
    const sha256 = crypto.createHash(alg);
    sha256.update(data);
    const checksum = sha256.digest('hex');
    return checksum
}