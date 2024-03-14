import { redirect, error } from '@sveltejs/kit'

export async function load({ locals, url }) {
    const session = await locals.getSession()
    const supabase = await locals.supabase
    if (session) {

        const id = session.user.id
        const { data } = await supabase.auth.admin.getUserById(id)
        if (data.user.user_metadata.disabled) {
            console.log('disabled');
            throw error(403, "Your account have been disabled")
        }

        const role = data.user.user_metadata.role
        const allowedRoles = ['manager', 'admin', 'owner']
        if (!allowedRoles.includes(role)) {
            throw error(403, "Sorry, you do not have permission to access this page.");
        }
        return ({ session })
    } else {
        throw redirect(307, `/login?redirect=${url.pathname.replace('/', '')}`)
    }
}