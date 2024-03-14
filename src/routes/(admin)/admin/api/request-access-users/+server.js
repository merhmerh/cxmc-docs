import { json } from '@sveltejs/kit';
import { authCheck } from '$fn/helper'


export async function GET({ locals: { supabase, getSession } }) {
    const session = await getSession()
    const isValidUser = await authCheck(supabase, session, '!reader,editor')
    if (!isValidUser) {
        return json({ error: { code: 400, message: "You do not have permission" } })
    }



    const { data, error } = await supabase
        .from('requestAccess')
        .select()

    if (error) {
        return json({ error: { code: error.code, message: error.message } })
    }

    return json(data)
}