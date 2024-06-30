import { writable } from "svelte/store";

export const isMobile = writable(0);

export function initDevice() {
    window.addEventListener("resize", checkDevice);
    checkDevice();
}

export function checkDevice(e) {
    console.log(innerWidth);
    if (innerWidth < 768) {
        return isMobile.set(true);
    }
    if (innerWidth >= 768) {
        return isMobile.set(false);
    }
    // isMobile.set(/Mobi|Android/i.test(navigator.userAgent));
}
