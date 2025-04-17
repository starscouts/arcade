trainingMain = true;
training = false;
playable = true;
gridBefore = [];

window.addEventListener("load", () => {
    if (!location.hash.startsWith("#online/")) {
        document.getElementById("loader").style.display = "none";
        document.getElementById("game").style.display = "block";
    } else {
        train();
        online();
    }
})

setInterval(() => {
    if (playable) {
        checkWinReal();
        checkWin();
        disableGame();
    }
    if (!playable && location.hash.startsWith("#online/")) {
        document.getElementById("last-games").innerText = "Played with " + window.peerName + "\nGame ended.";
    }
});

function player(cell) {
    empty = grid().map((e, i) => { if (e === "") { return i + 1; } else { return null; } }).filter(i => i !== null);
    if (!empty.includes(cell)) return;

    if (trainingMain) {
        document.getElementById("p" + cell).style.color = "red";
        document.getElementById("p" + cell).innerText = "X";
        document.getElementById("p" + cell).style.cursor = "default";
        gridBefore = grid();
    } else {
        document.getElementById("p" + cell).style.color = "cyan";
        document.getElementById("p" + cell).innerText = "O";
        document.getElementById("p" + cell).style.cursor = "no-drop";
        document.getElementById("instructions").insertAdjacentText("beforeend", "\nmodel.addEvent(" + JSON.stringify(gridBefore) + ", " + cell + ", model.issue.UNKNOWN);");
    }

    checkWinReal();
    checkWin();
    disableGame();

    if (playable) {
        if (!training) {
            document.getElementById("wait").style.display = "block";
            model.think();
        } else if (!location.hash.startsWith("#online/")) {
            trainingMain = !trainingMain;
            model.thinkmin();
        } else {
            document.getElementById("wait").style.display = "block";
        }
    }

    if (location.hash.startsWith("#online/")) {
        ws.send(JSON.stringify({action:"place",position:cell}));
        document.getElementById("last-games").innerText = "Playing with " + window.peerName + "\nWaiting for the other player to place.";
    }
}

function aiinsight(cell) {
    document.getElementById("p" + cell).classList.add("insight")
}

function aiclearinsight() {
    Array.from(document.getElementsByClassName("insight")).forEach((e) => {
        e.classList.remove("insight");
    })
}

function aiplace(cell) {
    console.log("Thought:", cell);
    document.getElementById("stat-thought").innerText = document.getElementById("stat-thought").innerText - 1 + 2;
    document.getElementById("stat-randomness").innerText = (((document.getElementById("stat-random").innerText - 1 + 1) / ((document.getElementById("stat-thought").innerText - 1 + 1) + (document.getElementById("stat-random").innerText - 1 + 1))) * 100).toFixed(2) + "%";
    if (document.getElementById("stat-randomness").innerText === "Infinity%") document.getElementById("stat-randomness").innerText = "0.00%";
    document.getElementById("p" + cell).style.color = "cyan";
    document.getElementById("p" + cell).innerText = "O";
    document.getElementById("wait").style.display = "none";
    document.getElementById("p" + cell).style.cursor = "no-drop";

    document.getElementById("instructions").insertAdjacentText("beforeend", "\nmodel.addEvent(" + JSON.stringify(gridBefore) + ", " + cell + ", model.issue.UNKNOWN);");
}

function airevplace(cell) {
    console.log("X: Thought:", cell);
    document.getElementById("p" + cell).style.color = "red";
    document.getElementById("p" + cell).innerText = "X";
    document.getElementById("wait").style.display = "none";
    document.getElementById("p" + cell).style.cursor = "no-drop";
}

function checkWin() {
    empty = grid().map((e, i) => { if (e === "") { return i + 1; } else { return null; } }).filter(i => i !== null);
    gridX = grid().map((e, i) => { if (e === "X") { return i + 1; } else { return null; } }).filter(i => i !== null);
    gridO = grid().map((e, i) => { if (e === "O") { return i + 1; } else { return null; } }).filter(i => i !== null);
    
    if (winning(gridO) && !winning(gridX)) {
        document.getElementById("instructions").innerText = document.getElementById("instructions").innerText.replaceAll("model.issue.UNKNOWN", "model.issue.SUCCESS");
        playable = false;
        console.log(document.getElementById("instructions").innerText);
        integrateModelChanges();
    } else if (winning(gridX) && !winning(gridO)) {
        document.getElementById("instructions").innerText = document.getElementById("instructions").innerText.replaceAll("model.issue.UNKNOWN", "model.issue.FAILURE");
        playable = false;
        console.log(document.getElementById("instructions").innerText);
        integrateModelChanges();
    } else if (!winning(gridX) && !winning(gridO) && empty.length === 0) {
        document.getElementById("instructions").innerText = document.getElementById("instructions").innerText.replaceAll("model.issue.UNKNOWN", "model.issue.NONE");
        playable = false;
        console.log(document.getElementById("instructions").innerText);
        integrateModelChanges();
    }
}

function checkWinReal() {
    empty = grid().map((e, i) => { if (e === "") { return i + 1; } else { return null; } }).filter(i => i !== null);
    gridX = grid().map((e, i) => { if (e === "X") { return i + 1; } else { return null; } }).filter(i => i !== null);
    gridO = grid().map((e, i) => { if (e === "O") { return i + 1; } else { return null; } }).filter(i => i !== null);
    
    if (winning(gridO)) {
        document.getElementById("stat-state").innerText = "SUCCESS (win: O)";
        playable = false;
    } else if (winning(gridX)) {
        document.getElementById("stat-state").innerText = "FAILURE (win: X)";
        playable = false;
    } else if (!winning(gridX) && !winning(gridO) && empty.length === 0) {
        document.getElementById("stat-state").innerText = "NONE (win: null)";
        playable = false;
    }
}

function disableGame() {
    if (!playable) {
        document.getElementById("game").style.opacity = "0.5";
        document.getElementById("game").style.pointerEvents = "none";
    }
}

function winning(array) {
    if (array.includes(4) && array.includes(5) && array.includes(6)) return true;
    if (array.includes(1) && array.includes(5) && array.includes(9)) return true;
    if (array.includes(1) && array.includes(2) && array.includes(3)) return true;
    if (array.includes(7) && array.includes(8) && array.includes(9)) return true;
    if (array.includes(3) && array.includes(5) && array.includes(7)) return true;
    if (array.includes(1) && array.includes(4) && array.includes(7)) return true;
    if (array.includes(2) && array.includes(5) && array.includes(8)) return true;
    if (array.includes(3) && array.includes(6) && array.includes(9)) return true;
    return false;
}

function train() {
    training = true;
    document.getElementById("game").style.backgroundColor = "#222";
}

function grid() {
    try {
        return [
            document.getElementById("p1").innerText,
            document.getElementById("p2").innerText,
            document.getElementById("p3").innerText,
            document.getElementById("p4").innerText,
            document.getElementById("p5").innerText,
            document.getElementById("p6").innerText,
            document.getElementById("p7").innerText,
            document.getElementById("p8").innerText,
            document.getElementById("p9").innerText
        ]
    } catch (e) {
        return ["","","","","","","","",""];
    }
}

gridrev = gridReverse = () => {
    return [
        document.getElementById("p1").innerText === "X" ? "O" : (document.getElementById("p1").innerText === "O" ? "X" : ""),
        document.getElementById("p2").innerText === "X" ? "O" : (document.getElementById("p2").innerText === "O" ? "X" : ""),
        document.getElementById("p3").innerText === "X" ? "O" : (document.getElementById("p3").innerText === "O" ? "X" : ""),
        document.getElementById("p4").innerText === "X" ? "O" : (document.getElementById("p4").innerText === "O" ? "X" : ""),
        document.getElementById("p5").innerText === "X" ? "O" : (document.getElementById("p5").innerText === "O" ? "X" : ""),
        document.getElementById("p6").innerText === "X" ? "O" : (document.getElementById("p6").innerText === "O" ? "X" : ""),
        document.getElementById("p7").innerText === "X" ? "O" : (document.getElementById("p7").innerText === "O" ? "X" : ""),
        document.getElementById("p8").innerText === "X" ? "O" : (document.getElementById("p8").innerText === "O" ? "X" : ""),
        document.getElementById("p9").innerText === "X" ? "O" : (document.getElementById("p9").innerText === "O" ? "X" : "")
    ]
}

function airand() {
    console.log("Random");
    document.getElementById("stat-random").innerText = document.getElementById("stat-random").innerText - 1 + 2;
    document.getElementById("stat-randomness").innerText = (((document.getElementById("stat-random").innerText - 1 + 1) / ((document.getElementById("stat-thought").innerText - 1 + 1) + (document.getElementById("stat-random").innerText - 1 + 1))) * 100).toFixed(2) + "%";
    if (document.getElementById("stat-randomness").innerText === "Infinity%") document.getElementById("stat-randomness").innerText = "0.00%";
    empty = grid().map((e, i) => { if (e === "") { return i + 1; } else { return null; } }).filter(i => i !== null);
    cell = empty[Math.floor(Math.random()*empty.length)];
    document.getElementById("p" + cell).style.color = "cyan";
    document.getElementById("p" + cell).innerText = "O";
    document.getElementById("wait").style.display = "none";
    document.getElementById("p" + cell).style.cursor = "no-drop";

    document.getElementById("instructions").insertAdjacentText("beforeend", "\nmodel.addEvent(" + JSON.stringify(gridBefore) + ", " + cell + ", model.issue.UNKNOWN);");
}

function airevrand() {
    console.log("X: Random");
    empty = grid().map((e, i) => { if (e === "") { return i + 1; } else { return null; } }).filter(i => i !== null);
    cell = empty[Math.floor(Math.random()*empty.length)];
    document.getElementById("p" + cell).style.color = "red";
    document.getElementById("p" + cell).innerText = "X";
    document.getElementById("wait").style.display = "none";
    document.getElementById("p" + cell).style.cursor = "no-drop";
}

window.addEventListener("load", () => {
    if (location.hash === "#/train") {
        train();
    }
    if (!location.hash.startsWith("#online/")) {
        document.getElementById("resetbtn").style.display = "none";
    }

    if (location.hash === "#/train") {
        document.title = "Local Game | Tic-Tac-Toe | Minteck Arcade";
    } else if (location.hash.startsWith("#online/")) {
        document.title = "Online Game | Tic-Tac-Toe | Minteck Arcade";
    } else if (location.hash === "#/auto") {
        document.title = "Automated machine learning | Tic-Tac-Toe | Minteck Arcade";
    } else {
        document.title = "Singleplayer Game | Tic-Tac-Toe | Minteck Arcade";
    }
});