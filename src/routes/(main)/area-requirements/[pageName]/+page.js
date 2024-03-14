import areaPset from "../areaPset.json";
import { toURLPath } from "$fn/helper";

export async function load({ params, parent }) {
    const { areaScheme, pageContent, schema } = await parent();

    console.log(schema);

    const pageName = params.pageName;

    const propertySet = schema.find(
        (x) => x.SubType.toUpperCase() == pageName.toUpperCase(),
    ).PropertySet;

    let content;

    for (const item of pageContent) {
        if (toURLPath(item.path) == toURLPath(pageName)) {
            content = item;
            break;
        }
    }

    const obj = areaPset.find((x) => x.SubType == content.path);
    const propNames = obj.Properties.map((x) => x.PropertyName);

    const tableContent = areaScheme.filter((x) => propNames.includes(x.scheme));

    return { content, tableContent, propertySet };
}
