export async function load({ locals: { supabase, getSession } }) {
    const { data, error } = await supabase
        .from("areaRequirement")
        .select()
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    return {
        pageContent: data.data.pageContent,
        areaScheme: data.data.areaScheme,
        schema: data.data.Schema,
    };
}
