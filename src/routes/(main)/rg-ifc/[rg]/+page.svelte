<script>
import Icon from "@iconify/svelte";
import { theme } from "$comp/theme.store";

let edit;
</script>

<div class="row_header">
    <input type="search" class="placeholder-smaller" placeholder="Search Entity of Subtype" />
    <button class="">Add new IfcEntity</button>
</div>

<div class="card">
    <div class="row">
        <div class="buttonGroup">
            {#if edit}
                <button class="alt">Save</button>
                <button
                    on:click={() => {
                        edit = false;
                    }}>Cancel</button>
            {:else}
                <button
                    on:click={() => {
                        edit = true;
                    }}>Edit</button>
            {/if}
        </div>
    </div>
    <div class="table_wrapper">
        <table class="noActionColumn {$theme}">
            <tr class="entity">
                <th colspan="2"><div>IfcEntity</div></th>
                <td colspan="4"><div>IfcWall</div></td>
            </tr>
            <tr class="subtype">
                <th colspan="2"><div>Subtype</div></th>
                <td colspan="4"><div>NOTDEFINED</div></td>
            </tr>

            <tr class="pset_header">
                <th colspan="2"><div>PropertySet</div></th>
                <th><div>PropertyName</div></th>
                <th><div>DataTypes</div></th>
                <th><div>Enums</div></th>
                <th><div>Description</div></th>
            </tr>

            <tr class="prop">
                <td>
                    <div>
                        <button class="none">
                            <Icon icon="ic:baseline-edit" width={14} />
                        </button>
                    </div>
                </td>
                <td class="prop_pset"><div>SGPset_XXX</div></td>
                <td class="prop_propName"><div>XXX</div></td>
                <td class="prop_dataType"><div>Label</div></td>
                <td class="prop_enums"><div>1.5</div></td>
                <td class="prop_description">
                    <div>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt consequatur, praesentium
                        sequi porro illum placeat tenetur est veniam a libero atque et sed ipsa velit, quae esse quasi
                        ex aspernatur!
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div>
        <button class=""> Add new property row </button>
    </div>

    <textarea name="" id="" class="placeholder-smaller" rows="1" placeholder="Enter more information when necessary" />
</div>

<style lang="scss">
.row_header {
    display: flex;
    justify-content: space-between;
}

.card {
    display: grid;
    gap: 0.5rem;
    border: 1px solid var(--mono-100);
    padding: 1rem;
    border-radius: 0.5rem;
    textarea {
        min-height: 0;
        width: 100%;
    }
}

table {
    width: 1302px;
    tr:first-child,
    tr:nth-child(2),
    tr:nth-child(3) {
        th:first-child {
            padding-left: 1.5rem;
        }
        th {
            border-top: 0;
            border-radius: 0;
        }
    }
    tr:first-child {
        th,
        td {
            border-top: 1px solid var(--table__border-color);
            &:first-child {
                border-radius: 0.25rem 0 0 0;
            }
            &:last-child {
                border-radius: 0 0.25rem 0 0;
            }
        }
    }
    tr:last-child {
        td:first-child {
            border-radius: 0 0 0 0.25rem;
        }
        td:last-child {
            border-radius: 0 0 0.25rem 0;
        }
    }
    tr:nth-child(2) {
        th {
            border-radius: 0;
        }
    }

    tr.prop {
        td:first-child {
            border-right: 0;
            div {
                padding: 0.125rem;
                padding-top: 0.25rem;
            }
        }
        td {
            vertical-align: top;
        }
        .prop_pset {
            width: 180px;
            div {
                padding-left: 0;
            }
        }
        .prop_propName {
            width: 180px;
        }
        .prop_dataType {
            width: 100px;
        }
        .prop_enums {
            width: 400px;
        }
        .prop_description {
            width: auto;
            div {
                white-space: pre-line;
            }
        }
    }
}
</style>
