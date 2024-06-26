import { redirect, error } from '@sveltejs/kit'

export async function load({ locals: { supabase, getSession }, url }) {
    const session = await getSession()
    if (!session) {
        redirect(307, `/login`);
    }
}