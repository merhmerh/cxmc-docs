
export async function load({ params, locals: { supabase } }) {
    // console.log('slug:', params.slug);

    const { data: guides } = await supabase.from('modellingGuide').select()
    const guide = guides.filter(x => x.slug == params.slug)[0]

    if (!guide) {
        throw error(404, {
            message: 'Not found'
        });
    }
    // console.log(guide.id);

    const { data: url, error } = await supabase
        .storage
        .from('public')
        .getPublicUrl(`modellingGuide/${guide.id}/doc.json`)

    return ({ guide: guide, guideUrl: url.publicUrl })
}