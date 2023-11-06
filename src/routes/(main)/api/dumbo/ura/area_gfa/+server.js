import { json } from "@sveltejs/kit";

export async function GET({ url, locals: { supabase } }) {

    const { data, error } = await supabase.from("areaRequirement")
        .select()
        .single();

    const props = data.data.areaScheme.filter((x) => x.scheme.match(/^AGF_/));

    const result = [];
    for (const item of props) {
        const ifcPropertyName = item.scheme;
        const propertyName = item.scheme.replace("AGF_", "");
        const enums = item.data
            .filter(x => !x.match(/^\*/))
            .filter(x => !x.match(/\{\{.+?\}\}/))
            .map(x => x.trim());

        result.push({
            ifcPropertyName,
            propertyName,
            enums
        })
    }

    const ifcPropertyName = url.searchParams.get("ifcPropertyName");
    if (ifcPropertyName) {
        return json(result.find(x => x.ifcPropertyName == ifcPropertyName))
    }


    return json(result);
}
