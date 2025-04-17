allData = "";
totalGames = 0;
gamesLost = 0;
gamesWon = 0;
gamesNone = 0;

window.addEventListener("load", () => {
    if (location.hash === "#/auto") {
        document.getElementById("stat-played").innerText = "0";
        document.getElementById("auto-stats").style.display = "";
        autoStartGame();
    }
});

function aPlayInitial() {
    empty = grid().map((e, i) => { if (e === "") { return i + 1; } else { return null; } }).filter(i => i !== null);
    cell = empty[Math.floor(Math.random()*empty.length)];
    document.getElementById("p" + cell).style.color = "red";
    document.getElementById("p" + cell).innerText = "X";
    document.getElementById("wait").style.display = "none";
    document.getElementById("p" + cell).style.cursor = "no-drop";
}

function autoStartGame() {
    train();
    document.getElementById("game").style.backgroundColor = "#550000";
    document.getElementById("stat-goal").style.display = "none";
    document.getElementById("instructions").style.opacity = "0";
    aPlayInitial()
    trainingMain = false
    autoInterval = setInterval(() => {
        gridBefore = grid();

        if (!playable) {
            totalGames++;
            if (document.getElementById("stat-state").innerText.startsWith("SUCCESS")) gamesWon++;
            if (document.getElementById("stat-state").innerText.startsWith("NONE")) gamesNone++;
            if (document.getElementById("stat-state").innerText.startsWith("FAILURE")) gamesLost++;

            document.getElementById("ast-success").innerText = ((gamesWon / totalGames) * 100).toFixed(2) + "%";
            document.getElementById("ast-failure").innerText = ((gamesLost / totalGames) * 100).toFixed(2) + "%";
            document.getElementById("ast-none").innerText = ((gamesNone / totalGames) * 100).toFixed(2) + "%";
            document.getElementById("ast-nofail").innerText = (((gamesNone + gamesWon) / totalGames) * 100).toFixed(2) + "%";

            document.getElementById("bar-value-success").style.width = ((gamesWon / totalGames) * 100).toFixed(2) + "%";
            document.getElementById("bar-value-failure").style.width = ((gamesLost / totalGames) * 100).toFixed(2) + "%";
            document.getElementById("bar-value-none").style.width = ((gamesNone / totalGames) * 100).toFixed(2) + "%";

            document.getElementById("bar2-value-success").style.width = (((gamesWon + gamesNone) / totalGames) * 100).toFixed(2) + "%";
            document.getElementById("bar2-value-failure").style.width = ((gamesLost / totalGames) * 100).toFixed(2) + "%";

            document.getElementById("stat-played").innerText = document.getElementById("stat-played").innerText - 1 + 2;
            clearInterval(autoInterval);
            document.getElementById("last-games").innerText = (new Date().toISOString() + " " + document.getElementById("stat-state").innerText + "\n" + document.getElementById("last-games").innerText).substring(0, 1007);
            setTimeout(() => {
                el = document.getElementById("game");
                el.outerHTML = document.getElementsByClassName("game-template")[0].outerHTML;
                el = document.getElementsByClassName("game-template")[0];
                el.id = "game";
                el.classList.remove("game-template");
                el.style.display = "";
                playable = true;
                document.getElementById("stat-thought").innerText = "0";
                document.getElementById("stat-random").innerText = "0";
                document.getElementById("stat-randomness").innerText = "0.00%";
                document.getElementById("stat-state").innerText = "NONE";
                document.getElementById("instructions").innerText = "// ML Model Training\nmodel.addTrainedGame();";
                autoStartGame();
            });
            return;
        }

        if (trainingMain) {
            model.thinkrev();
            trainingMain = false
        } else {
            model.think();
            trainingMain = true
        }
    });
}

function integrateModelChanges() {
    if (location.hash !== "#/auto") return;
    code = document.getElementById("instructions").innerText;
    eval(code);
    allData += "\n\n" + code;
    console.clear();
    console.log(allData);
    model.init();
}

function stop() {
    clearInterval(autoInterval);
};
