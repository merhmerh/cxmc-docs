const { createClient } = require('@supabase/supabase-js')

require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SECRET = process.env.SUPABASE_SECRET

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET)

main()

async function main() {
    const file = JSON.stringify({ data: "hello" })
    const { data, error } = await supabase.storage.from('public').upload('downloads/test.json', file)
    if (error) {
        console.log(error);
    } else {
        console.log('uploaded');
    }
}