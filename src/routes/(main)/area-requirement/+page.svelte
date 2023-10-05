<script>
import { theme } from "$comp/theme.store";
import areaJSON from "./area.json";
</script>

<h2>Foreword</h2>

<p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum cum quo optio obcaecati dolorum maxime non incidunt
    deserunt aut ab explicabo, sit at neque impedit voluptates atque quasi odit odio? Lorem ipsum dolor sit amet
    consectetur adipisicing elit. Perferendis, dolorum. Esse, quia nulla ratione tempora repellendus amet omnis soluta,
    voluptas repudiandae laboriosam in ut officiis alias cum doloribus! Dignissimos, nesciunt!
</p>

<div class="grid-2">
    <div class="img-container">
        <img src="/images/ura_diagram_1.jpg" alt="" />
    </div>
    <div class="img-container">
        <img src="/images/ura_diagram_2.jpg" alt="" />
    </div>
</div>

<h2>Summary</h2>

<!-- <div class="table_wrapper">
    <table class="{$theme} noActionColumn">
        <thead>
            <tr>
                <th><div>SubType</div></th>
                <th><div>Pset</div></th>
                <th><div>Properties</div></th>
            </tr>
        </thead>
        <tbody>
            {#each areaJSON as obj}
                <tr>
                    <td rowspan={obj.Properties.length + 1}><div>{obj.SubType}</div></td>
                    <td rowspan={obj.Properties.length + 1}><div>{obj.PropertySet}</div></td>
                </tr>
                {#each obj.Properties as { PropertyName }}
                    <tr>
                        <td>
                            <div>{PropertyName}</div>
                        </td>
                    </tr>
                {/each}
            {/each}
        </tbody>
    </table>
</div> -->

<div class="table_wrapper special">
    {#each areaJSON as { SubType, PropertySet, Properties }}
        <table class="{$theme} noActionColumn">
            <thead>
                <tr>
                    <th><div>{SubType}</div></th>
                </tr>
                <tr><th><div>{PropertySet}</div></th></tr>
            </thead>
            <tbody>
                {#each Array(8) as _, i}
                    <tr><td><div>{Properties[i]?.PropertyName || ""}</div></td></tr>
                {/each}
            </tbody>
        </table>
    {/each}
</div>

<style lang="scss">
.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    .img-container {
        height: 300px;
        width: 100%;
        overflow: hidden;
        border-radius: 0.25rem;
        &:hover {
            img {
                transform: scale(1.1);
            }
        }
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: all 1s;
    }
}
table {
    font-size: 0.875rem;
    th {
        > div {
            font-size: 14px;
        }
    }
}
.special {
    display: flex;
    align-items: flex-start;
    table {
        border-collapse: collapse;
        border: 1px solid var(--mono-100);
        &:not(:first-child) {
            border-left: 0;
        }
        td {
            div {
                min-height: 28px;
            }
        }
        // &:nth-child(1) {
        //     td {
        //         background-color: rgba(red, 0.06);
        //     }
        // }
        // &:nth-child(2) {
        //     td {
        //         background-color: rgba(yellow, 0.06);
        //     }
        // }
        // &:nth-child(3) {
        //     td {
        //         background-color: rgba(green, 0.06);
        //     }
        // }
        // &:nth-child(4) {
        //     td {
        //         background-color: rgba(teal, 0.06);
        //     }
        // }
        // &:nth-child(5) {
        //     td {
        //         background-color: rgba(#006eff, 0.06);
        //     }
        // }
    }
}
</style>
