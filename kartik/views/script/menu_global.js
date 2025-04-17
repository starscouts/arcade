let menuOpen = true;

if (native) {global.$ = require('jquery');} else {var script = document.createElement('script');script.src = '../webinit/jquery.js';script.type = 'text/javascript';document.getElementsByTagName('head')[0].appendChild(script);}
$("#box").fadeOut(0);
window.addEventListener('load', () => {
    setTimeout(() => {
        $("#box").fadeIn(500);
    }, 1000)
})

$("body").focus();
keysEnabled = true;
$(document).keydown(function(e) {
    if (loggingIn) { return; }

    if (keysEnabled) {
        if (e.ctrlKey && e.keyCode === 13) { // ctrl+enter
            throw new RangeError("Manually initiated crash");
        }
        if (e.keyCode === 13 || e.keyCode === 88 || e.keyCode === 32) { // enter
            if ($(".services").is(":visible")) {
                selectOption();
            } else {
                $(".services").show();
            }
            menuOpen = !menuOpen;
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
            keysEnabled = false;
            Sound.click();
            setTimeout(() => {
                require('@electron/remote').getCurrentWindow().close();
            }, 250)
        }
    }
});

function selectOption() {
    item = document.querySelector(".selected a").id;
    Sound.click();

    switch (item) {
        case 'single':
            scenar("start", "happy");
            keysEnabled = false;
            window.parent.musicManager.fadeMusic();
            $("#box").fadeOut(500);
            setTimeout(() => {
                info("MenuWindow", "Switching control to GameWindow");
                location.href = "game.html?sp";
            }, 1000)
            break;
        case 'online':
            keysEnabled = false;
            window.parent.musicManager.fadeMusic();
            $("#box").fadeOut(500);
            setTimeout(() => {
                info("MenuWindow", "Switching control to GameWindow");
                location.href = "game.html?online";
            }, 1000)
            break;
        case 'play':
            keysEnabled = false;
            window.parent.musicManager.fadeMusic();
            $("#box").fadeOut(500);
            setTimeout(() => {
                info("MenuWindow", "Switching control to GameWindow");
                location.href = "game.html";
            }, 1000)
            break;
        case 'settings':
            keysEnabled = false;
            $("#box").fadeOut(500);
            setTimeout(() => {
                info("MenuWindow", "Switching control to OptnWindow");
                location.href = "settings.html";
            }, 1000)
            break;
        case 'stats':
            keysEnabled = false;
            window.parent.musicManager.fadeMusic();
            $("#box").fadeOut(500);
            setTimeout(() => {
                info("MenuWindow", "Switching control to OptnWindow");
                location.href = "stats.html";
            }, 1000)
            break;
        case 'credits':
            keysEnabled = false;
            window.parent.musicManager.fadeMusic();
            $("#box").fadeOut(500);
            setTimeout(() => {
                info("MenuWindow", "Switching control to OptnWindow");
                location.href = "credits.html";
            }, 1000)
            break;
        case 'quit':
            keysEnabled = false;
            window.parent.musicManager.fadeMusic();
            info("MenuWindow", "Quitting game");
            Sound.click();
            setTimeout(() => {
                window.parent.location.href = "/";
            }, 250)
            break;
    }
}