import { writable } from 'svelte/store';

export const isMobile = writable(0)

export function initDevice() {
    window.addEventListener('resize', checkDevice)
    checkDevice()
}

export function checkDevice() {
    isMobile.set(/Mobi|Android/i.test(navigator.userAgent))
}

