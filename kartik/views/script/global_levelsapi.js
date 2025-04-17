module.exports = class LevelsAPI {

    associates;

    constructor() {

        let assocs_raw;
        let assocs_lines;
        let assocs_base;
        let assocs;
        let score;
        let cline;
        let line;
        let clvl;

        assocs_raw = require('fs').readFileSync("./online/levels.txt");
        assocs_lines = assocs_raw.toString().split("\n");
        assocs_base = {};

        for (line of assocs_lines) {
            cline = line.split(":");
            assocs_base[cline[1].trim()] = cline[0].trim() - 1 + 1;
        }

        assocs = {};

        clvl = 0;
        for (let c = 0; c <= 5051; c++) {
            if (assocs_base[c.toString()] !== undefined) {
                clvl = assocs_base[c.toString()];
            }
            assocs[c.toString()] = clvl.toString()
        }

        this.associates = assocs;

    }

    correspond(score, god) {
        if (score <= 5051) {
            return this.associates[score].toString();
        } else {
            return god;
        }
    }

}