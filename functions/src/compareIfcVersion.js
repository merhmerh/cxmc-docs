import dotenv from "dotenv";
import chalk from "chalk";
import { diffLines } from "diff";
import { supabase } from "./helper.js";

const { data, error } = await supabase.from("airtable").select().select().order("id", { ascending: false }).limit(2);

const newResult = data[0].result;
const oldResult = data[1].result;

const a = JSON.stringify(newResult, null, 2);
const b = JSON.stringify(oldResult, null, 2);

console.log("calc diff");
const differences = diffLines(a, b);

// console.log(differences);

differences.forEach((part) => {
    if (part.added) {
        console.log(chalk.green(part.value));
    } else if (part.removed) {
        console.log(chalk.red(part.value));
    } else {
        // console.log(part.value);
    }
});
