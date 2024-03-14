import { writable } from 'svelte/store';

export const isMobile = writable(0)

export function initDevice() {
    window.addEventListener('resize', checkDevice)
    checkDevice()
}

export function checkDevice(e) {

    isMobile.set(/Mobi|Android/i.test(navigator.userAgent))
    if (innerWidth < 600) {
        isMobile.set(true)
    }
}

