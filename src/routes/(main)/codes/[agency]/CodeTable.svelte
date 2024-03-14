<script>
import { theme } from "$comp/theme.store";
import { replaceSpaceWithDash } from "$fn/helper";

export let item;
</script>

<div class="table_wrapper">
    <table class="horizontal noActionColumn {$theme}">
        <tr class="codeBook">
            <th><div>Code Book</div></th>
            <td><div>{item.code}</div></td>
        </tr>
        <tr><th><div>Clause Number</div></th><td><div>{item.clauseNumber || "–"}</div></td></tr>

        <tr class="clause">
            <th><div>Clause</div></th>
            <td
                ><div>
                    {#each item.clause as clause}<p>{clause}</p>{/each}
                </div></td>
        </tr>

        <tr class="ic">
            <th><div>Identified Component</div></th>
            <td
                ><div class="tags">
                    {#each item.identifiedComponents as ic}
                        <code><a href="/identified-component/{replaceSpaceWithDash(ic)}">{ic}</a></code>
                    {/each}
                </div>
            </td>
        </tr>
    </table>
</div>

<style lang="scss">
table {
    tr {
        th {
            background-color: var(--table__background-color);
            vertical-align: top;
            text-align: top;
            width: 180px;
        }

        &.clause {
            td > div {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                p {
                    margin: 0;
                }
            }
        }
        &.ic {
            td > div {
                display: flex;
                gap: 0.325rem;
                code > a {
                    padding: 0;
                    text-decoration: none;
                }
            }
        }
    }
}
</style>
