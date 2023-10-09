import { json } from '@sveltejs/kit';
import { authCheck } from '$fn/helper'


export async function GET({ locals: { supabase, getSession }, url }) {

    // const session = await getSession()
    // const isValidUser = await authCheck(supabase, session, '!reader')
    // if (!isValidUser) {
    //     return json({ error: { code: 400, message: "You do not have permission" } })
    // }

    const params = url.searchParams.get('ic')
    const ic = params.split(',')
    const { data, error } = await supabase.from('ifcsg')
        .select()
        .in("identifiedComponent", ic)

    if (error) {
        return json(error)
    }
    return json(data)
}
