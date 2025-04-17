let menuOpen = true;

if (native) {global.$ = require('jquery');} else {var script = document.createElement('script');script.src = '../webinit/jquery.js';script.type = 'text/javascript';document.getElementsByTagName('head')[0].appendChild(script);}
$("#box").fadeOut(0);
setTimeout(() => {
    $("#box").fadeIn(500);
}, 200)

$("body").focus();
keysEnabled = true;
$(document).keydown(function(e) {
    if (keysEnabled) {
        if (e.keyCode === 13 || e.keyCode === 88 || e.keyCode === 32) { // enter
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
        if (e.keyCode === 68 || e.keyCode === 39 || e.keyCode === 81 || e.keyCode === 37) { // right/left
            Sound.menu();
            var selected = $(".selected");
            var id = $(".selected")[0].children[0].children[0].id;

            if (id === "lang") {
                lang = document.getElementById("setting-lang").innerText;
                slng = JSON.parse($.ajax('../lang/languages.json', { async: false }).responseText);
                slst = Object.keys(slng);
                maxl = slst.length - 1;

                ci = -1;
                ni = -1;
                slst.forEach((key, index) => {
                    if (slng[key] === lang) {
                        ci = index;
                        if (index + 1 > maxl) {
                            ni = 0;
                        } else {
                            ni = index + 1;
                        }
                    }
                })

                if (ci !== -1 && ni !== -1) {
                    document.cookie = "kartik_lang=" + slst[ni] + "; path=/";
                    document.getElementById("setting-lang").innerText = slng[slst[ni]];
                    window.parent.lp = lp = slst[ni];
                }
            }
        }
        if (e.keyCode === 27 || e.keyCode === 8) { // esc
            keysEnabled = false;
            Sound.click();
            $("#box").fadeOut(500);
            setTimeout(() => {
                info("OptnWindow", "Switching control to MenuWindow");
                location.href = "menu.html";
            }, 1000)
        }
    }
});

function selectOption() {
    item = document.querySelector(".selected a").id;
    Sound.click();

    switch (item) {
        case 'back':
            $("#box").fadeOut(500);
            setTimeout(() => {
                info("OptnWindow", "Switching control to MenuWindow");
                location.href = "menu.html?noreset";
            }, 1000)
            break;
        case 'credits':
            window.parent.musicManager.fadeMusic();
            $("#box").fadeOut(500);
            setTimeout(() => {
                info("OptnWindow", "Switching control to MenuWindow");
                location.href = "credits.html";
            }, 1000)
            break;
    }
}
