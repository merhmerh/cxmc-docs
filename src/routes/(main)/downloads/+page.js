export async function load({ parent }) {
    const { supabase } = await parent()

    const { data } = await supabase.from('downloads')
        .select()
        .eq('active', true)


    const result = []



    for (const item of data) {
        const index = result.findIndex(x => x.category == item.category)

        const dl = {
            content: item.description,
            id: item.id,
            updated: item.created_at,
            download: {
                url: item.url,
                type: item.type,
                title: item.fileName,
                size: item.fileSize
            }
        }

        if (index < 0) {
            result.push({
                category: item.category,
                downloads: [dl]
            })
            continue;
        }

        result[index].downloads.push(dl)

    }

    const sorted = result.sort((a, b) => {
        if (a.category < b.category) {
            return -1;
        }
        if (a.category > b.category) {
            return 1;
        }
        return 0;
    })

    return ({ downloads: sorted })
}