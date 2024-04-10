import { toURLPath } from "$fn/helper";

export async function load({ params, parent }) {
    const { areaScheme, pageContent, schema } = await parent();

    const pageName = params.pageName;

    const { propertySet, Properties } = schema.find(
        (x) => x.SubType.toUpperCase() == pageName.toUpperCase(),
    );

    let content = pageContent.find((x) => toURLPath(x.path) == toURLPath(pageName));

    const propNames = Properties.map((x) => x.PropertyName);

    const tableContent = areaScheme.filter((x) => propNames.includes(x.scheme));

    return { content, tableContent, propertySet };
}
