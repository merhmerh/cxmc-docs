import { json } from '@sveltejs/kit';
import code_list from './rules.json'


export async function GET({ url }) {

    try {
        const query_data = url.searchParams.get('data')
        const q = JSON.parse(query_data)

        const result = code_list.find(x => {
            if (x.agency == q.agency &&
                x.code == q.code &&
                x.chapter == q.chapter &&
                x.clauseNumber == q.clauseNumber
            ) {
                return x
            }
        })

        return json(result)

    } catch (error) {
        return json({ error: { message: "Invalid query params", info: error } })
    }
}
