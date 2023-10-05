// import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'

// import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
// export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
import { customAlphabet } from 'nanoid'


export function timeout(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const uuid = customAlphabet(alphabet, 20);

export function capitalizeFirstCharacter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isValidEmail(email) {
    const pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    return pattern.test(email);
}

export function debounce(func, delay) {
    let timeoutId;
    if (!delay) {
        delay = 300
    }

    return function (...args) {
        const context = this;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

export function formatTimeHMS(sec) {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;

    return { hours, minutes, seconds }
}

export async function authCheck(supabase, session, roles) {
    const { data } = await supabase.auth.admin.getUserById(session.user.id)
    if (data.user.user_metadata.disabled) {
        console.log('disabled');
        throw error('403', "Your account have been disabled")
    }

    const userRole = data.user.user_metadata.role || ""

    if (!userRole) {
        return false
    }

    const allRoles = ['reader', 'editor', 'manager', 'admin', 'owner']

    let allowedRoles = []
    if (roles.charAt(0) == "!") {
        const notAllowed = roles.replace('!', "").split(',')
        allowedRoles = allRoles
        allowedRoles = allowedRoles.filter(item => !notAllowed.includes(item))
    } else {
        allowedRoles = roles.split(',')
    }

    if (allowedRoles.includes(userRole)) {
        return true
    } else {
        return false
    }

}

