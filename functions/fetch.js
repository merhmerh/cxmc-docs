const { google } = require('googleapis')
const fs = require('fs')
require('dotenv').config();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY


async function main() {
    const sheets = google.sheets('v4');
    const SPREADSHEET_ID = '14_9NvXR8FbBpSI6w6s3lCjtmY_9bGG4dw4Tdzn4kPfc';

    // `Overview!B3:F12`,
    const rows = await sheets.spreadsheets.values.get({
        auth: GOOGLE_API_KEY,
        spreadsheetId: SPREADSHEET_ID,
        range: 'Overview!B3:F12',
        majorDimension: "COLUMNS"
    }).then(res => {
        return res.data.values
    })

    const data = []

    for (const arr of rows) {
        const props = []
        arr.slice(2).forEach(propString => {
            if (!propString.trim()) {
                return
            }

            const regex = /(.+?)\s?\[(.+?)\]/
            let [PropertyName, DataType] = propString.match(regex)?.slice(1) || []

            if (DataType == 'Text') {
                DataType = 'Label'
            }

            props.push({ PropertyName, DataType })

        })

        data.push({
            SubType: arr[0],
            PropertySet: arr[1],
            Properties: props
        })
    }



    fs.writeFileSync('./test.json', JSON.stringify(data, null, 2))
}


main()
