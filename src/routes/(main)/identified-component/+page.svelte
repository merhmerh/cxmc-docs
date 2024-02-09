<script>
import { theme } from "$comp/theme.store";
import { capitalizeFirstCharacter } from "$fn/helper.js";
import { page } from "$app/stores";

console.log($page);

const dataTypes = [
    {
        ifcDataType: "Label",
        unit: "-",
        programming: "Varchar(255)",
        revit: "Label",
        archiCAD: "Label",
    },
    {
        ifcDataType: "BOolean",
        unit: "-",
        programming: "Boolean",
        revit: "Yes/No",
        archiCAD: "True/False",
    },
    {
        ifcDataType: "Integer",
        unit: "-",
        programming: "Integer",
        revit: "Number",
        archiCAD: "Number",
    },
    {
        ifcDataType: "Real",
        unit: "-",
        programming: "Float",
        revit: "Number",
        archiCAD: "Number",
    },
    {
        ifcDataType: "Length",
        unit: "mm",
        programming: "Float",
        revit: "Length",
        archiCAD: "Length",
    },
    {
        ifcDataType: "Area",
        unit: "m²",
        programming: "FLoat",
        revit: "Area",
        archiCAD: "Area",
    },
    {
        ifcDataType: "Volume",
        unit: "m³",
        programming: "FLoat",
        revit: "Area",
        archiCAD: "Area",
    },
];
</script>

<div class="page">
    <h1>Identified Components</h1>

    <p>
        Identified Components are building element that can can have multiple IFC representation
        depending on its application.
    </p>

    <p>
        Each Identified Component page contain contain modeling information, relevant clause
        required for submission gateway and required IFC Property
    </p>

    <div class="divider"></div>

    <h2>General Modelling Guide</h2>

    <div class="table_wrapper">
        <table class="{$theme} spaces noActionColumn noHover">
            <thead><tr><th colspan="3"><div>Hierarchy of Space</div></th></tr></thead>
            <tbody>
                <tr>
                    <td rowspan="3" class="head"><div>AREA_GFA</div></td>
                    <td><div>Name</div></td>
                    <td><div>The name of the area</div></td>
                </tr>
                <tr>
                    <td><div>Development Use</div></td>
                    <td><div>URA development use of the area in question</div></td>
                </tr>
                <tr>
                    <td><div>Building Typology</div></td>
                    <td>
                        <div>The building typology where the area is in</div>
                    </td>
                </tr>
                <tr>
                    <td rowspan="2" class="head"><div>SPACE</div></td>
                    <td><div>Space Name</div></td>
                    <td><div>The name of the space</div></td>
                </tr>
                <tr>
                    <td><div>OccupancyType</div></td>
                    <td><div>SCDF definition of occupancy type for the space</div></td>
                </tr>
                <tr>
                    <td class="head"><div>SITEBOUNDARY</div></td>
                    <td><div>Broad Land Use</div></td>
                    <td><div>Referring to the broad land use of the entire site</div></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="table_wrapper">
        <table class="{$theme} datatype noActionColumn noHover">
            <thead>
                <tr> <th colspan="5"><div>Data Types</div> </th> </tr>
                <tr>
                    {#each Object.keys(dataTypes[0]) as t}
                        <th><div>{capitalizeFirstCharacter(t)}</div></th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each dataTypes as dt}
                    <tr>
                        <td><div>{dt.ifcDataType}</div></td>
                        <td><div>{dt.unit}</div></td>
                        <td><div>{dt.programming}</div></td>
                        <td><div>{dt.revit}</div></td>
                        <td><div>{dt.archiCAD}</div></td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <p>
        Pre-built config files and BIM objects can be downloaded <a
            target="_blank"
            href={$page.url.origin + "/downloads"}>here.</a>
    </p>
    <p>
        For Revit users, <a
            target="_blank"
            href="https://www.autodesk.com/support/technical/article/caas/tsarticles/ts/1aRSWc6yCml2MG0o9yqrKh.html"
            >Learn how to export</a> if you are using your own custom BIM Standards and Property Sets.
    </p>
    <!--  -->
</div>

<style lang="scss">
.page {
    width: 800px;

    .divider {
        border-bottom: 1px solid var(--mono-100);
        padding-block: 1rem;
    }
}

.table_wrapper {
    padding-block: 1rem;
    table {
        &.spaces {
            th {
                border-left: 1px solid var(--table__border-color);
                border-top-left-radius: 0.25rem;
                div {
                    justify-content: center;
                    font-size: 1rem;
                    font-weight: 600;
                }
            }
            td:not(.head) {
                border-left: 0;
            }
        }
        &.datatype {
            thead {
                tr:first-child {
                    div {
                        justify-content: center;
                    }
                    th {
                        border-radius: 0.25rem 0.25rem 0 0;
                        border-left: 1px solid var(--table__border-color);
                    }
                }
                tr:not(:first-child) {
                    th {
                        border-radius: 0;
                        border-top: 0;
                    }
                }
            }
        }
    }
}
</style>
