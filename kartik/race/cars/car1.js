startHooks.push(() => {
    car1speed            = 16;
    car1cspeed           = 0;
    if (online && role === "guest") {
        car1startx       = 428;
        car1starty       = 42.9;
    } else {
        car1startx       = 388.9;
        car1starty       = 79.4;
    }
    car1collisionon = !online;
    car1enableOOBChecker = false;

// Collision Manager
    function car1collision() {
        if (!keysEnabled) { return; }

        if (started) {
            carshb = document.getElementById("car1").getBoundingClientRect();
            hitbox = document.getElementById("barrier").getBoundingClientRect();

            var overlap = !(carshb.right < hitbox.left ||
                carshb.left > hitbox.right ||
                carshb.bottom < hitbox.top ||
                carshb.top > hitbox.bottom)

            if (overlap && car1collisionon) {
                info("CarManager:car0", "Reversal prevented at X " + document.getElementById("car1").style.left + ", Y " + document.getElementById("car1").style.top);
                car1collisionon = false;
                document.getElementById("car1").style.left = car1startx + "px";
                document.getElementById("car1").style.top = car1starty + "px";
                document.getElementById("car1").style.transform = "rotate(0deg)";
                car1cspeed = 0;
                setTimeout(() => {
                    car1collisionon = true;
                }, 500)
            }
        }

        if (!car1collisionon) { return; }

        walls = Array.from(document.getElementsByClassName("wall"));

        walls.forEach((wall) => {
            carshb = document.getElementById("car1").getBoundingClientRect();
            hitbox = wall.getBoundingClientRect();

            var overlap = !(carshb.right < hitbox.left ||
                carshb.left > hitbox.right ||
                carshb.bottom < hitbox.top ||
                carshb.top > hitbox.bottom)

            if (overlap) {
                info("CarManager:car1", "Wall collision at X " + document.getElementById("car1").style.left + ", Y " + document.getElementById("car1").style.top);
                if (location.search === "?sp") {
                    scenar("wall2", "angry");
                }
                car1collisionon = false;
                Sound.crash();
                document.getElementById("car1").style.left = car1startx + "px";
                document.getElementById("car1").style.top = car1starty + "px";
                document.getElementById("car1").style.transform = "rotate(0deg)";
                Array.from(document.getElementById('oil').children).forEach((item) => {
                    spreadOil(item);
                })
                car1cspeed = 0;
                setTimeout(() => {
                    car1collisionon = true;
                }, 500)
            }
        })

        Array.from(document.getElementById('oil').children).forEach((item) => {
            carshb = document.getElementById("car1").getBoundingClientRect();
            hitbox = item.getBoundingClientRect();

            var overlap = !(carshb.right < hitbox.left ||
                carshb.left > hitbox.right ||
                carshb.bottom < hitbox.top ||
                carshb.top > hitbox.bottom)

            if (overlap) {
                car1cspeed = 5;
            }
        })

        carshb = document.getElementById("car1").getBoundingClientRect();
        hitbox = document.getElementById("car0").getBoundingClientRect();

        var overlap = !(carshb.right < hitbox.left ||
            carshb.left > hitbox.right ||
            carshb.bottom < hitbox.top ||
            carshb.top > hitbox.bottom)

        if (overlap) {
            if (location.search === "?sp") {
                scenar("wall2", "angry");
            }
            car1collisionon = false;
            Sound.crash();
            document.getElementById("car1").style.left = car1startx + "px";
            document.getElementById("car1").style.top = car1starty + "px";
            document.getElementById("car1").style.transform = "rotate(0deg)";
            Array.from(document.getElementById('oil').children).forEach((item) => {
                spreadOil(item);
            })
            car1cspeed = 0;
            setTimeout(() => {
                car1collisionon = true;
            }, 500)
        }
    }

// General Movements
    setInterval(() => {
        if (!paused) {
            if (car1cspeed > 0) {
                car1cspeed = car1cspeed - 0.1;
            }
            switch (document.getElementById("car1").style.transform) {
                case "rotate(0deg)":
                    document.getElementById("car1").style.left = ((document.getElementById("car1").style.left.split("p")[0] - 1) + (1 + car1cspeed)) + "px";
                    break;
                case "rotate(180deg)":
                    document.getElementById("car1").style.left = ((document.getElementById("car1").style.left.split("p")[0] - 1) - (1 + car1cspeed)) + "px";
                    break;
                case "rotate(90deg)":
                    document.getElementById("car1").style.top = ((document.getElementById("car1").style.top.split("p")[0] - 1) + (1 + car1cspeed)) + "px";
                    break;
                case "rotate(-90deg)":
                    document.getElementById("car1").style.top = ((document.getElementById("car1").style.top.split("p")[0] - 1) - (1 + car1cspeed)) + "px";
                    break;
            }
            if (document.getElementById("car1").style.left.split("p")[0] - 1 + 1 > (window.innerWidth - 30)) {
                warn("CarManager:car1", "Colliding with screen border");
                if (car1enableOOBChecker) {
                    document.getElementById("car1").style.left = (window.innerWidth - 30) + "px";
                }
            }
            if (document.getElementById("car1").style.top.split("p")[0] - 1 + 1 > (window.innerHeight - 30)) {
                warn("CarManager:car1", "Colliding with screen border");
                if (car1enableOOBChecker) {
                    document.getElementById("car1").style.top = (window.innerHeight - 30) + "px";
                }
            }
            if (document.getElementById("car1").style.top.split("p")[0] - 1 + 1 < 30) {
                warn("CarManager:car1", "Colliding with screen border");
                if (car1enableOOBChecker) {
                    document.getElementById("car1").style.top = "30px";
                }
            }
            if (document.getElementById("car1").style.left.split("p")[0] - 1 + 1 < 30) {
                warn("CarManager:car1", "Colliding with screen border");
                if (car1enableOOBChecker) {
                    document.getElementById("car1").style.left = "30px";
                }
            }
            if (car1cspeed > -0.1 && car1cspeed < 0) {
                car1cspeed = 0;
            }
            car1collision();
        }
    }, 200)

    setInterval(() => {
        if (!car1collisionon) { return; }

        carshb = document.getElementById("car1").getBoundingClientRect();
        hitbox = document.getElementById("arrival").getBoundingClientRect();

        var overlap = !(carshb.right < hitbox.left ||
            carshb.left > hitbox.right ||
            carshb.bottom < hitbox.top ||
            carshb.top > hitbox.bottom)

        if (overlap && started) {
            started = false;
            if ((document.getElementById('laps-car1').innerText.split("/")[0] - 1 + 1) < 4) {
                info("CarManager:car1", "New lap");
                Array.from(document.getElementById('oil').children).forEach((item) => {
                    spreadOil(item);
                })
                if ((document.getElementById('laps-car1').innerText.split("/")[0] - 1 + 1) < 3) {
                    Sound.pass()
                } else {
                    Sound.last()
                }
                document.getElementById('laps-car1').innerText = (document.getElementById('laps-car1').innerText.split("/")[0] - 1 + 2).toString();
                if (location.search === "?sp") {
                    if ((document.getElementById('laps-car0').innerText.split("/")[0] - 1 + 1) > (document.getElementById('laps-car1').innerText.split("/")[0] - 1 + 1)) {
                        scenar("ahead1", "angry");
                    } else {
                        scenar("ahead2", "happy");
                    }
                }
            } else {
                info("CarManager:car1", "Car won the game");
                if (location.search === "?sp") {
                    scenar("won2", "happy");
                }
                // { catalog: "results", key: "loses", add: 1 });
                
                Sound.win();
                keysEnabled = false;
                car1cspeed = 0;
                car1speed = 0;
                document.getElementById('laps-car1').innerText = (document.getElementById('laps-car1').innerText.split("/")[0] - 1 + 2).toString();
                $("#box").fadeOut(500);
                setTimeout(() => {
                    setTimeout(() => {
                        if (location.search === "?sp" || (online && role === "guest")) {
                            if (online) {} else {
                                location.href = "win.html?sp#car1";
                            }
                        } else {
                            location.href = "win.html#car1";
                        }
                    }, 3500)
                }, 3000)
            }
            car1collisionon = false;
            Sound.crash();
            document.getElementById("car1").style.left = car1startx + "px";
            document.getElementById("car1").style.top = car1starty + "px";
            document.getElementById("car1").style.transform = "rotate(0deg)";
            Array.from(document.getElementById('oil').children).forEach((item) => {
                spreadOil(item);
            })
            car1cspeed = 0;
            setTimeout(() => {
                car1collisionon = true;
            }, 500)
            setTimeout(() => {
                started = true;
            }, 150)
        }
    }, 20)

})