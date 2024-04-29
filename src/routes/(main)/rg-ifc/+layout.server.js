import { error } from '@sveltejs/kit'
import { authCheck } from '$fn/helper'

export async function load({ locals: { supabase, getSession } }) {

    const session = await getSession()
    const isValidUser = await authCheck(supabase, session, '!reader')
    console.log(isValidUser);
    if (!isValidUser) {
        error('403', "Sorry, you do not have permission to access this page.");

    }

}