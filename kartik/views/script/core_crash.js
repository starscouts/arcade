global.gameCrashed = false;
crashSound = new Audio("./sfx/gamecrash.wav");

function destroy() {
    global.gameCrashed = true;
    crashSound.play();
    document.getElementById("wb").outerHTML = "";
    try { musicElement.pause(); } catch (e) {}
}

function spawnError(crashReport) {
    document.getElementById("error-outer").style.display = "flex";
    document.getElementById("crash-dump").value = crashReport;
    destroy();
}