import page_content from "./[pageName]/page_content.json";

import { toURLPath } from '$fn/helper'

export function load() {
    const pageContent = page_content.find((x) => toURLPath(x.path) == "main-section");
    return ({ pageContent })
}