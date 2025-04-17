$("#box").fadeOut(0);
$("#bg").fadeOut(0);
setTimeout(() => {
    $("#box").fadeIn(500);
    $("#bg").fadeIn(500);
}, 200)

global.startgame = () => {
    keysEnabled = true;
    $("#credits").fadeOut(200)
    Sound.intro();

    setTimeout(() => {
        started = true;
    }, 1700)

    setTimeout(() => {
        if (location.search === "?sp") {
            enableAI();
        }
    }, 1200)
}

startHooks.push(() => {
    global.hitshow = false;
    global.started = false;
    keysEnabled = false;

    $("body").focus();

    if (!online) {
        setTimeout(startgame, 7000)
    }

    if (online && role === "host") {
        setTimeout(() => {
            clientWriter(JSON.stringify({
                _type: "ipc",
                action: "gameIsReady",
                message: null
            }) + "|")
            startgame();
        }, 7000)
    }
})