import { redirect, error } from "@sveltejs/kit";

export async function load({ locals: { supabase, getSession }, url }) {
    const session = await getSession();
    if (!session) {
        throw redirect(307, `/login`);
    }
    const id = session.user.id;

    const { data } = await supabase.auth.admin.getUserById(id);
    if (data.user.user_metadata.disabled) {
        console.log("disabled");
        throw error(403, "Your account have been disabled");
    }
}
