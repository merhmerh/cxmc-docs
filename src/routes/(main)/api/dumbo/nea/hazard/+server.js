import { uuid } from "$fn/helper";
import { json } from "@sveltejs/kit";
import data from "./data.json";

export function GET({ url }) {
    const symbol = url.searchParams.get("symbol");
    const id = url.searchParams.get("id");
    const _class = url.searchParams.get("class");

    if (symbol) return findAndRespond("symbol", symbol);
    if (id) return findAndRespond("id", id);
    if (_class) return findAndRespond("class", _class);

    /**
     * @param {string} property
     * @param {any} value
     */
    function findAndRespond(property, value) {
        const res = data.filter((x) => x[property] == value);
        if (!res) {
            return json({ error: { code: 400, message: `Invalid ${property}` } });
        }
        if (res.length == 1) {
            return json(res[0]);
        }
        return json(res);
    }

    return json(data);
}

function generateList() {
    const row = [
        ["Fe", "Class 4.1", "Combustible substances"],
        ["Ex", "Class 1", "Explosive substances"],
        ["Fh", "Class 4.3", "Substances which give off combustible gases on contact with water"],
        ["Gh", "Class 6", "Substances which give off poisonous or foul smelling gases on contact with water"],
        ["Fa", "Class 4.2", "Substances liable to spontaneous combustion"],
        ["Tx", "Class 6", "Substances which can cause death or serious damage to health"],
        ["Gp", "Class 2", "Combustible and non , combustible gases under pressure including aerosol cans"],
        ["Ox", "Class 5", "Substances acting as oxidizing agents or sources of oxygen"],
        ["Ra", "Class 7", "Radioactive substances"],
        ["Xn", "Class 8", "Substances which are a health hazard including irritating and corrosive substances"],
    ];

    const r = {
        Fe: {
            Ex: "-",
            Fh: "-",
            Gh: "-",
            Fa: "O",
            Tx: "-",
            Ra: "-",
            Gp: "O",
        },
        Ex: {
            Fe: "-",
            Fh: "-",
            Gh: "-",
            Fa: "-",
            Tx: "-",
            Ra: "-",
            Gp: "-",
        },
        Fh: {
            Fe: "-",
            Ex: "-",
            Gh: "O",
            Fa: "-",
            Tx: "O",
            Ra: "-",
            Gp: "O",
        },
        Gh: {
            Fe: "-",
            Ex: "-",
            Fh: "O",
            Fa: "-",
            Tx: "O",
            Ra: "-",
            Gp: "O",
        },
        Fa: {
            Fe: "-",
            Ex: "-",
            Fh: "-",
            Gh: "-",
            Tx: "-",
            Ra: "-",
            Gp: "O",
        },
        Tx: {
            Fe: "O",
            Ex: "-",
            Fh: "O",
            Gh: "O",
            Fa: "-",
            Ra: "O",
            Gp: "O",
        },
        Ra: {
            Fe: "-",
            Ex: "-",
            Fh: "-",
            Gh: "-",
            Fa: "-",
            Tx: "+",
            Gp: "-",
        },
        Gp: {
            Fe: "-",
            Ex: "-",
            Fh: "-",
            Gh: "-",
            Fa: "O",
            Tx: "+",
            Ra: "O",
        },
        Ox: {
            Fe: "-",
            Ex: "-",
            Fh: "-",
            Gh: "O",
            Fa: "-",
            Tx: "-",
            Ra: "+",
            Gp: "O",
        },
        Xn: {
            Fe: "O",
            Ex: "-",
            Fh: "O",
            Gh: "O",
            Fa: "-",
            Tx: "-",
            Ra: "O",
            Gp: "+",
        },
    };

    const result = [];
    row.forEach((x) => {
        const matrix = (() => {
            const m = r[x[0]];

            let matrixString = JSON.stringify(m)
                .replace(/"\-"/g, '"Not allowed"')
                .replace(/"\+"/g, '"Allowed"')
                .replace(/"O"/g, '"Allowed under observation"');

            console.log(matrixString);

            return JSON.parse(matrixString);
        })();

        result.push({
            id: uuid(8),
            symbol: x[0],
            class: x[1],
            description: x[2],
            matrix: matrix,
        });
    });

    return result;
}
