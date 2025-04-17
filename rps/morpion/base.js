trainingMain = true;
training = false;
playable = true;
gridBefore = [];

function train() {}

window.addEventListener("load", () => {
    if (!location.hash.startsWith("#online/")) {
        document.getElementById("loader").style.display = "none";
        document.getElementById("game").style.display = "block";
    } else {
        train();
        online();
    }
})

function player(cell) {
    document.getElementById("p4").style.opacity = ".5";
    document.getElementById("p4").style.filter = "saturate(0)";
    document.getElementById("p5").style.opacity = ".5";
    document.getElementById("p5").style.filter = "saturate(0)";
    document.getElementById("p6").style.opacity = ".5";
    document.getElementById("p6").style.filter = "saturate(0)";
    document.getElementById("p" + cell).style.opacity = "1";
    document.getElementById("p" + cell).style.filter = "";

    if (playable) {
        document.getElementById("wait").style.display = "block";
    }

    if (location.hash.startsWith("#online/")) {
        ws.send(JSON.stringify({action:"place",position:cell}));
        document.getElementById("last-games").innerText = "Playing with " + window.peerName + "\nWaiting for the other player to place.";
    }

    youPlaced = true;
    if (otherPlaced) {
        checkWinner();
    }
}

function disableGame() {
    document.getElementById("game").style.opacity = "0.5";
    document.getElementById("wait").style.display = "none";
    document.getElementById("game").style.pointerEvents = "none";
}

function grid() {
    try {
        return [
            document.getElementById("p1").style.opacity === "1",
            document.getElementById("p2").style.opacity === "1",
            document.getElementById("p3").style.opacity === "1",
            document.getElementById("p4").style.opacity === "1",
            document.getElementById("p5").style.opacity === "1",
            document.getElementById("p6").style.opacity === "1"
        ]
    } catch (e) {
        return [false,false,false,false,false,false];
    }
}

window.addEventListener("load", () => {
    if (location.hash === "#/train") {
        location.href = "/";
    }
    if (!location.hash.startsWith("#online/")) {
        document.getElementById("resetbtn").style.display = "none";
    }

    if (location.hash === "#/train") {
        location.href = "/";
    } else if (location.hash.startsWith("#online/")) {
        document.title = "Online Game | Rock Paper Scissors | Minteck Arcade";
    } else if (location.hash === "#/auto") {
        location.href = "/";
    } else {
        location.href = "/";
    }
});

rps = {
    action: {
        ROCK: 1,
        PAPER: 2,
        SCISSORS: 3
    },
    state: {
        WIN: 1,
        LOSE: 2,
        NONE: 3
    }
}

function checkWinner() {
    document.getElementById("counter-left-total").innerText = (document.getElementById("counter-left-total").innerText - 1 + 2).toString();
    document.getElementsByClassName("picked")[0].children[0].style.opacity = "1";
    document.getElementsByClassName("picked")[0].children[0].style.filter = "";
    disableGame();

    me = (Array.from(document.querySelectorAll("table#game td")).filter(i => i.id.substring(1) - 1 + 1 > 3 && i.style.opacity === "1")[0].id.substring(1) - 1 + 1) - 3;
    other = document.getElementsByClassName("picked")[0].id.substring(1) - 1 + 1;

    let state = rps.state.NONE;

    if (me === rps.action.ROCK && other === rps.action.ROCK) state = rps.state.NONE;
    if (me === rps.action.PAPER && other === rps.action.PAPER) state = rps.state.NONE;
    if (me === rps.action.SCISSORS && other === rps.action.SCISSORS) state = rps.state.NONE;
    if (me === rps.action.ROCK && other === rps.action.PAPER) state = rps.state.LOSE;
    if (me === rps.action.ROCK && other === rps.action.SCISSORS) state = rps.state.WIN;
    if (me === rps.action.PAPER && other === rps.action.SCISSORS) state = rps.state.LOSE;
    if (me === rps.action.PAPER && other === rps.action.ROCK) state = rps.state.WIN;
    if (me === rps.action.SCISSORS && other === rps.action.ROCK) state = rps.state.LOSE;
    if (me === rps.action.SCISSORS && other === rps.action.PAPER) state = rps.state.WIN;

    if (state === rps.state.WIN) {
        document.getElementById("counter-left-win").innerText = (document.getElementById("counter-left-win").innerText - 1 + 2).toString();
        document.getElementById("last-games").innerText = "Played with " + window.peerName + "\nGame ended, you won.";
    } else if (state === rps.state.LOSE) {
        document.getElementById("counter-left-lose").innerText = (document.getElementById("counter-left-lose").innerText - 1 + 2).toString();
        document.getElementById("last-games").innerText = "Played with " + window.peerName + "\nGame ended, you lost.";
    } else {
        document.getElementById("last-games").innerText = "Played with " + window.peerName + "\nGame ended, that's a draw.";
    }
}