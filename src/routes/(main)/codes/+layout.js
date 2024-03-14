import rulesJSON from "../api/ifcsg/get-code/rules.json";
import { rules } from "./rules.store";

export function load() {
    console.log(rulesJSON);
    let rules_data = rulesJSON.sort((a, b) => a.agency.localeCompare(b.agency));
    rules.set(rules_data);
    return ({})
}