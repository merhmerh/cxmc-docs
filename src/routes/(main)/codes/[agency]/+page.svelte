<script>
import { rules } from "../rules.store";
import { page } from "$app/stores";
import CodeTable from "./CodeTable.svelte";

let list = {};
$: $page, update();

function update() {
    let workingList = {};
    const agency = $page.params.agency;
    const filtered = $rules.filter((x) => x.agency.toLowerCase() === agency.toLowerCase()).slice();

    for (const item of filtered) {
        if (!workingList[item.chapter]) {
            workingList[item.chapter] = [item];
        } else {
            workingList[item.chapter].push(item);
        }
    }

    for (const [key, arr] of Object.entries(workingList)) {
        const a = {};
        for (const item of arr) {
            if (!a[item.clauseNumber]) {
                a[item.clauseNumber] = { ...item }; // Clone the object
                a[item.clauseNumber].clause = [a[item.clauseNumber].clause];
            } else {
                const clause = [...a[item.clauseNumber].clause, item.clause];

                a[item.clauseNumber].clause = [...new Set(clause)];
                a[item.clauseNumber].clause = a[item.clauseNumber].clause.sort();

                const ic = [...a[item.clauseNumber].identifiedComponents, ...item.identifiedComponents];
                a[item.clauseNumber].identifiedComponents = [...new Set(ic)];
            }
        }
        const sortedKeys = Object.keys(a).sort();

        const sortedObject = {};
        sortedKeys.forEach((key) => {
            sortedObject[key] = a[key];
        });

        workingList = { ...workingList, [key]: sortedObject };
    }

    list = workingList;
}
</script>

{#each Object.entries(list) as [chapter, obj]}
    <div class="card">
        <h3>{chapter}</h3>
        {#each Object.entries(obj) as [clauseNumber, item]}
            <CodeTable {item}></CodeTable>
        {/each}
    </div>
{/each}

<style lang="scss">
h3 {
    margin: 0;
}
.card {
    border-radius: 0.25rem;
    gap: 1rem;
}
</style>
