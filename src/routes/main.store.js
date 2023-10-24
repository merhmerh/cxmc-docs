import { writable } from 'svelte/store';
import { browser } from "$app/environment"

export const beta = writable(false);
let init = false;

beta.subscribe(x => {
    if (browser) {
        if (!init) {
            x = localStorage.getItem('beta') == 'true' ? true : false
            init = true
            beta.set(x)
            return
        }
        localStorage.setItem('beta', x)
    }
})
