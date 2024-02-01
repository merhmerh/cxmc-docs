import { customAlphabet } from "nanoid";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);

/**
 * @param {number} ms
 */
export function timeout(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const uuid = customAlphabet(alphabet, 20);

/**
 * @param {string} str
 */
export function capitalizeFirstCharacter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @param {string | number | Date} dateString
 */
export function fromNow(dateString) {
    const date = new Date(dateString);
    // @ts-ignore
    if (isNaN(date)) {
        return "-";
    } else {
        return dayjs(date).fromNow();
    }
}

/**
 * @param {number} floatValue
 */
export function toMemoryUnit(floatValue) {
    const MB = 1024 * 1024;
    if (floatValue < MB) {
        return (floatValue / 1024).toFixed(2) + " KB";
    } else {
        return (floatValue / MB).toFixed(2) + " MB";
    }
}

/**
 * @param {string} email
 */
export function isValidEmail(email) {
    const pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    return pattern.test(email);
}

/**
 * @param {{ (msg: any, opts?: {}): string; (url: any): void; (url: any): void; (url: any): void; (url: any): void; apply?: any; }} func
 * @param {number} delay
 */
export function debounce(func, delay) {
    let timeoutId;
    if (!delay) {
        delay = 300;
    }

    return function (/** @type {any} */ ...args) {
        const context = this;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

/**
 * @param {Blob} file
 */
export function calculateChecksum(file, algorithm = "SHA-256") {
    return new Promise(async (resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target.result;
            try {
                // @ts-ignore
                const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
                const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
                resolve(hashHex);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsArrayBuffer(file);
    });
}

/**
 * @param {{ hasOwnProperty: (arg0: string) => any; }} obj
 */
export function isObjectEmpty(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

/**
 * @param {number} sec
 */
export function formatTimeHMS(sec) {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;

    return { hours, minutes, seconds };
}

/**
 * @param {{ auth: { admin: { getUserById: (arg0: any) => PromiseLike<{ data: any; }> | { data: any; }; }; }; }} supabase
 * @param {{ user: { id: any; }; }} session
 * @param {string} roles
 */
export async function authCheck(supabase, session, roles) {
    if (!session) {
        return false;
    }

    const { data } = await supabase.auth.admin.getUserById(session.user.id);
    if (data.user.user_metadata.disabled) {
        console.log("disabled");
        // @ts-ignore
        throw error("403", "Your account have been disabled");
    }

    const userRole = data.user.user_metadata.role || "";

    if (!userRole) {
        return false;
    }

    const allRoles = ["reader", "editor", "manager", "admin", "owner"];

    let allowedRoles = [];
    if (roles.charAt(0) == "!") {
        const notAllowed = roles.replace("!", "").split(",");
        allowedRoles = allRoles;
        allowedRoles = allowedRoles.filter((item) => !notAllowed.includes(item));
    } else {
        allowedRoles = roles.split(",");
    }

    if (allowedRoles.includes(userRole)) {
        return true;
    } else {
        return false;
    }
}

/**
 * @param {EventTarget} target
 */
export function highlightDOMText(target) {
    console.log(target);
    const range = document.createRange();
    // @ts-ignore
    range.selectNodeContents(target);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

/**
 * @param {string} string
 */
export function replaceSpaceWithDash(string) {
    return string.replace(/[\s\/]+/g, "-").toLowerCase();
}

/**
 * @param {string} string
 */
export function toURLPath(string) {
    return replaceSpaceWithDash(string);
}

/**
 * @param {string} string
 */
export function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * @param {number} n
 */
export function randomNumbers(n) {
    // Generate a random number between 0 and 1 (exclusive)
    let randomNumber = Math.random();

    // Convert the random number to a string
    let randomNumberString = randomNumber.toString().substring(2, n + 2);

    // Check if the generated number's length is less than n
    if (randomNumberString.length < n) {
        // Calculate the number of zeros to pad
        let zerosToPad = n - randomNumberString.length;

        // Pad the number with zeros on the left
        randomNumberString = "0".repeat(zerosToPad) + randomNumberString;
    }

    return randomNumberString;
}

export function randomAlphabets(list = "abcdefghijklmnopqrstuvwxyz") {
    const randomIndex = Math.floor(Math.random() * list.length);
    const randomChar = alphabet.charAt(randomIndex);
    return randomChar;
}

/**
 * @param {string | any[] } list
 */
export function randomList(list) {
    if (typeof list === "string") {
        list = list.split("");
    }
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

/**
 * @param {string} html
 */
export function convertToHTMLAnchor(html) {
    const mdURL = new RegExp(/\((.+?)\)\[(.+?)\]/, "gm");
    html = html.replace(mdURL, `<a href="$2" target="_blank">$1</a>`);

    // Define a regular expression to match URLs in the message
    const urlRegex = new RegExp(/(?<!\S)(https:\/\/.+?\S+)/, "gm");

    // Replace each URL with a hyperlink tag
    html = html.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');

    // Return the linked message
    return html;
}
