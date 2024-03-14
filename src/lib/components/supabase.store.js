import { get, writable } from 'svelte/store';
export const supabase = writable(0);

export const session = writable(0);

export function getPermission() {
    const s = get(session)
    if (!s) return { role: "", permission: {} }
    const role = s.user.user_metadata?.role || "beta"

    const result = { role: role, permission: {} }

    if (role == 'beta') {
        result.permission = {
            readAll: false
        }
    }

    if (role == 'owner' || role == 'admin') {
        result.permission.readAll = true
        result.permission.edit = true
        result.permission.manageOwnUsers = true
        result.permission.manageAllUsers = true
    }

    return result
}
