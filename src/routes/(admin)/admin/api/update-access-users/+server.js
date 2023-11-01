import { json } from '@sveltejs/kit';
import { authCheck } from '$fn/helper'


export async function PUT({ request, locals: { supabase, getSession } }) {
    const session = await getSession()
    const isValidUser = await authCheck(supabase, session, '!reader,editor')
    if (!isValidUser) {
        return json({ error: { code: 400, message: "You do not have permission" } })
    }

    const body = await request.json()

    if (body.type == 'delete') {
        const { data, error } = await supabase
            .from('requestAccess')
            .delete()
            .eq('email', body.email)
            .select()

        if (error) {
            console.log('e', error);
            return json({ error: { code: error.code, message: error.message } })
        }
        console.log(data);
        return json(data[0])
    }

    if (body.type == 'reject') {
        const { data, error } = await supabase
            .from('requestAccess')
            .update({ status: "rejected" })
            .eq('email', body.email)
            .select()

        if (error) {
            return json({ error: { code: error.code, message: error.message } })
        }

        return json(data[0])
    }

}