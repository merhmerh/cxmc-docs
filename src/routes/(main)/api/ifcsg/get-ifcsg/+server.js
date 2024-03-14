import { json } from "@sveltejs/kit";

export async function GET({ locals: { supabase } }) {
    const { data, error } = await supabase.from("ifcsg").select();

    if (error) {
        return json(error);
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            // Set CORS headers
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        },
    });
}
