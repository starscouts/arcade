const WebSocket = require('ws');
const server = new WebSocket.Server({
    port: 25432
});

let games = {};

server.on('connection', function(socket, req) {
    socket.address = req.socket.remoteAddress;
    socket.room = null;
    socket.host = null;

    socket.on('close', () => {
        if (socket.room) {
            try {
                games[socket.room][0].socket.send(JSON.stringify({error:"PEER_LEFT"}));
                games[socket.room][1].socket.send(JSON.stringify({error:"PEER_LEFT"}));
            } catch (e) {}
            delete games[socket.room];
        }
    })

    socket.on('message', function(msg) {
        let data;
        try {
            data = JSON.parse(msg);
        } catch (e) {
            socket.send(JSON.stringify({error:"INVALID_DATA"}));
            return;
        }

        try {
            if (data.action) {
                switch (data.action) {
                    case "ready":
                        games[socket.room][1].socket.send(JSON.stringify({
                            notification: {
                                name: "GAME_READY",
                                message: {
                                    name: games[socket.room][0].name
                                }
                            }
                        }));
                        break;

                    case "reset":
                        games[socket.room][0].socket.send(JSON.stringify({
                            notification: {
                                name: "GAME_RESET",
                                message: null
                            }
                        }));
                        games[socket.room][0].socket.send(JSON.stringify({
                            notification: {
                                name: "YOUR_TURN",
                                message: true
                            }
                        }));

                        games[socket.room][1].socket.send(JSON.stringify({
                            notification: {
                                name: "GAME_RESET",
                                message: null
                            }
                        }));
                        games[socket.room][1].socket.send(JSON.stringify({
                            notification: {
                                name: "YOUR_TURN",
                                message: false
                            }
                        }));

                        break;

                    case "place":
                        games[socket.room][socket.host ? 1 : 0].socket.send(JSON.stringify({
                            notification: {
                                name: "CELL_PLACE",
                                message: {
                                    name: data.position,
                                    host: !socket.host
                                }
                            }
                        }));
                        break;

                    case "init":
                        if (!data.room || !data.player) {
                            socket.send(JSON.stringify({error:"MISSING_OPERAND"}));
                            return;
                        }

                        if (!games[data.room]) {
                            games[data.room] = [
                                {
                                    name: data.player,
                                    address: socket.address,
                                    socket: socket
                                },
                                null
                            ]
                            socket.room = data.room;
                            socket.host = true;

                            socket.send(JSON.stringify({result:{name:"CONNECTION_ESTABLISHED",player:0}}));
                        } else if (!games[data.room][1] || games[data.room][1] === null) {
                            data.player = data.player.replaceAll("<", "-").replaceAll(">", "-").replaceAll("&", "-")

                            games[data.room][1] = {
                                name: data.player,
                                address: socket.address,
                                socket: socket
                            }
                            socket.room = data.room;
                            socket.host = false;

                            games[data.room][0].socket.send(JSON.stringify({notification:{name:"PEER_JOIN",message:{name:data.player,address:socket.address}}}));
                            socket.send(JSON.stringify({result:{player:1}}));

                            break;
                        } else {
                            socket.send(JSON.stringify({error:"ROOM_FULL"}));
                            break;
                        }

                        console.log(games);

                        break;
                    default:
                        socket.send(JSON.stringify({error:"INVALID_ACTION"}));
                        break;
                }
            } else {
                socket.send(JSON.stringify({error:"MISSING_OPERAND"}));
            }
        } catch (e) {
            console.log(e);
            socket.send(JSON.stringify({error:"INTERNAL_ERROR"}));
        }
    });
});