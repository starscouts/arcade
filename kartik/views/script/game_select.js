if (native) {global.$ = require('jquery');} else {var script = document.createElement('script');script.src = '../webinit/jquery.js';script.type = 'text/javascript';document.getElementsByTagName('head')[0].appendChild(script);}

startHooks.push(() => {
    function ranint(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    circuits = Object.keys(kresources.races);
    rand = circuits[Math.floor(Math.random()*circuits.length)];

    if (online && role === "host") {
        setInterval(() => {
            clientWriter(JSON.stringify({
                _type: "ipc",
                action: "RaceData:circuit",
                message: rand
            }) + "|");
        }, 100)
    }

    if (online && role === "guest") {
        rand = guestInfo.circuit;
    }

    info("GameWindow", "Selected circuit " + rand);
    document.getElementById('circuit').style.backgroundImage = "url('." + kresources.races[rand].substr(0, kresources.races[rand].length - 5).split("'").join("\\'") + ".png')";
    document.getElementById('circuit').innerHTML = $.ajax("/kartik/" + kresources.races[rand], { async: false }).responseText.toString();

    inf = JSON.parse(document.getElementsByTagName("circuit")[0].innerText);
    if (typeof inf.name[lp] === "undefined") {
        document.getElementById('race-title').innerText = inf.name.en;
    } else {
        document.getElementById('race-title').innerText = inf.name[lp];
    }
    document.getElementById('race-author').innerText = inf.author;

    i = ranint(1, 9);

    if (online && role === "host") {
        setInterval(() => {
            clientWriter(JSON.stringify({
                _type: "ipc",
                action: "RaceData:music",
                message: i
            }) + "|");
        }, 200)
    }

    if (online && role === "guest") {
        i = guestInfo.music;
    }

    global.spreadOil = (oil) => {
        rx = ranint(0, 680);
        ry = ranint(0, 490);
        rd = ranint(0, 360);
        rh = ranint(0, 360);

        oil.style.top = ry + "px";
        oil.style.left = rx + "px";
        oil.style.transform = "rotate(" + rd + "deg)";
        oil.style.filter = "hue-rotate(" + rd + "deg)";
    }

    Array.from(document.getElementById('oil').children).forEach((item) => {
        spreadOil(item);
    })

    modelsAvailable = Object.keys(kresources.cars);

    selectedModel0I = Math.floor(Math.random() * modelsAvailable.length);
    selectedModel0 = modelsAvailable[selectedModel0I];
    modelsAvailable.splice(selectedModel0I, 1);

    selectedModel1I = Math.floor(Math.random() * modelsAvailable.length);
    selectedModel1 = modelsAvailable[selectedModel1I];

    if (online && role === "host") {
        setInterval(() => {
            clientWriter(JSON.stringify({
                _type: "ipc",
                action: "RaceData:hostCar",
                message: selectedModel0
            }) + "|");
        }, 300)
        setInterval(() => {
            clientWriter(JSON.stringify({
                _type: "ipc",
                action: "RaceData:guestCar",
                message: selectedModel1
            }) + "|");
        }, 400)
    }

    if (online && role === "guest") {
        selectedModel0 = guestInfo.guestCar;
        selectedModel1 = guestInfo.hostCar;
    }

    document.getElementById("car0-img").src = kresources.cars[selectedModel0];
    document.getElementById("cars-p1-inner").src = kresources.cars[selectedModel0];
    document.getElementById("car1-img").src = kresources.cars[selectedModel1];
    document.getElementById("cars-p2-inner").src = kresources.cars[selectedModel1];
})

startHooks.push(() => {
    setInterval(() => {
        if (online) {
            clientWriter(JSON.stringify({
                _type: "ipc",
                action: "posTop",
                message: document.getElementById("car0").style.top
            }) + "|")
            clientWriter(JSON.stringify({
                _type: "ipc",
                action: "posLeft",
                message: document.getElementById("car0").style.left
            }) + "|")
            clientWriter(JSON.stringify({
                _type: "ipc",
                action: "posRot",
                message: document.getElementById("car0").style.transform
            }) + "|")
            clientWriter(JSON.stringify({
                _type: "ipc",
                action: "progressLaps",
                message: document.getElementById("laps-car0").innerText
            }) + "|")
        }
    }, 50)
})
