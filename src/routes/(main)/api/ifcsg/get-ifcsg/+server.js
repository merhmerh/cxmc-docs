import { json } from "@sveltejs/kit";

export async function GET({ locals: { supabase } }) {
    const { data, error } = await supabase.from("ifcsg").select();

    if (error) {
        return json(error);
    }

    return json(data);
}
