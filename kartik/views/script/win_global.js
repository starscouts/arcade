if (native) {global.$ = require('jquery');} else {var script = document.createElement('script');script.src = '../webinit/jquery.js';script.type = 'text/javascript';document.getElementsByTagName('head')[0].appendChild(script);}
$("#box").fadeOut(0);
setTimeout(() => {
    $("#box").fadeIn(500);
}, 200)

keysEnabled = true;
$(document).keydown(function(e) {
    if (keysEnabled) {
        if (e.keyCode === 13 || e.keyCode === 88 || e.keyCode === 32 || e.keyCode === 27 || e.keyCode === 8 || e.keyCode === 16) { // enter/esc
            Sound.click();
            window.parent.musicManager.fadeMusic();
            $("#box").fadeOut(500);
            setTimeout(() => {
                info("GWinWindow", "Switching control to MenuWindow");
                location.href = "menu.html";
            }, 3000)
        }
    }
})

info("GWinWindow", "Rendered!");