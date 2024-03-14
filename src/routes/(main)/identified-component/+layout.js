import mg_compJSON from "./mg_comp.json";
import rulesJSON from "../api/ifcsg/get-code/rules.json";
import { mg_comp } from "./mg.store";

export function load() {
    // console.log(rulesJSON);

    let mg_data = mg_compJSON.sort((a, b) =>
        a.IdentifiedComponent.localeCompare(b.IdentifiedComponent),
    );
    mg_comp.set(mg_data);
    return {};
}
