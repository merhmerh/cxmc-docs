import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { SUPABASE_SERVICE_KEY } from '$env/static/private'

import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'


export const handle = async ({ event, resolve }) => {
    event.locals.supabase = createSupabaseServerClient({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: SUPABASE_SERVICE_KEY,
        event,
    })

    // @ts-ignore
    event.locals.supabaseAuthServer =
        /**
         * a little helper that is written for convenience so that instead
         * of calling `const { data: { session } } = await supabase.auth.getSession()`
         * you just call this `await getSession()`
         */
        event.locals.getSession = async () => {
            const {
                data: { session },
            } = await event.locals.supabase.auth.getSession()
            return session
        }

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range'
        },
    })
}