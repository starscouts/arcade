if (native) {global.$ = require('jquery');} else {var script = document.createElement('script');script.src = '../webinit/jquery.js';script.type = 'text/javascript';document.getElementsByTagName('head')[0].appendChild(script);}
$("#box").fadeOut(0);
window.addEventListener('load', ()  => {
    setTimeout(() => {
        $("#box").fadeIn(500);
    }, 1000)
})

keysEnabled = true;
$(document).keydown(function(e) {
    if (keysEnabled) {
        if (e.keyCode === 13 || e.keyCode === 88 || e.keyCode === 32 || e.keyCode === 27 || e.keyCode === 8 || e.keyCode === 16) { // enter/esc
            kesyEnabled = false;
            $("#box").fadeOut(500);
            setTimeout(() => {
                info("GWinWindow", "Switching control to MenuWindow");
                location.href = "menu.html?noreset";
            }, 1000)
        }
    }
})