import spaceNameJson from "./../data_space_ot_pdt.json";

export async function load({ url }) {

    const path = url.pathname.split(/\//).pop()

    const spaces = spaceNameJson.spaceName

    if (path == 'all-spaces') {
        return ({ spaces: spaces })
    }

    const result = spaces.filter(x => {
        const cat = x.category
            .replace(/\n/, "")
            .replace(/[\/,]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase()
        if (cat === path) {
            return x
        }
    })

    return ({ spaces: result })
}