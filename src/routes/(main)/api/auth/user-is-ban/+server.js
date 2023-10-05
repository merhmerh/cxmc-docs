import { json } from '@sveltejs/kit';

export async function GET({ url, locals: { supabase } }) {
    // const body = await request.json()
    const email = url.searchParams.get('email')
    if (!email) {
        return json({ error: { code: 400, message: 'Email required' } })
    }
    // const { data, error } = await supabase.auth.admin.getUserById('15b28acf-3af5-47ed-9d32-42d5677603cd')
    // console.log(data.user);
    // return json(data.user)
    return json({})
}