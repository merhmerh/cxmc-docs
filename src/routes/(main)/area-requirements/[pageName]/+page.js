import page_content from './page_content.json'
import table_content from './table_content.json'
import area_map from '../area.json'
import { toURLPath } from '$fn/helper'

export function load({ params }) {

    const pageName = params.pageName
    let pageContent

    for (const item of page_content) {
        if (toURLPath(item.path) == toURLPath(pageName)) {
            pageContent = item
            break
        }
    }

    const obj = area_map.find(x => x.SubType == pageContent.path)
    const propNames = obj.Properties.map(x => x.PropertyName)

    const tableContent = table_content.filter(x => propNames.includes(x.scheme))

    return ({ pageContent, tableContent })
}