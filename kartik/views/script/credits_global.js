let menuOpen = true;

if (native) {global.$ = require('jquery');} else {var script = document.createElement('script');script.src = '../webinit/jquery.js';script.type = 'text/javascript';document.getElementsByTagName('head')[0].appendChild(script);}

keysEnabled = true;
$(document).keydown(function(e) {
    if (keysEnabled) {
        if (e.keyCode === 13 || e.keyCode === 88 || e.keyCode === 32 || e.keyCode === 27 || e.keyCode === 8 || e.keyCode === 16) { // enter/esc
            keysEnabled = false;
            Sound.click();
            window.parent.musicManager.fadeMusic();
            $("#box").fadeOut(500);
            setTimeout(() => {
                info("GWinWindow", "Switching control to MenuWindow");
                location.href = "menu.html";
            }, 1000)
        }
    }
})

var currentpos=0,alt=1,curpos1=0,curpos2=-1
function initialize(){
    $("#box").fadeIn(500);
    startit()
}
function scrollwindow(){
    if (document.all)
        temp=document.body.scrollTop
    else
        temp=window.pageYOffset
    if (alt===0)
        alt=1
    else
        alt=0
    if (alt===0)
        curpos1=temp
    else
        curpos2=temp
    if (curpos1!==curpos2){
        if (document.all)
            currentpos=document.body.scrollTop+1
        else
            currentpos=window.pageYOffset+1
        window.scroll(0,currentpos)
    }
    else{
        currentpos=0
        window.scroll(0,currentpos)
    }
}
function startit(){
    setInterval("scrollwindow()",20)
}
window.onload=initialize
