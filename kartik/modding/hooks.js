const { dialog } = require('electron');
const fs = require('fs');

function hook_Music(mod, type, hname) {
    hook = mod["Hook"][hname];
    names = Object.keys(hook);

    for (i in names) {
        name = names[i];
        if (name !== "Music.Start" && name !== "Music.Prepare" && name !== "Music.Title" && name !== "Music.Credits" && name !== "Music.Win" && name !== "Music.Game1" && name !== "Music.Game2" && name !== "Music.Game3" && name !== "Music.Game4" && name !== "Music.Game5" && name !== "Music.Game6" && name !== "Music.Game7" && name !== "Music.Game8" && name !== "Music.Game9" && name !== "Music.Menu") {
            dialog.showMessageBoxSync(
                {
                    type: "error",
                    title: "KMP Mod Loader",
                    message: "On package " + item + ": hook " + hname + " (" + type + "): invalid hook data, EXITING"
                }
            )
            process.exit(2);
        } else {
            switch (name) {
                case "Music.Start":
                    resources.music['start'].file = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    resources.music['start'].original = false;
                    break;
                case "Music.Title":
                    resources.music['title'].file = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    resources.music['title'].original = false;
                    break;
                case "Music.Menu":
                    resources.music['title'].file = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    resources.music['title'].original = false;
                    break;
                case "Music.Credits":
                    resources.music['credits'].file = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    resources.music['credits'].original = false;
                    break;
                case "Music.Win":
                    resources.music['win'].file = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    resources.music['win'].original = false;
                    break;
                case "Music.Prepare":
                    resources.music['prepare'].file = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    resources.music['prepare'].original = false;
                    break;
                case "Music.Game1":
                    resources.music['game1'].file = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    resources.music['game1'].original = false;
                    break;
                case "Music.Game2":
                    resources.music['game2'].file = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    resources.music['game2'].original = false;
                    break;
                case "Music.Game3":
                    resources.music['game3'].file = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    resources.music['game3'].original = false;
                    break;
                case "Music.Game4":
                    resources.music['game4'].file = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    resources.music['game4'].original = false;
                    break;
                case "Music.Game5":
                    resources.music['game5'].file = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    resources.music['game5'].original = false;
                    break;
                case "Music.Game6":
                    resources.music['game6'].file = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    resources.music['game6'].original = false;
                    break;
                case "Music.Game7":
                    resources.music['game7'].file = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    resources.music['game7'].original = false;
                    break;
                case "Music.Game8":
                    resources.music['game8'].file = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    resources.music['game8'].original = false;
                    break;
                case "Music.Game9":
                    resources.music['game9'].file = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    resources.music['game9'].original = false;
                    break;
            }
        }
    }
}

function hook_SoundFX(mod, type, hname) {
    hook = mod["Hook"][hname];
    names = Object.keys(hook);

    for (i in names) {
        name = names[i];
        if (name !== "SFX.Click" && name !== "SFX.Crash" && name !== "SFX.Intro" && name !== "SFX.Last" && name !== "SFX.Menu" && name !== "SFX.Pass" && name !== "SFX.Pause" && name !== "SFX.Start" && name !== "SFX.Win") {
            dialog.showMessageBoxSync(
                {
                    type: "error",
                    title: "KMP Mod Loader",
                    message: "On package " + item + ": hook " + hname + " (" + type + "): invalid hook data, EXITING"
                }
            )
            process.exit(2);
        } else {
            switch (name) {
                case "SFX.Click":
                    resources.sfx['click'] = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    break;
                case "SFX.Crash":
                    resources.sfx['crash'] = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    break;
                case "SFX.Intro":
                    resources.sfx['intro'] = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    break;
                case "SFX.Last":
                    resources.sfx['last'] = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    break;
                case "SFX.Menu":
                    resources.sfx['menu'] = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    break;
                case "SFX.Pass":
                    resources.sfx['pass'] = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    break;
                case "SFX.Pause":
                    resources.sfx['pause'] = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    break;
                case "SFX.Start":
                    resources.sfx['start'] = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    break;
                case "SFX.Win":
                    resources.sfx['win'] = mod["_Path"] + "/" + mod["Hook"][hname][name];
                    break;
            }
        }
    }
}

function hook_Car(mod, type, hname) {
    hook = mod["Hook"][hname];
    names = Object.keys(hook);

    for (i in names) {
        name = names[i];

        if (name.startsWith("Car.")) {
            resources.cars[name.substr(4)] = mod["_Path"] + "/" + mod["Hook"][hname][name];
        } else {
            dialog.showMessageBoxSync(
                {
                    type: "error",
                    title: "KMP Mod Loader",
                    message: "On package " + item + ": hook " + hname + " (" + type + "): invalid hook data, EXITING"
                }
            )
            process.exit(2);
        }
    }
}

function hook_Circuit(mod, type, hname) {
    hook = mod["Hook"][hname];
    names = Object.keys(hook);

    for (i in names) {
        name = names[i];

        if (name.startsWith("Circuit.")) {
            resources.races[name.substr(4)] = mod["_Path"] + "/" + mod["Hook"][hname][name] + ".html";
        } else {
            dialog.showMessageBoxSync(
                {
                    type: "error",
                    title: "KMP Mod Loader",
                    message: "On package " + item + ": hook " + hname + " (" + type + "): invalid hook data, EXITING"
                }
            )
            process.exit(2);
        }
    }
}

function hook_API(mod, type, hname) {
    console.log(" * KMP-API TypeScript engine: " + item + "$" + hname)
    hook = mod["Hook"][hname];
    names = Object.keys(hook);

    for (i in names) {
        name = names[i];

        if (name === "API.Includes") {
            if (fs.existsSync(mod["_Path"] + "/" + mod["Hook"][hname][name])) {
                if (fs.statSync(mod["_Path"] + "/" + mod["Hook"][hname][name]).isDirectory()) {
                    flist = fs.readdirSync(mod["_Path"] + "/" + mod["Hook"][hname][name]);
                    for (file of flist) {
                        if (file.endsWith(".ts")) {
                            importedTypeScriptFiles.push({
                                file: mod["_Path"] + "/" + mod["Hook"][hname][name] + "/" + file,
                                pkg: item,
                                output: item + "--" + file + ".js"
                            });
                        }
                    }
                } else {
                    importedTypeScriptFiles.push({
                        file: mod["_Path"] + "/" + mod["Hook"][hname][name],
                        pkg: item,
                        output: item + "--" + mod["Hook"][hname][name] + ".js"
                    });
                }
            } else {
                dialog.showMessageBoxSync(
                    {
                        type: "error",
                        title: "KMP Mod Loader",
                        message: "On package " + item + ": KMP-API includes " + mod["Hook"][hname][name] + " (" + mod["_Path"] + "/" + mod["Hook"][hname][name] + "): no such file or directory, EXITING"
                    }
                )
                process.exit(2);
            }
        } else {
            dialog.showMessageBoxSync(
                {
                    type: "error",
                    title: "KMP Mod Loader",
                    message: "On package " + item + ": hook " + hname + " (" + type + "): invalid hook data, EXITING"
                }
            )
            process.exit(2);
        }
    }
}

module.exports = (mod, type, name) => {
    hook = mod["Hook"][name];

    if (type !== "Kartik.Music" && type !== "Kartik.SoundFX" && type !== "Kartik.Circuit" && type !== "Kartik.Car" && type !== "Kartik.API") {
        dialog.showMessageBoxSync(
            {
                type: "error",
                title: "KMP Mod Loader",
                message: "On package " + item + ": invalid hook type, EXITING"
            }
        )
        process.exit(2);
    }

    switch (type) {
        case "Kartik.Music":
            hook_Music(mod, type, name);
            break;
        case "Kartik.SoundFX":
            hook_SoundFX(mod, type, name);
            break;
        case "Kartik.Car":
            hook_Car(mod, type, name);
            break;
        case "Kartik.Circuit":
            hook_Circuit(mod, type, name);
            break;
        case "Kartik.API":
            hook_API(mod, type, name);
            break;
    }
}
