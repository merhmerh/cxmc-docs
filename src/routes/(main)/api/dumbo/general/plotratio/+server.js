import { randomAlphabets, randomList, randomNumbers, uuid } from "$fn/helper.js";
import { json } from "@sveltejs/kit";
import data from "./data.json";

export function GET({ url }) {
    const mukim = url.searchParams.get("mukim");

    if (mukim) {
        const res = data.find((x) => x.mukim == mukim);
        return json(res);
    }

    return json(data);
}

function generateList() {
    const arr = [];
    for (let i = 0; i < 50; i++) {
        const mukim = `M${randomNumbers(2)}-${randomNumbers(5)}${randomAlphabets()}`;
        const plotRatio = randomList([1.4, 1.6, 2.1, 2.8, 2.8, 3.0, 3.2, 3.5, 4.0]);
        arr.push({ mukim, plotRatio });
    }
    return arr;
}
