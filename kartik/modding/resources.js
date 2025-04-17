const fs = require('fs');

global.resources = {
    music: {},
    sfx: {},
    races: {},
    cars: {},
    scenario: {
        voice: {},
        averi: {}
    }
};

music_list = fs.readdirSync("./music");
for (index in music_list) {
    music = music_list[index];
    name = music.split(".")[0];
    resources.music[name] = {
        file: KartikRoot + "/music/" + music,
        original: true
    };
}

sfx_list = fs.readdirSync("./sfx");
for (index in sfx_list) {
    sfx = sfx_list[index];
    name = sfx.split(".")[0];
    if (sfx.split(".")[1] === "mp3") {
        resources.sfx[name] = KartikRoot + "/sfx/" + sfx;
    }
}

races_list = fs.readdirSync("./race/circuits");
for (index in races_list) {
    races = races_list[index];
    name = races.split(".")[0];
    if (races.split(".")[1] === "html") {
        resources.races[name] = "./race/circuits/" + races;
    }
}

cars_list = fs.readdirSync("./race/models");
for (index in cars_list) {
    cars = cars_list[index];
    name = cars.split(".")[0];
    resources.cars[name] = KartikRoot + "/race/models/" + cars;
}

scvoice_list = fs.readdirSync("./scenario/voice");
for (index in scvoice_list) {
    scvoice = scvoice_list[index];
    name = scvoice.split(".")[0];
    resources.scenario.voice[name] = KartikRoot + "/scenario/voice/" + scvoice;
}

scchar_list = fs.readdirSync("./scenario/character");
for (index in scchar_list) {
    scchar = scchar_list[index];
    name = scchar.split(".")[0];
    resources.scenario.averi[name] = KartikRoot + "/scenario/character/" + scchar;
}

if (typeof building !== "undefined" && building) {
    global.targetResources = JSON.stringify(resources);
}
