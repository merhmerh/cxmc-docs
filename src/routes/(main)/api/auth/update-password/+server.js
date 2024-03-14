import { json } from '@sveltejs/kit';
import { authCheck } from '$fn/helper'
export async function PUT({ request, locals: { supabase, getSession } }) {
    const session = await getSession()
    if (!session) {
        return json({})
    }

    const body = await request.json()
    const newPassword = body.password
    if (newPassword.length < 12) {
        return json({ error: { code: 400, message: "Password must be at least 12 characters long." } })
    }


    const { data, error } = await supabase.auth.admin.updateUserById(
        session.user.id,
        { password: newPassword }
    )
    console.log(data);
    if (error) {
        return json({ error: { code: error.code, message: error.message } })
    }

    return json(data.user)
}