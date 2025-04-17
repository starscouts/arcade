startHooks.push(() => {
    $(document).keydown(function(e) {
        if (online && role === null) {
            if (e.keyCode === 27 || e.keyCode === 8) { // esc
                window.parent.musicManager.fadeMusic();
                $("body").fadeOut(200);
                setTimeout(() => {
                    location.href = "menu.html?back";
                }, 250)
            }
        }
        if (keysEnabled) {
            if (!paused) {
                if (e.keyCode === 115) { // F4
                    if (hitshow) {
                        hitshow = false;
                        document.getElementById("circuit").classList.remove("hitboxes");
                        document.getElementById('hitboxes').innerText = lang.game.gpause.showhb;
                        info("GameWindow", "Hitboxes hidden");
                    } else {
                        hitshow = true;
                        document.getElementById("circuit").classList.add("hitboxes");
                        document.getElementById('hitboxes').innerText = lang.game.gpause.hidehb;
                        info("GameWindow", "Hitboxes shown");
                    }
                }

                // Car 0
                if (car0collisionon) {
                    if (e.keyCode === 90 || e.keyCode === 87 || ((location.search === "?sp" || location.search === "?online") && e.keyCode === 38)) { // Z
                        if (car0cspeed < car0speed) {
                            car0cspeed = car0cspeed + 0.2;
                        }
                        if (document.getElementById("car0").style.transform !== "rotate(-90deg)") {
                            // { catalog: "ingame", key: "turns", add: 1 });
                            document.getElementById("car0").style.transform = "rotate(-90deg)";
                            car0collisionon = false;
                            setTimeout(() => {
                                car0collisionon = true;
                            }, 500)
                        }
                    }
                    if (e.keyCode === 83 || ((location.search === "?sp" || location.search === "?online") && e.keyCode === 40)) { // S
                        if (car0cspeed < car0speed) {
                            car0cspeed = car0cspeed + 0.2;
                        }
                        if (document.getElementById("car0").style.transform !== "rotate(90deg)") {
                            // { catalog: "ingame", key: "turns", add: 1 });
                            document.getElementById("car0").style.transform = "rotate(90deg)";
                            car0collisionon = false;
                            setTimeout(() => {
                                car0collisionon = true;
                            }, 500)
                        }
                    }
                    if (e.keyCode === 81 || e.keyCode === 65 || ((location.search === "?sp" || location.search === "?online") && e.keyCode === 37)) { // Q
                        if (car0cspeed < car0speed) {
                            car0cspeed = car0cspeed + 0.2;
                        }
                        if (document.getElementById("car0").style.transform !== "rotate(180deg)") {
                            // { catalog: "ingame", key: "turns", add: 1 });
                            document.getElementById("car0").style.transform = "rotate(180deg)";
                            car0collisionon = false;
                            setTimeout(() => {
                                car0collisionon = true;
                            }, 500)
                        }
                    }
                    if (e.keyCode === 68 || ((location.search === "?sp" || location.search === "?online") && e.keyCode === 39)) { // D
                        if (car0cspeed < car0speed) {
                            car0cspeed = car0cspeed + 0.2;
                        }
                        if (document.getElementById("car0").style.transform !== "rotate(0deg)") {
                            // { catalog: "ingame", key: "turns", add: 1 });
                            document.getElementById("car0").style.transform = "rotate(0deg)";
                            car0collisionon = false;
                            setTimeout(() => {
                                car0collisionon = true;
                            }, 500)
                        }
                    }
                }

                // Car 1
                if (car1collisionon) {
                    if (location.search !== "?sp" && location.search !== "?online") {
                        if (e.keyCode === 38) { // up
                            if (car1cspeed < car1speed) {
                                car1cspeed = car1cspeed + 0.2;
                            }
                            if (document.getElementById("car1").style.transform !== "rotate(-90deg)") {
                                document.getElementById("car1").style.transform = "rotate(-90deg)";
                                car1collisionon = false;
                                setTimeout(() => {
                                    car1collisionon = true;
                                }, 500)
                            }
                        }
                        if (e.keyCode === 40) { // down
                            if (car1cspeed < car1speed) {
                                car1cspeed = car1cspeed + 0.2;
                            }
                            if (document.getElementById("car1").style.transform !== "rotate(90deg)") {
                                document.getElementById("car1").style.transform = "rotate(90deg)";
                                car1collisionon = false;
                                setTimeout(() => {
                                    car1collisionon = true;
                                }, 500)
                            }
                        }
                        if (e.keyCode === 37) { // left
                            if (car1cspeed < car1speed) {
                                car1cspeed = car1cspeed + 0.2;
                            }
                            if (document.getElementById("car1").style.transform !== "rotate(180deg)") {
                                document.getElementById("car1").style.transform = "rotate(180deg)";
                                car1collisionon = false;
                                setTimeout(() => {
                                    car1collisionon = true;
                                }, 500)
                            }
                        }
                        if (e.keyCode === 39) { // right
                            if (car1cspeed < car1speed) {
                                car1cspeed = car1cspeed + 0.2;
                            }
                            if (document.getElementById("car1").style.transform !== "rotate(0deg)") {
                                document.getElementById("car1").style.transform = "rotate(0deg)";
                                car1collisionon = false;
                                setTimeout(() => {
                                    car1collisionon = true;
                                }, 500)
                            }
                        }
                    }
                }
                if (e.keyCode === 27 || e.keyCode === 8) { // esc
                    pause(true);
                }
            } else {
                if (e.keyCode === 13 || e.keyCode === 88 || e.keyCode === 32 || e.keyCode === 16) { // enter
                    if ($(".services").is(":visible")) {
                        selectOption();
                    } else {
                        $(".services").show();
                    }
                }
                if (e.keyCode === 38 || e.keyCode === 90) { // up
                    Sound.menu();
                    var selected = $(".selected");
                    $(".services li").removeClass("selected");
                    if (selected.prev().length === 0) {
                        selected.siblings().last().addClass("selected");
                    } else {
                        selected.prev().addClass("selected");
                    }
                }
                if (e.keyCode === 40 || e.keyCode === 83) { // down
                    Sound.menu();
                    var selected = $(".selected");
                    $(".services li").removeClass("selected");
                    if (selected.next().length === 0) {
                        selected.siblings().first().addClass("selected");
                    } else {
                        selected.next().addClass("selected");
                    }
                }
                if (e.keyCode === 27 || e.keyCode === 8) { // esc
                    pause(false);
                }
            }
        }
    });
})