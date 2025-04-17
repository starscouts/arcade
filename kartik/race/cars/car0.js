startHooks.push(() => {
    car0speed            = 16;
    car0cspeed           = 0;
    if (online && role === "guest") {
        car0startx       = 388.9;
        car0starty       = 79.4;
    } else {
        car0startx       = 428;
        car0starty       = 42.9;
    }
    car0collisionon      = true;
    car0enableOOBChecker = false;

// Collision Manager
    function car0collision() {
        if (!keysEnabled) { return; }

        if (started) {
            carshb = document.getElementById("car0").getBoundingClientRect();
            hitbox = document.getElementById("barrier").getBoundingClientRect();

            var overlap = !(carshb.right < hitbox.left ||
                carshb.left > hitbox.right ||
                carshb.bottom < hitbox.top ||
                carshb.top > hitbox.bottom)

            if (overlap) {
                info("CarManager:car0", "Reversal prevented at X " + document.getElementById("car0").style.left + ", Y " + document.getElementById("car0").style.top);
                document.getElementById("car0").style.left = car0startx + "px";
                document.getElementById("car0").style.top = car0starty + "px";
                document.getElementById("car0").style.transform = "rotate(0deg)";
                car0cspeed = 0;
            }
        }

        if (!car0collisionon) { return; }

        walls = Array.from(document.getElementsByClassName("wall"));

        walls.forEach((wall) => {
            carshb = document.getElementById("car0").getBoundingClientRect();
            hitbox = wall.getBoundingClientRect();

            var overlap = !(carshb.right < hitbox.left ||
                carshb.left > hitbox.right ||
                carshb.bottom < hitbox.top ||
                carshb.top > hitbox.bottom)

            if (overlap) {
                info("CarManager:car0", "Wall collision at X " + document.getElementById("car0").style.left + ", Y " + document.getElementById("car0").style.top);
                if (location.search === "?sp") {
                    scenar("wall1", "happy");
                }
                Sound.crash()
                document.getElementById("car0").style.left = car0startx + "px";
                document.getElementById("car0").style.top = car0starty + "px";
                // { catalog: "ingame", key: "walls", add: 1 });
                Array.from(document.getElementById('oil').children).forEach((item) => {
                    spreadOil(item);
                })
                document.getElementById("car0").style.transform = "rotate(0deg)";
                car0cspeed = 0;
            }
        })

        Array.from(document.getElementById('oil').children).forEach((item) => {
            carshb = document.getElementById("car0").getBoundingClientRect();
            hitbox = item.getBoundingClientRect();

            var overlap = !(carshb.right < hitbox.left ||
                carshb.left > hitbox.right ||
                carshb.bottom < hitbox.top ||
                carshb.top > hitbox.bottom)

            if (overlap) {
                car0cspeed = 7;
            }
        })

        carshb = document.getElementById("car0").getBoundingClientRect();
        hitbox = document.getElementById("arrival").getBoundingClientRect();

        var overlap = !(carshb.right < hitbox.left ||
            carshb.left > hitbox.right ||
            carshb.bottom < hitbox.top ||
            carshb.top > hitbox.bottom)

        if (overlap && started) {
            started = false;
            if ((document.getElementById('laps-car0').innerText.split("/")[0] - 1 + 1) < 4) {
                info("CarManager:car0", "New lap");
                Array.from(document.getElementById('oil').children).forEach((item) => {
                    spreadOil(item);
                })
                if ((document.getElementById('laps-car0').innerText.split("/")[0] - 1 + 1) < 3) {
                    Sound.pass()
                } else {
                    Sound.last()
                }
                // { catalog: "ingame", key: "laps", add: 1 });
                document.getElementById('laps-car0').innerText = (document.getElementById('laps-car0').innerText.split("/")[0] - 1 + 2).toString();
                if (location.search === "?sp") {
                    if ((document.getElementById('laps-car0').innerText.split("/")[0] - 1 + 1) > (document.getElementById('laps-car1').innerText.split("/")[0] - 1 + 1)) {
                        scenar("ahead1", "angry");
                    } else {
                        scenar("ahead2", "happy");
                    }
                }
            } else {
                info("CarManager:car0", "Car won the game");
                // { catalog: "results", key: "wins", add: 1 });
                if (location.search === "?sp") {
                    scenar("won1", "sad");
                }
                
                Sound.win();
                keysEnabled = false;
                car0cspeed = 0;
                car0speed = 0;
                document.getElementById('laps-car0').innerText = (document.getElementById('laps-car0').innerText.split("/")[0] - 1 + 2).toString();
                $("#box").fadeOut(500);
                setTimeout(() => {
                    if (online) {
                        clientWriter(JSON.stringify({
                            _type: "ipc",
                            action: "progressLose",
                            message: null
                        }) + "|")
                    }
                    if (location.search === "?sp" || online) {
                        location.href = "win.html?sp#car0";
                    } else {
                        location.href = "win.html#car0";
                    }
                }, 3500)
            }
            document.getElementById("car0").style.left = car0startx + "px";
            document.getElementById("car0").style.top = car0starty + "px";
            document.getElementById("car0").style.transform = "rotate(0deg)";
            Array.from(document.getElementById('oil').children).forEach((item) => {
                spreadOil(item);
            })
            car0cspeed = 0;
            setTimeout(() => {
                started = true;
            }, 150)
        }

        carshb = document.getElementById("car0").getBoundingClientRect();
        hitbox = document.getElementById("car1").getBoundingClientRect();

        var overlap = !(carshb.right < hitbox.left ||
            carshb.left > hitbox.right ||
            carshb.bottom < hitbox.top ||
            carshb.top > hitbox.bottom)

        if (overlap) {
            if (location.search === "?sp") {
                scenar("wall1", "happy");
            }
            Sound.crash();
            // { catalog: "ingame", key: "walls", add: 1 });
            document.getElementById("car0").style.left = car0startx + "px";
            document.getElementById("car0").style.top = car0starty + "px";
            Array.from(document.getElementById('oil').children).forEach((item) => {
                spreadOil(item);
            })
            document.getElementById("car0").style.transform = "rotate(0deg)";
            car0cspeed = 0;
        }
    }

// General Movements
    setInterval(() => {
        if (!paused) {
            if (car0cspeed > 0) {
                car0cspeed = car0cspeed - 0.1;
            }
            switch (document.getElementById("car0").style.transform) {
                case "rotate(0deg)":
                    document.getElementById("car0").style.left = ((document.getElementById("car0").style.left.split("p")[0] - 1) + (1 + car0cspeed)) + "px";
                    break;
                case "rotate(180deg)":
                    document.getElementById("car0").style.left = ((document.getElementById("car0").style.left.split("p")[0] - 1) - (1 + car0cspeed)) + "px";
                    break;
                case "rotate(90deg)":
                    document.getElementById("car0").style.top = ((document.getElementById("car0").style.top.split("p")[0] - 1) + (1 + car0cspeed)) + "px";
                    break;
                case "rotate(-90deg)":
                    document.getElementById("car0").style.top = ((document.getElementById("car0").style.top.split("p")[0] - 1) - (1 + car0cspeed)) + "px";
                    break;
            }
            if (document.getElementById("car0").style.left.split("p")[0] - 1 + 1 > (window.innerWidth - 30)) {
                warn("CarManager:car0", "Colliding with screen border");
                document.getElementById("car0").style.left = (window.innerWidth - 30) + "px";
            }
            if (document.getElementById("car0").style.top.split("p")[0] - 1 + 1 > (window.innerHeight - 30)) {
                warn("CarManager:car0", "Colliding with screen border");
                document.getElementById("car0").style.top = (window.innerHeight - 30) + "px";
            }
            if (document.getElementById("car0").style.top.split("p")[0] - 1 + 1 < 30) {
                warn("CarManager:car0", "Colliding with screen border");
                document.getElementById("car0").style.top = "30px";
            }
            if (document.getElementById("car0").style.left.split("p")[0] - 1 + 1 < 30) {
                warn("CarManager:car0", "Colliding with screen border");
                document.getElementById("car0").style.left = "30px";
            }
            if (car0cspeed > -0.1 && car0cspeed < 0) {
                car0cspeed = 0;
            }
            car0collision();
        }
    }, 200)

})