import { json } from '@sveltejs/kit';
import { authCheck } from '$fn/helper'


export async function GET({ locals: { supabase, getSession }, url }) {

    const params = url.searchParams.get('ic')
    const ic = params.split(',')
    const isBeta = url.searchParams.get('beta')
    const { data, error } = await supabase.from('ifcsg')
        .select()
        .in("identifiedComponent", ic)


    if (error) {
        return json(error)
    }


    return json(data)
}
