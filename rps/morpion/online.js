const onlineServer = "wss://arcade.minteck.org/tictactoe/server/prod";
let errorDisconnect = false;
let wcInterval;
let waitCount = 0;
let youPlaced = false;
let otherPlaced = false;

function reset() {
    ws.send(JSON.stringify({"action":"reset"}));
}

function online() {
    let peerName;
    document.getElementById("wait").style.display = "none";
    document.getElementById("instructions").style.display = "none";
    document.getElementById("online-credits").style.display = "block";
    document.getElementById("stats-left").style.display = "none";
    document.getElementById("last-games").innerText = "Not connected";
    document.getElementById("loader").innerText = "Connecting to server...";

    ws = new WebSocket(onlineServer);
    ws.onerror = (e) => {
        console.log(e);
        errorDisconnect = true;
        let status = "";
        switch (ws.readyState) {
            case 0:
                status = "connection is stuck";
                break;
            case 1:
                status = "connection is open (most likely a bug)";
                break;
            case 2:
                status = "connection is closing";
                break;
            case 3:
                status = "connection is closed";
                break;
        }
        document.getElementById("loader").style.display = "block";
        document.getElementById("game").style.display = "none";
        document.getElementById("loader").innerText = "Communication error: " + status;
        document.getElementById("wait").style.display = "none";
        document.getElementById("last-games").innerText = "Not connected";
    }

    ws.onopen = (e) => {
        console.log(e);
        document.getElementById("loader").innerText = "Connection established, initializing game...";
        let parts = location.hash.substring(8).split("|");
        ws.send(JSON.stringify({
            action: 'init',
            room: "rps." + atob(parts[0]),
            player: atob(parts[1])
        }))
    }

    ws.onclose = (e) => {
        console.log(e);
        document.getElementById("resetbtn").disabled = true;
        if (!errorDisconnect) {
            document.getElementById("loader").style.display = "block";
            document.getElementById("game").style.display = "none";
            document.getElementById("loader").innerText = "Connection closed";
            document.getElementById("wait").style.display = "none";
            document.getElementById("last-games").innerText = "Not connected";
        }
    }

    ws.onmessage = (e) => {
        let data = JSON.parse(e.data);
        console.log(data);

        if (data.error) {
            document.getElementById("loader").style.display = "block";
            document.getElementById("game").style.display = "none";
            document.getElementById("loader").innerText = "Server error: " + data.error;
            document.getElementById("wait").style.display = "none";
            document.getElementById("last-games").innerText = "Not connected";
            errorDisconnect = true;
            ws.close();
        }

        if (data.result && data.result.name && data.result.name === "CONNECTION_ESTABLISHED") {
            document.getElementById("loader").innerText = "Waiting for the other player... " + waitCount + "\nGame Room: " + atob(location.hash.substring(8).split("|")[0]).replaceAll("<", "&lt;").replaceAll(">", "&gt;");

            wcInterval = setInterval(() => {
                waitCount++;
                document.getElementById("loader").innerText = "Waiting for the other player... " + waitCount + "\nGame Room: " + atob(location.hash.substring(8).split("|")[0]).replaceAll("<", "&lt;").replaceAll(">", "&gt;");
            }, 1000)
        }

        if (data.notification && data.notification.name === "PEER_JOIN") {
            clearInterval(wcInterval);
            document.getElementById("resetbtn").disabled = false;

            document.getElementById("loader").innerText = "Ready!";
            ws.send(JSON.stringify({
                action: "ready"
            }));
            window.peerName = data.notification.message.name;
            document.getElementById("loader").style.display = "none";
            document.getElementById("game").style.display = "block";

            document.getElementById("last-games").innerText = "Playing with " + window.peerName + "\nIt is your turn.";
        }

        if (data.notification && data.notification.name === "GAME_READY") {
            clearInterval(wcInterval);
            document.getElementById("resetbtn").disabled = false;

            document.getElementById("loader").style.display = "none";
            document.getElementById("game").style.display = "block";
            window.peerName = data.notification.message.name;

            document.getElementById("last-games").innerText = "Playing with " + window.peerName + "\nIt is your turn.";
            trainingMain = !trainingMain;
        }

        if (data.notification && data.notification.name === "GAME_RESET") {
            el = document.getElementById("game");
            el.outerHTML = document.getElementsByClassName("game-template")[0].outerHTML;
            el = document.getElementsByClassName("game-template")[0];
            el.id = "game";
            el.classList.remove("game-template");
            el.style.display = "";
            playable = true;
            otherPlaced = false;
            youPlaced = false;
            document.getElementById("instructions").innerText = "// ML Model Training\nmodel.addTrainedGame();";
        }

        if (data.notification && data.notification.name === "CELL_PLACE") {
            document.getElementById("p" + (data.notification.message.name - 3)).classList.add("picked");
            otherPlaced = true;
            if (youPlaced) {
                checkWinner();
            }
        }

        if (data.notification && data.notification.name === "YOUR_TURN") {
            document.getElementById("wait").style.display = "none";
            document.getElementById("last-games").innerText = "Playing with " + window.peerName + "\nIt is your turn.";
            trainingMain = true;
        }
    }
}