export function load({ params, url }) {

    const searchParamSubtype = url.searchParams.get('k') || null
    return { entity: params.entity, searchParamSubtype }
}