aiorient = "right";
elem = 10;

function enableAI() {
    car1enableOOBChecker = false;
    setInterval(() => {
        if (aiorient === "top") {
            ai_up();
        } else if (aiorient === "right") {
            ai_right();
        } else if (aiorient === "bottom") {
            ai_down();
        } else if (aiorient === "left") {
            ai_left();
        }
    }, 100)
    setInterval(() => {
        carshb = document.getElementById("aibox-near").getBoundingClientRect();
        hitbox = document.getElementById('barrier').getBoundingClientRect();

        var overlap = !(carshb.right < hitbox.left ||
            carshb.left > hitbox.right ||
            carshb.bottom < hitbox.top ||
            carshb.top > hitbox.bottom)

        if (overlap) {
            aiorient = "right";
        }

        if (elem < 10) { elem++; }
        if (elem !== 10) { return; }

        walls = Array.from(document.getElementsByClassName("wall"));

        walls.forEach((wall) => {
            carshb = document.getElementById("aibox-far").getBoundingClientRect();
            hitbox = wall.getBoundingClientRect();

            var overlap = !(carshb.right < hitbox.left ||
                carshb.left > hitbox.right ||
                carshb.bottom < hitbox.top ||
                carshb.top > hitbox.bottom)

            carshb2 = document.getElementById("aibox-near").getBoundingClientRect();

            var overlap2 = !(carshb2.right < hitbox.left ||
                carshb2.left > hitbox.right ||
                carshb2.bottom < hitbox.top ||
                carshb2.top > hitbox.bottom)

            if (overlap2) {
                car1speed = 8;
            } else if (overlap) {
                car1speed = 9;
            } else {
                car1speed = 16;
            }

            carshb = document.getElementById("aibox-far").getBoundingClientRect();
            hitbox = wall.getBoundingClientRect();

            var overlap = !(carshb.right < hitbox.left ||
                carshb.left > hitbox.right ||
                carshb.bottom < hitbox.top ||
                carshb.top > hitbox.bottom)

            if (overlap) {
                if (aiorient === "top") {
                    aiorient = "right";
                    elem = 0;
                } else if (aiorient === "right") {
                    aiorient = "bottom";
                    elem = 0;
                } else if (aiorient === "bottom") {
                    aiorient = "left";
                    elem = 0;
                } else if (aiorient === "left") {
                    aiorient = "top";
                    elem = 0;
                }
            }

            carshb = document.getElementById("aibox-near").getBoundingClientRect();
            hitbox = document.getElementById('car0').getBoundingClientRect();

            var overlap = !(carshb.right < hitbox.left ||
                carshb.left > hitbox.right ||
                carshb.bottom < hitbox.top ||
                carshb.top > hitbox.bottom)

            if (overlap) {
                if (aiorient === "top") {
                    aiorient = "bottom";
                    elem = 0;
                } else if (aiorient === "right") {
                    aiorient = "left";
                    elem = 0;
                } else if (aiorient === "bottom") {
                    aiorient = "top";
                    elem = 0;
                } else if (aiorient === "left") {
                    aiorient = "right";
                    elem = 0;
                }
            }
        })
    }, 50)
}

function ai_up() {
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

function ai_down() {
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

function ai_left() {
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

function ai_right() {
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