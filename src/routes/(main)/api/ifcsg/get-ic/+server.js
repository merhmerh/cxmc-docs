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


        const entities = [... new Set(data.map(item => item.entity))]

        let result = data
        for (const entity of entities) {

            const { data: propData } = await supabase.from('property').select().eq("Entity", entity)

            for (const p of propData) {
                for (const item of result) {
                    if (item.key == p.ParentKey) {
                        const index = item.pset[p.PropertySet].findIndex(x => x.propertyName == p.PropertyName)
                        const d = item.pset[p.PropertySet][index]
                        item.pset[p.PropertySet][index] = { ...d, ...p }
                    }
                }
            }
        }


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
