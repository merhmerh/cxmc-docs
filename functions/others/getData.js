import { fetchData } from "./fetch_airtable.js";
import { mergeData } from "./mergeData.js";
import { parseSpaceAndOccupancyType } from "./getSpacesOT.js";

main();
async function main() {
    console.log("Fetching from Airtable");
    await fetchData();
    console.log("Fetch completed");

    console.log("Merging data");
    await mergeData();
    console.log("Merge completed");

    console.log("Parsing Spacename and OccupancyTypes");
    await parseSpaceAndOccupancyType();

    console.log("--End--");
}
