modelLangWin = "";
modelLangAlt = "";
modelLangAl2 = "";
modelLangWinMin = "";
modelLangAltMin = "";
modelLangAl2Min = "";
modelLangWinRev = "";
modelLangAltRev = "";
modelLangAl2Rev = "";
modelTrainedGames = 0;

model = {
    issue: {
        SUCCESS: 2,
        NONE: 1,
        FAILURE: 0,
        UNKNOWN: -1
    },
    addEvent: (g, p, issue) => {
        if (issue === model.issue.SUCCESS) {
            modelLangWin += "if (cg === `" + JSON.stringify(g) + "`) { aiplace(" + p + "); return; }\n";
        } else if (issue === model.issue.NONE) {
            modelLangAlt += "if (cg === `" + JSON.stringify(g) + "`) { aiplace(" + p + "); return; }\n";
        } else if (issue === model.issue.FAILURE) {
            modelLangAlt += "if (cg === `" + JSON.stringify(g.map((i) => { if (i === "X") { return "O"; } else if (i === "O") { return "X"; } })) + "`) { aiplace(" + p + "); return; }\n";
        }
        if (issue === model.issue.SUCCESS) {
            modelLangWinMin += "if (cg === `" + JSON.stringify(g) + "`) { aiinsight(" + p + "); return; }\n";
        } else if (issue === model.issue.NONE) {
            modelLangAltMin += "if (cg === `" + JSON.stringify(g) + "`) { aiinsight(" + p + "); return; }\n";
        } else if (issue === model.issue.FAILURE) {
            modelLangAltMin += "if (cg === `" + JSON.stringify(g.map((i) => { if (i === "X") { return "O"; } else if (i === "O") { return "X"; } })) + "`) { aiinsight(" + p + "); return; }\n";
        }
        if (issue === model.issue.SUCCESS) {
            modelLangWinRev += "if (cg === `" + JSON.stringify(g) + "`) { airevplace(" + p + "); return; }\n";
        } else if (issue === model.issue.NONE) {
            modelLangAltRev += "if (cg === `" + JSON.stringify(g) + "`) { airevplace(" + p + "); return; }\n";
        } else if (issue === model.issue.FAILURE) {
            modelLangAltRev += "if (cg === `" + JSON.stringify(g.map((i) => { if (i === "X") { return "O"; } else if (i === "O") { return "X"; } })) + "`) { airevplace(" + p + "); return; }\n";
        }
    },
    addTrainedGame: () => {
        modelTrainedGames++;
    },
    init: () => {
        modelLang = "model.think = () => { cg = JSON.stringify(grid()); " + modelLangWin + "\n" + modelLangAlt + "\n" + modelLangAl2 + "; airand();}\nmodel.thinkmin = () => { aiclearinsight(); cg = JSON.stringify(grid()); " + modelLangWinMin + "\n" + modelLangAltMin + "\n" + modelLangAl2Min + ";};" + "model.thinkrev = () => { cg = JSON.stringify(gridReverse()); " + modelLangWin + "\n" + modelLangAlt + "\n" + modelLangAl2 + "; airevrand();}\nmodel.thinkmin = () => { aiclearinsight(); cg = JSON.stringify(gridReverse()); " + modelLangWinMin + "\n" + modelLangAltMin + "\n" + modelLangAl2Min + ";}";
        eval(modelLang);
        try { document.getElementById("stat-games").innerText = modelTrainedGames; } catch (e) {}
        try {
            size = modelLang.length;

            if (size > 1024) {
                if (size > (1024 * 1024)) {
                    document.getElementById("stat-modelsize").innerText = (modelLang.length / (1024 * 1024)).toFixed(2) + "M";
                } else {
                    document.getElementById("stat-modelsize").innerText = (modelLang.length / 1024).toFixed(2) + "K";
                }
            } else {
                document.getElementById("stat-modelsize").innerText = modelLang.length.toFixed(2) + "B";
            }
        } catch (e) {}
    },
    think: null,
    thinkmin: null,
    thinkrev: null
}
