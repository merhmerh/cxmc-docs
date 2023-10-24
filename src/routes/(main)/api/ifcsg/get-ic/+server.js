import { json } from '@sveltejs/kit';
import { authCheck } from '$fn/helper'


export async function GET({ locals: { supabase, getSession }, url }) {

    const params_ic = url.searchParams.get('ic')
    const params_keys = url.searchParams.get('key')

    if (params_ic) {
        const ic = params_ic.split(',')
        const isBeta = url.searchParams.get('beta')
        const { data, error } = await supabase.from('ifcsg')
            .select()
            .in("identifiedComponent", ic)


        if (error) {
            return json(error)
        }


        return json(data)
    }

    if (params_keys) {
        const keys = params_keys.split(',')
        const { data, error } = await supabase.from('ifcsg')
            .select()
            .in("key", keys)
        if (error) {
            return json(error)
        }

        return json(data)
    }


    return json({ error: { message: "Invalid query params" } })
}
