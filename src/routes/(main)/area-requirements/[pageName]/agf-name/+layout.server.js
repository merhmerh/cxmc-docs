export async function load({ locals: { supabase } }) {

    const { data, error } = await supabase
        .from('areaRequirement')
        .select()
        .order('created_at', { ascending: false })
        .limit(1)
        .single()


    let pageContent = data.data.pageContent.find(x => x.path == 'AGF_NAME')



    const areaNames = data.data.AGFName.filter(x => !x[2].match(/^\!/))

    return ({ areaNames, pageContent })
}