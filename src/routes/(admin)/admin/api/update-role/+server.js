import { json } from '@sveltejs/kit';
import { authCheck } from '$fn/helper'


export async function PUT({ request, locals: { supabase, getSession } }) {
    const session = await getSession()
    const isValidUser = await authCheck(supabase, session, '!reader,editor')
    if (!isValidUser) {
        return json({ error: { code: 400, message: "You do not have permission" } })
    }


    const body = await request.json()

    // const allowedRoles = ['admin', 'owner']
    // const role = session.user.user_metadata.role
    // if (!allowedRoles.includes(role)) {
    //     return json({ error: { code: 403, message: "You do not have enough permission to update roles" } })
    // }

    const { data: user, error } = await supabase.auth.admin.updateUserById(body.user.id,
        { user_metadata: { role: body.newRole } }
    )

    if (error) {
        return json({ error: { code: error.code, message: error.message } })
    }

    return json(user.user)
}