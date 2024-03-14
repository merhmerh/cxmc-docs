import { json } from '@sveltejs/kit';

export async function GET({ url, locals: { supabase } }) {
    // const body = await request.json()
    const email = url.searchParams.get('email')
    const info = url.searchParams.get('info')



    const { data: { users } } = await supabase.auth.admin.listUsers()
    if (users.find(user => user.email == email)) {
        return json({ error: { code: 400, message: 'Account have already been registered' } })
    }


    const { data: exist } = await supabase
        .from('requestAccess')
        .select('email')
        .eq('email', email)

    if (exist.length) {
        return json({ error: { code: 400, message: 'Request have already been made' } })
    }

    const { data, error } = await supabase
        .from('requestAccess')
        .insert({ email: email, info: info || null })
        .select()

    if (error) {
        return json({ error: { code: error.code, message: error.message } })
    }

    return json(data)
}