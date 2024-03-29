import { json } from '@sveltejs/kit';
import { authCheck } from '$fn/helper'


export async function POST({ request, locals: { supabase, getSession } }) {
    const session = await getSession()
    const isValidUser = await authCheck(supabase, session, '!reader,editor')
    if (!isValidUser) {
        return json({ error: { code: 400, message: "You do not have permission" } })
    }



    const body = await request.json()

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(body.email)

    if (error) {
        return json({ error: { code: error.code, message: error.message } })
    }

    const createdUser = data.user

    const { data: user, error: updateError } = await supabase.auth.admin.updateUserById(createdUser.id,
        { user_metadata: { referral: body.referral } }
    )

    if (updateError) {
        return json({ error: { code: updateError.code, message: updateError.message } })
    }


    return json(user.user)
}