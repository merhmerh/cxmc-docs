import dayjs from 'dayjs'

export async function load({ parent }) {
    const data = await parent()
    const { supabase } = data;

    const versions = await (async () => {
        const { data, error } = await supabase.from("airtable").select("id,last_updated");

        if (error) {
            console.log(error.message);
            return []
        }

        const list = data.map((x) => {
            return {
                label: `v${x.id}: ${dayjs(x.last_updated).format("DD MMM YYYY, hh:mma")}`,
                value: x.id,
            };
        });

        list.sort((a, b) => b.value - a.value);
        return list;
    })()

    const { data: properties, error } = await supabase.from('property').select()


    return { versions, properties }

}


