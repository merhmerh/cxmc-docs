
import { toURLPath } from '$fn/helper'

export async function load({ parent }) {
    const data = await parent()

    console.log(data.pageContent);
    const pageContent = data.pageContent.find((x) => toURLPath(x.path) == "main-section");
    return ({ pageContent })
}