import { get, writable } from 'svelte/store';
import { browser } from "$app/environment"
import { session } from '$comp/supabase.store'

export const beta = writable(false);

