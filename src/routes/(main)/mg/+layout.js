import mg_compJSON from "./mg_comp.json";
import { mg_comp } from "./mg.store";

export function load() {
    mg_comp.set(mg_compJSON);
    return ({})
}