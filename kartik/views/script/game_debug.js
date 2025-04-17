global.debugshow = false;

function oil(id) {
    return "\nO" + id +": " + document.getElementById('oil' + id + '').style.left.split("px")[0] + " " + document.getElementById('oil' + id + '').style.top.split("px")[0] + " / " + document.getElementById('oil' + id + '').style.transform.split("rotate(")[1].split("deg)")[0];
}

$(document).keydown((e) => {
    if (e.keyCode === 114) { // F3
        if (debugshow) {
            global.debugshow = false;
            document.getElementById("debug").style.display = "none";
        } else {
            global.debugshow = true;
            document.getElementById("debug").style.display = "";
        }
    }
})

gpuperct = 100;

pubver = "prod";
pvpart = pubver.split(".");
if (pvpart.length === 3) {
    intver = pvpart[0] + "." + pvpart[1];
} else {
    intver = "unknown";
}

release = "official";

if (gpuperct < 25) {
    perf = "fast";
} else if (gpuperct < 50) {
    perf = "fancy";
} else {
    perf = "fabulous";
}

if (location.search === "") {
    game = "Local multiplayer game";
} else if (location.search === "?sp") {
    game = "Singleplayer game";
} else if (location.search === "?online") {
    game = "Online multiplayer game";
}

tps = -1;
cping = -1;
changedDataLeft = "playing: %false%"
changedDataRight = ""
immutableDataLeft = "Kartik " + pubver + " (" + intver + "/trunk+" + release + ")\n%tps% tps T:" + perf + ";vsync\n" + game + " @ %ping% ms ticks";
immutableDataRight = "Browser: " + navigator.userAgent;

credits = "Debug: start runtime with debug argument\nFor help: https://arcade.minteck.org/kartik"

setInterval(() => {
    if (!debugshow) { return; }


    leftparts = (immutableDataLeft + "\n" + changedDataLeft + "\n\n" + credits).split("\n");
    lefttext = "<span style='background:rgba(101,101,101,0.75);font-family: &apos;Source Code Pro&apos;, &apos;JetBrains Mono&apos;, &apos;Ubuntu Mono&apos;, &apos;Consolas&apos;, &apos;Lucida Console&apos;, &apos;Courier New&apos;, monospace;padding:1px;'>" + leftparts.join("</span><br><span style='background:rgba(101,101,101,0.75);font-family: &apos;Source Code Pro&apos;, &apos;JetBrains Mono&apos;, &apos;Ubuntu Mono&apos;, &apos;Consolas&apos;, &apos;Lucida Console&apos;, &apos;Courier New&apos;, monospace;padding:1px;'>") + "</span>";

    rightparts = (immutableDataRight + "\n" + changedDataRight).split("\n");
    righttext = "<span style='background:rgba(101,101,101,0.75);font-family: &apos;Source Code Pro&apos;, &apos;JetBrains Mono&apos;, &apos;Ubuntu Mono&apos;, &apos;Consolas&apos;, &apos;Lucida Console&apos;, &apos;Courier New&apos;, monospace;padding:1px;'>" + rightparts.join("</span><br><span style='background:rgba(101,101,101,0.75);font-family: &apos;Source Code Pro&apos;, &apos;JetBrains Mono&apos;, &apos;Ubuntu Mono&apos;, &apos;Consolas&apos;, &apos;Lucida Console&apos;, &apos;Courier New&apos;, monospace;padding:1px;'>") + "</span>";

    document.getElementById("debug-left").innerHTML = lefttext.replaceAll("%tps%", tps).replaceAll("%ping%", cping).replaceAll("%false%", "<span style='color:red;font-family: &apos;Source Code Pro&apos;, &apos;JetBrains Mono&apos;, &apos;Ubuntu Mono&apos;, &apos;Consolas&apos;, &apos;Lucida Console&apos;, &apos;Courier New&apos;, monospace;'>false</span>").replaceAll("%true%", "<span style='color:green;font-family: &apos;Source Code Pro&apos;, &apos;JetBrains Mono&apos;, &apos;Ubuntu Mono&apos;, &apos;Consolas&apos;, &apos;Lucida Console&apos;, &apos;Courier New&apos;, monospace;'>true</span>");
    document.getElementById("debug-right").innerHTML = righttext;
}, 100)

var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop;

setInterval(() => {
    if (!debugshow) { return; }

    var thisFrameTime = (thisLoop=new Date) - lastLoop;
    frameTime+= (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
}, 50)

setInterval(() => {
    if (!debugshow) { return; }

    tps = (1000/frameTime).toFixed(1);

    if (typeof ping === "number") {
        cping = ping;
    } else {
        cping = 0;
    }

    if (started) {
        changedDataLeft = "playing: %true%";
        changedDataLeft += "\n\n0$: XY: " + document.getElementById('car0').style.left.split("px")[0] + " / " + document.getElementById('car0').style.top.split("px")[0]

        c0rotate = document.getElementById('car0').style.transform.split("rotate(")[1].split("deg)")[0];
        if (c0rotate === "90") {
            changedDataLeft += "\n0$: Facing: south (Towards negative Y)";
        } else if (c0rotate === "-90") {
            changedDataLeft += "\n0$: Facing: north (Towards negative Y)";
        } else if (c0rotate === "0") {
            changedDataLeft += "\n0$: Facing: east (Towards positive X)";
        } else if (c0rotate === "180") {
            changedDataLeft += "\n0$: Facing: west (Towards negative X)";
        }

        changedDataLeft += "\n0$: Speed: A: " + car0cspeed.toFixed(2) + " R: " + (car0speed - car0cspeed).toFixed(2) + " M: " + car0speed.toFixed(2);

        changedDataLeft += "\n0$: Laps: " + document.getElementById('laps-car0').innerText + "/5";
        changedDataLeft += "\n0$: Model: " + selectedModel0;
        changedDataLeft += "\n0$: Collision: " + (car0collisionon ? "%true%" : "%false%");

        changedDataLeft += "\n\n1$: XY: " + document.getElementById('car1').style.left.split("px")[0] + " / " + document.getElementById('car1').style.top.split("px")[0]

        c0rotate = document.getElementById('car1').style.transform.split("rotate(")[1].split("deg)")[0];
        if (c0rotate === "90") {
            changedDataLeft += "\n1$: Facing: south (Towards negative Y)";
        } else if (c0rotate === "-90") {
            changedDataLeft += "\n1$: Facing: north (Towards negative Y)";
        } else if (c0rotate === "0") {
            changedDataLeft += "\n1$: Facing: east (Towards positive X)";
        } else if (c0rotate === "180") {
            changedDataLeft += "\n1$: Facing: west (Towards negative X)";
        }

        changedDataLeft += "\n1$: Speed: A: " + car1cspeed.toFixed(2) + " R: " + (car1speed - car1cspeed).toFixed(2) + " M: " + car1speed.toFixed(2);

        changedDataLeft += "\n1$: Laps: " + document.getElementById('laps-car1').innerText + "/5";
        changedDataLeft += "\n1$: Model: " + selectedModel1;
        changedDataLeft += "\n1$: Collision: " + (car1collisionon ? "%true%" : "%false%");
        changedDataLeft += "\n" + oil(0) + oil(1) + oil(2) + oil(3) + oil(4);
        changedDataLeft += "\n\nMusic: " + i;
        changedDataLeft += "\nCircuit: " + rand;

    } else {
        changedDataLeft = "playing: %false%"
    }
},100);