global.pingStart = null;
global.connecting = false;
global.role = null;
global.online = true;
global.guestInfo = {
    hostCar: null,
    guestCar: null,
    circuit: null,
    music: null
};
global.onlineInitDone = false;

function max(input) {
    if (toString.call(input) !== "[object Array]")
        return false;
    return Math.max.apply(null, input);
}

pingHistory = [];
function updatePing(ping) {
    if (ping < 100000) {
        document.getElementById('ping').innerText = ping + " ms";

        pingHistory.push(ping);
        while (pingHistory.length > 70) {
            pingHistory.shift();
        }

        dom = "";
        highest = max(pingHistory);
        pingHistory.forEach((p) => {
            high = 1
            perc = (p/highest)*100
            if (ping > 70 && ping < 150) {
                dom = dom + `<span style="display: inline-block;background: orange;width: ${high}px;height: ${perc}%;"></span>`;
            } else if (ping > 150) {
                dom = dom + `<span style="display: inline-block;background: red;width: ${high}px;height: ${perc}%;"></span>`;
            } else {
                dom = dom + `<span style="display: inline-block;background: limegreen;width: ${high}px;height: ${perc}%;"></span>`;
            }
        })

        document.getElementById('ping-chart').innerHTML = dom;
    }
}

window.addEventListener('load', () => {
    document.getElementById('credits').style.backgroundColor = "#000000";
    document.getElementById('cars-n1').innerText = lang.online.car0;
    document.getElementById('cars-n2').innerText = lang.online.car1;

    class MessageBuffer {
        constructor(delimiter) {
            this.delimiter = delimiter
            this.buffer = ""
        }

        isFinished() {
            if (
                this.buffer.length === 0 ||
                this.buffer.indexOf(this.delimiter) === -1
            ) {
                return true
            }
            return false
        }

        push(data) {
            this.buffer += data
        }

        getMessage() {
            const delimiterIndex = this.buffer.indexOf(this.delimiter)
            if (delimiterIndex !== -1) {
                const message = this.buffer.slice(0, delimiterIndex)
                this.buffer = this.buffer.replace(message + this.delimiter, "")
                return message
            }
            return null
        }

        handleData() {
            /**
             * Try to accumulate the buffer with messages
             *
             * If the server isnt sending delimiters for some reason
             * then nothing will ever come back for these requests
             */
            const message = this.getMessage()
            return message
        }
    }

    const sampleData = {
        _type: "init",
        name: "Kartik Core",
        version: require('../package.json').version,
        id: null,
        modded: false
    }

    global.clientWriter = (data) => {
        client.write(data + "\n");
    }

    function crash(e) {
        console.error(e);
        if (!quitting) {
            location.href = "online.html#" + btoa(lang.online.error.connection);
        }
    }

    var net = require('net');

    var host = require('../online/server.json').hostname;
    var port = require('../online/server.json').port;

    global.client = new net.Socket();
    client.initialized = false;

    client.connect(port, host, () => {
        console.log("Connected to " + host + ":" + port);
        clientWriter(JSON.stringify(sampleData) + "|");
        setInterval(() => {
            if (role === null) {
                clientWriter(JSON.stringify({
                    _type: "ping"
                }) + "|")
            } else {
                clientWriter(JSON.stringify({
                    _type: "ipc",
                    action: "Ping",
                    message: null
                }) + "|")
            }
            global.pingCrash = setTimeout(() => {
                location.href = "online.html#" + btoa(lang.online.timeout);
            }, 10000);
            global.pingStart = new Date();
        }, 1000)
    })

    let received = new MessageBuffer("\n")
    client.on("data", chunk => {
        received.push(chunk)
        while (!received.isFinished()) {
            const data = received.handleData()

            raw = data.toString().replaceAll("}{", "}|{");
            datas = raw.split("|").filter(i => i.trim() !== "");
            datas.forEach((data) => {
                try {
                    inf = JSON.parse(data);
                } catch (e) {
                    console.dir(data);
                    throw e;
                }

                if (typeof inf['_type'] != "string") {
                    crash(new Error("Invalid JSON data"));
                }
                if (!client.initialized) {
                    switch (inf['_type']) {
                        case "init":
                            if (inf['name'] !== "Kartik Server") {
                                crash(new Error("Invalid server"));
                            }
                            console.log("Connection initialized. Server running " + inf.name + " version " + inf.version + ", client ID " + inf.id);
                            document.getElementById("serveraddr").innerText = host + ":" + port;
                            if (inf.version.endsWith("-iridium")) {
                                document.getElementById("servername").innerText = "Iridium " + inf.version.substr(0, inf.version.length - "-iridium".length);
                                document.getElementById("servericon").src = "../logo/iridium.png";
                            } else {
                                document.getElementById("servername").innerText = "Kartik Legacy Server " + inf.version;
                                document.getElementById("servericon").src = "../logo/server.png";
                            }
                            document.getElementById('yourid').innerText = inf.id.toUpperCase();
                            document.getElementById('intro').style.display = "";
                            document.getElementById('connecting').style.display = "none";
                            document.getElementById('loading').style.display = "none";
                            client.initialized = true;
                            break;
                        case "error":
                            console.log(inf['type'] + ": " + inf['message']);
                            break;
                        default:
                            crash(new Error("Trying to receive data but client not initialized"));
                            break;
                    }
                } else {
                    switch (inf['_type']) {
                        case "init":
                            crash(new Error("Trying to initialize client but client is already initialized"));
                            break;
                        case "error":
                            console.log(inf['type'] + ": " + inf['message']);
                            location.href = "online.html#" + btoa(inf['type'] + ": " + inf['message']);
                            break;
                        case "linked":
                            console.log("Now hooked into link: (H) " + inf['ids']['host'] + " <-> " + inf['ids']['guest'] + " (G)");
                            document.getElementById('intro').style.display = "none";
                            document.getElementById('connecting').style.display = "none";
                            document.getElementById('loading').style.display = "";
                            document.getElementById('loading').innerText = lang.online.generate;
                            global.role = inf['role'];
                            if (role === "host") {
                                startHooks.forEach((hook) => {
                                    hook(this);
                                })
                                $("#online-login").fadeOut(200);
                            }
                            break;
                        default:
                            if (inf['_type'] === "ipc" && inf['action'] === "Ping") {
                                clientWriter(JSON.stringify({
                                    _type: "ipc",
                                    action: "Pong",
                                    message: null
                                }) + "|")
                                return;
                            }
                            if ((inf['_type'] === "ipc" && inf['action'] === "Pong") || inf['_type'] === "pong") {
                                pingEnd = new Date();
                                ping = Math.round(pingEnd - pingStart);
                                global.pingStart = null;
                                clearTimeout(global.pingCrash);
                                updatePing(ping);
                                return;
                            }
                            if (inf['_type'] === "ipc" && inf['action'] === "posTop") {
                                try {
                                    document.getElementById('car1').style.top = inf['message'];
                                } catch (e) {}
                                return;
                            }
                            if (inf['_type'] === "ipc" && inf['action'] === "progressLaps") {
                                try {
                                    document.getElementById("laps-car1").innerText = inf['message'];
                                } catch (e) {}
                                return;
                            }
                            if (inf['_type'] === "ipc" && inf['action'] === "progressLose") {
                                global.quitting = true;
                                location.href = "win.html?sp#car1";
                                return;
                            }
                            if (inf['_type'] === "ipc" && inf['action'] === "posLeft") {
                                try {
                                    document.getElementById('car1').style.left = inf['message'];
                                } catch (e) {}
                                return;
                            }
                            if (inf['_type'] === "ipc" && inf['action'] === "gameIsReady") {
                                startgame();
                                return;
                            }
                            if (inf['_type'] === "ipc" && inf['action'] === "abort") {
                                location.href = "online.html#" + btoa(lang.online.aborted);
                                return;
                            }
                            if (inf['_type'] === "ipc" && inf['action'] === "posRot") {
                                try {
                                    document.getElementById('car1').style.transform = inf['message'];
                                } catch (e) {}
                                return;
                            }
                            if (inf['_type'] === "ipc" && inf['action'].startsWith("RaceData:")) {
                                rd = inf['action'].substr(9);
                                switch (rd) {
                                    case "hostCar":
                                        guestInfo.hostCar = inf['message'];
                                        if (guestInfo.music !== null && guestInfo.circuit !== null && guestInfo.guestCar !== null && guestInfo.hostCar !== null && !onlineInitDone) {
                                            onlineInitDone = true;
                                            startHooks.forEach((hook) => {
                                                hook(this);
                                            })
                                            $("#online-login").fadeOut(200);
                                        }
                                        break;
                                    case "guestCar":
                                        guestInfo.guestCar = inf['message'];
                                        if (guestInfo.music !== null && guestInfo.circuit !== null && guestInfo.guestCar !== null && guestInfo.hostCar !== null && !onlineInitDone) {
                                            onlineInitDone = true;
                                            startHooks.forEach((hook) => {
                                                hook(this);
                                            })
                                            $("#online-login").fadeOut(200);
                                        }
                                        break;
                                    case "circuit":
                                        guestInfo.circuit = inf['message'];
                                        if (guestInfo.music !== null && guestInfo.circuit !== null && guestInfo.guestCar !== null && guestInfo.hostCar !== null && !onlineInitDone) {
                                            onlineInitDone = true;
                                            startHooks.forEach((hook) => {
                                                hook(this);
                                            })
                                            $("#online-login").fadeOut(200);
                                        }
                                        break;
                                    case "music":
                                        guestInfo.music = inf['message'];
                                        if (guestInfo.music !== null && guestInfo.circuit !== null && guestInfo.guestCar !== null && guestInfo.hostCar !== null && !onlineInitDone) {
                                            onlineInitDone = true;
                                            startHooks.forEach((hook) => {
                                                hook(this);
                                            })
                                            $("#online-login").fadeOut(200);
                                        }
                                        break;
                                }
                                return;
                            }
                            break;
                    }
                }
            })
        }
    })

    client.on('close', () => {
        console.log("Kicked from server");
    })

    client.on('error', (e) => {
        switch (e.code) {
            case "ECONNREFUSED":
                location.href = "online.html#" + btoa(lang.online.unable);
                break;
            default:
                location.href = "online.html#" + btoa(lang.online.internal);
                break;
        }
        crash(e);
    })

    setInterval(() => {
        if (pingStart !== null && new Date() - pingStart >= 10000) {
            location.href = "online.html#" + btoa(lang.online.timeout);
        }
    }, 50)
})

function checkOnlineLogin() {
    document.getElementById('theirid').value = document.getElementById('theirid').value.toUpperCase();
    if (/[^ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890]/gm.test(document.getElementById('theirid').value)) {
        document.getElementById('theirid').value = "";
    }
    if (document.getElementById('theirid').value.length === 8) {
        if (document.getElementById('theirid').value === document.getElementById('yourid').innerText) {
            document.getElementById('theirid').value = "";
        } else {
            if (!connecting) {
                connecting = true;
                document.getElementById('intro').style.display = "none";
                document.getElementById('connecting').style.display = "none";
                document.getElementById('loading').style.display = "";
                console.log("Linking to client " + document.getElementById('theirid').value + "...")
                clientWriter(JSON.stringify({
                    _type: "link",
                    client: document.getElementById('theirid').value.toLowerCase()
                }));
            }
        }
    }
}

$("#theirid").keydown(function(e) {
    if (e.keyCode === 27) { // esc
        $("body").fadeOut(200);
        setTimeout(() => {
            location.href = "menu.html?back";
        }, 250)
    }
})