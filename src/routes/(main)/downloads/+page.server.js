export async function load({ locals: { supabase } }) {

    const { data } = await supabase.from('downloads')
        .select()
        .eq('active', true)


    const result = []

    for (const item of data) {
        const index = result.findIndex(x => x.category == item.category)

        const dl = {
            id: item.id,
            description: item.description,
            updated: item.created_at,
            title: item.title,
            created_at: item.created_at,
            checksum: item.checksum,
            download: {
                url: item.url,
                type: item.type,
                fileName: item.fileName,
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

    for (const obj of sorted) {
        obj.downloads.sort((a, b) => {
            if (a.download.type < b.download.type) {
                return -1;
            }
            if (a.download.type > b.download.type) {
                return 1;
            }
            return 0;
        })
    }

    return ({ downloads: sorted })
}