import { getSharedParams } from "./revitSharedParams.js";
import fs from "fs";
import pkg from 'jstoxml';
const { toXML } = pkg


const map = [
    { sharedParamType: "YESNO", Type: "Boolean", UnitType: "autodesk.spec:spec.bool-1.0.0", UnitTypeDisplay: "Yes/No" },
    { sharedParamType: "INTEGER", Type: "Integer", UnitType: "autodesk.spec:spec.int64-2.0.0", UnitTypeDisplay: "Integer" },
    { sharedParamType: "TEXT", Type: "Text", UnitType: "autodesk.spec:spec.string-2.0.0", UnitTypeDisplay: "Text" },
    { sharedParamType: "LENGTH", Type: "Double", UnitType: "autodesk.spec.aec:length-2.0.0", UnitTypeDisplay: "Length" },
    { sharedParamType: "NUMBER", Type: "Double", UnitType: "autodesk.spec.aec:number-2.0.0", UnitTypeDisplay: "Number" },
]


export async function generateBIT_XML() {
    const categoryMap = generateCategoryMap()
    const entity = JSON.parse(fs.readFileSync('./output/entity_id.json', 'utf-8'))

    const { result: sharedParams } = await getSharedParams(true)

    const parameters = { _name: "Parameters", _content: [] }

    for (const prop of sharedParams) {
        const parameter = createParameterJSON(prop)

        if (!parameter) {
            // console.log("--parameter xml cannot be created");
            continue
        }

        const entityField = entity.find(x => x.fields['IFC4 Entities'] == prop.entity)
        const revitRepresentationArr = entityField.fields["Revit Representation"].split(/,/).map(x => x.trim())


        const categories = {
            _name: "Categories",
            _content: []
        }

        for (const rep of revitRepresentationArr) {
            const result = categoryMap.find(x => x.name == rep)
            if (!result) {
                console.log("--invalid revit category:", rep, `{ ${prop.entity} -> ${prop.name} }`);
                continue;
            }

            const category = {
                _name: 'Category',
                _attrs: {
                    ID: result.id,
                    Name: rep,
                }
            }
            categories._content.push(category)
        }


        parameter._content = categories
        parameters._content.push(parameter)
    }

    const dataXML = toXML(parameters, { indent: "\t" })
    const resultXML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` + dataXML
    fs.writeFileSync('./src/revit/Revit_BIT-IFCSG-Parameters.xml', resultXML)
}


function createParameterJSON(prop) {
    const dt = map.find(x => x.sharedParamType == prop.dataType)
    if (!dt) {
        console.log("--invalid datatype", prop.datatype, `(${prop.name})`);
        return false
    }
    const data = {
        _name: 'Parameter',
        _attrs: {
            GUID: prop.guid,
            Name: prop.name,
            Group: "ifcsg",
            Type: dt.Type,
            UnitType: dt.UnitType,
            UnitTypeDisplay: dt.UnitTypeDisplay,
            Description: "",
            IsInstance: "True",
            GroupUnder: "autodesk.parameter.group:ifc-1.0.0",
            AlignGroupValues: "True",
            UserModifiable: "True",
            HideWhenNoValue: "False",
        }
    }
    return data
}


function generateCategoryMap() {
    const xmlCat = `
    <Category ID="-2006130" Name="Abutments" />
    <Category ID="-2001008" Name="Air Systems" />
    <Category ID="-2008013" Name="Air Terminals" />
    <Category ID="-2001012" Name="Alignments" />
    <Category ID="-2009630" Name="Analytical Beams" />
    <Category ID="-2009633" Name="Analytical Braces" />
    <Category ID="-2009636" Name="Analytical Columns" />
    <Category ID="-2009639" Name="Analytical Floors" />
    <Category ID="-2009643" Name="Analytical Foundation Slabs" />
    <Category ID="-2009641" Name="Analytical Isolated Foundations" />
    <Category ID="-2009657" Name="Analytical Links" />
    <Category ID="-2009645" Name="Analytical Nodes" />
    <Category ID="-2000983" Name="Analytical Pipe Connections" />
    <Category ID="-2008185" Name="Analytical Spaces" />
    <Category ID="-2008186" Name="Analytical Surfaces" />
    <Category ID="-2009642" Name="Analytical Wall Foundations" />
    <Category ID="-2009640" Name="Analytical Walls" />
    <Category ID="-2003200" Name="Areas" />
    <Category ID="-2000267" Name="Assemblies" />
    <Category ID="-2006138" Name="Bearings" />
    <Category ID="-2006133" Name="Bridge Cables" />
    <Category ID="-2006135" Name="Bridge Decks" />
    <Category ID="-2006241" Name="Bridge Framing" />
    <Category ID="-2008126" Name="Cable Tray Fittings" />
    <Category ID="-2008150" Name="Cable Tray Runs" />
    <Category ID="-2008130" Name="Cable Trays" />
    <Category ID="-2001000" Name="Casework" />
    <Category ID="-2000038" Name="Ceilings" />
    <Category ID="-2000100" Name="Columns" />
    <Category ID="-2008081" Name="Communication Devices" />
    <Category ID="-2008128" Name="Conduit Fittings" />
    <Category ID="-2008149" Name="Conduit Runs" />
    <Category ID="-2008132" Name="Conduits" />
    <Category ID="-2000170" Name="Curtain Panels" />
    <Category ID="-2000340" Name="Curtain Systems" />
    <Category ID="-2000171" Name="Curtain Wall Mullions" />
    <Category ID="-2008083" Name="Data Devices" />
    <Category ID="-2002000" Name="Detail Items" />
    <Category ID="-2000023" Name="Doors" />
    <Category ID="-2008016" Name="Duct Accessories" />
    <Category ID="-2008010" Name="Duct Fittings" />
    <Category ID="-2008123" Name="Duct Insulations" />
    <Category ID="-2008124" Name="Duct Linings" />
    <Category ID="-2008160" Name="Duct Placeholders" />
    <Category ID="-2008015" Name="Duct Systems" />
    <Category ID="-2008000" Name="Ducts" />
    <Category ID="-2008037" Name="Electrical Circuits" />
    <Category ID="-2001040" Name="Electrical Equipment" />
    <Category ID="-2001060" Name="Electrical Fixtures" />
    <Category ID="-2001370" Name="Entourage" />
    <Category ID="-2006271" Name="Expansion Joints" />
    <Category ID="-2008085" Name="Fire Alarm Devices" />
    <Category ID="-2008020" Name="Flex Ducts" />
    <Category ID="-2008050" Name="Flex Pipes" />
    <Category ID="-2000032" Name="Floors" />
    <Category ID="-2001392" Name="Slab Edges" />
    <Category ID="-2000080" Name="Furniture" />
    <Category ID="-2001100" Name="Furniture Systems" />
    <Category ID="-2000151" Name="Generic Models" />
    <Category ID="-2000220" Name="Grids" />
    <Category ID="-2008107" Name="HVAC Zones" />
    <Category ID="-2000240" Name="Levels" />
    <Category ID="-2008087" Name="Lighting Devices" />
    <Category ID="-2001120" Name="Lighting Fixtures" />
    <Category ID="-2000051" Name="Lines" />
    <Category ID="-2003400" Name="Mass" />
    <Category ID="-2000700" Name="Materials" />
    <Category ID="-2001140" Name="Mechanical Equipment" />
    <Category ID="-2000985" Name="Mechanical Equipment Sets" />
    <Category ID="-2008212" Name="MEP Fabrication Containment" />
    <Category ID="-2008193" Name="MEP Fabrication Ductwork" />
    <Category ID="-2008203" Name="MEP Fabrication Hangers" />
    <Category ID="-2008208" Name="MEP Fabrication Pipework" />
    <Category ID="-2000095" Name="Model Groups" />
    <Category ID="-2008077" Name="Nurse Call Devices" />
    <Category ID="-2001180" Name="Parking" />
    <Category ID="-2000269" Name="Parts" />
    <Category ID="-2006131" Name="Piers" />
    <Category ID="-2008055" Name="Pipe Accessories" />
    <Category ID="-2008049" Name="Pipe Fittings" />
    <Category ID="-2008122" Name="Pipe Insulations" />
    <Category ID="-2008161" Name="Pipe Placeholders" />
    <Category ID="-2008044" Name="Pipes" />
    <Category ID="-2008043" Name="Piping Systems" />
    <Category ID="-2001360" Name="Planting" />
    <Category ID="-2001160" Name="Plumbing Fixtures" />
    <Category ID="-2003101" Name="Project Information" />
    <Category ID="-2000126" Name="Railings" />
    <Category ID="-2000180" Name="Ramps" />
    <Category ID="-2009013" Name="Rebar Shape" />
    <Category ID="-2001220" Name="Roads" />
    <Category ID="-2000035" Name="Roofs" />
    <Category ID="-2001390" Name="Fascias" />
    <Category ID="-2001391" Name="Gutters" />
    <Category ID="-2001393" Name="Roof Soffits" />
    <Category ID="-2000160" Name="Rooms" />
    <Category ID="-2001352" Name="RVT Links" />
    <Category ID="-2000573" Name="Schedules" />
    <Category ID="-2008079" Name="Security Devices" />
    <Category ID="-2000996" Name="Shaft Openings" />
    <Category ID="-2003100" Name="Sheets" />
    <Category ID="-2001260" Name="Site" />
    <Category ID="-2003600" Name="Spaces" />
    <Category ID="-2001350" Name="Specialty Equipment" />
    <Category ID="-2008099" Name="Sprinklers" />
    <Category ID="-2000120" Name="Stairs" />
    <Category ID="-2000920" Name="Landings" />
    <Category ID="-2000919" Name="Runs" />
    <Category ID="-2000952" Name="Supports" />
    <Category ID="-2009003" Name="Structural Area Reinforcement" />
    <Category ID="-2001327" Name="Structural Beam Systems" />
    <Category ID="-2001330" Name="Structural Columns" />
    <Category ID="-2009030" Name="Structural Connections" />
    <Category ID="-2009017" Name="Structural Fabric Areas" />
    <Category ID="-2009016" Name="Structural Fabric Reinforcement" />
    <Category ID="-2001300" Name="Structural Foundations" />
    <Category ID="-2001320" Name="Structural Framing" />
    <Category ID="-2005204" Name="Structural Internal Loads" />
    <Category ID="-2005200" Name="Structural Loads" />
    <Category ID="-2009009" Name="Structural Path Reinforcement" />
    <Category ID="-2009000" Name="Structural Rebar" />
    <Category ID="-2009060" Name="Structural Rebar Couplers" />
    <Category ID="-2001354" Name="Structural Stiffeners" />
    <Category ID="-2006274" Name="Structural Tendons" />
    <Category ID="-2001336" Name="Structural Trusses" />
    <Category ID="-2008101" Name="Switch System" />
    <Category ID="-2001001" Name="System-Zones" />
    <Category ID="-2008075" Name="Telephone Devices" />
    <Category ID="-2001340" Name="Topography" />
    <Category ID="-2006261" Name="Vibration Management" />
    <Category ID="-2000279" Name="Views" />
    <Category ID="-2000011" Name="Walls" />
    <Category ID="-2001009" Name="Water Loops" />
    <Category ID="-2000014" Name="Windows" />
    <Category ID="-2008039" Name="Wires" />
    <Category ID="-2001010" Name="Zone Equipment" />
    <Category ID="-2001055" Name="Audio Visual Devices" />
    <Category ID="-2001049" Name="Fire Protection" />
    <Category ID="-2001043" Name="Food Service Equipment" />
    <Category ID="-2001036" Name="Hardscape" />
    <Category ID="-2001046" Name="Medical Equipment" />
    <Category ID="-2001058" Name="Signage" />
    <Category ID="-2001039" Name="Temporary Structures" />
    <Category ID="-2001052" Name="Vertical Circulation" />
    <Category ID="-2009662" Name="Analytical Members" />
    <Category ID="-2009665" Name="Analytical Openings" />
    <Category ID="-2009664" Name="Analytical Panels" />
    <Category ID="-2001021" Name="Electrical Analytical Bus" />
    <Category ID="-2001020" Name="Electrical Analytical Loads" />
    <Category ID="-2001026" Name="Electrical Analytical Power Source" />
    <Category ID="-2001023" Name="Electrical Analytical Transfer Switch" />
    <Category ID="-2001077" Name="Electrical Analytical Transformer" />
    <Category ID="-2001024" Name="Electrical Load Areas" />
    <Category ID="-2008232" Name="Mechanical Control Devices" />
    <Category ID="-2008234" Name="Plumbing Equipment" />
    <Category ID="-2001107" Name="Data Exchanges" />
    <Category ID="-2001098" Name="Electrical Analytical Load Set" />
    <Category ID="-2008231" Name="MEP Ancillary Framing" />
    <Category ID="-2008228" Name="MEP Fabrication Ductwork Stiffeners" />
    <Category ID="-2006060" Name="Revision Clouds" />
    <Category ID="-2001079" Name="Toposolid" />
    `

    const categoryMap = []
    xmlCat.split(/\n/).forEach(line => {
        if (!line.trim()) return
        const { id, name } = (() => {
            const regex = new RegExp(/Category\sID="(.+?)\".+Name=\"(.+?)"/)
            const matches = line.match(regex)
            return { id: matches[1], name: matches[2] }

        })()

        categoryMap.push({ name, id })
    })

    return categoryMap
}
