import { json } from '@sveltejs/kit';
export async function GET({ fetch, url, locals: { supabase } }) {
    const q = url.searchParams.get('url')

    const resp = await fetch(q)
    const data = await resp.json()
    if (data.error) {
        return json(false)
    }
    return json(data)
}