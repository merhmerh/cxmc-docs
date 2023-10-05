export async function load({ locals: { supabase } }) {

    const { data, error } = await supabase
        .from('modellingGuide')
        .select()
        .order('title')

    return ({ modellingGuide: data });

}