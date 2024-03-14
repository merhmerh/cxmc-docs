import { redirect } from '@sveltejs/kit'

export async function load({ locals, url }) {
    const session = await locals.getSession()
    if (!session) {
        throw redirect(307, `/login?redirect=${url.pathname.replace('/', '')}`)
    }

    const supabase = locals.supabase

    const { data: { users }, error } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000
    })

    if (session.user.user_metadata.role == 'manager') {
        const filtered = users.filter(x => {
            if (x.user_metadata.referral == session.user.email) {
                return x
            }

            if (x.id == session.user.id) {
                return x
            }

        })
        console.log(filtered);
        return { users: filtered }
    }


    return { users }
}

