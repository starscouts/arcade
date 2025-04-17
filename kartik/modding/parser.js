const fs = require('fs');
const os = require('os');
const ini = require('ini');
const YAML = require('yaml');
const { dialog } = require('electron');
const semver = require('semver');

function unload(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

list = fs.readdirSync(homedir + "/.kartik/mods");

for (index in list) {
    item = list[index];

    if (!fs.existsSync(homedir + "/.kartik/mods/" + item + "/kartik.ini") && !fs.existsSync(homedir + "/.kartik/mods/" + item + "/kartik.yml")) {
        unload(list, item);
        dialog.showMessageBoxSync(
            {
                type: "error",
                title: "KMP Mod Loader",
                message: "On package " + item + ": no kartik.ini or kartik.yml file found"
            }
        )
    }
}

for (index in list) {
    item = list[index];

    parts = item.split(".");
    if (parts.length < 2 || parts[0].length > 5 || item.length > 49 || parts.length > 7 || !/^[a-zA-Z0-9.]*$/gm.test(item)) {
        unload(list, item);
        if (parts.length < 2) {
            dialog.showMessageBoxSync(
                {
                    type: "error",
                    title: "KMP Mod Loader",
                    message: "On package " + item + ": invalid package name: not enough parts"
                }
            )
        }
        if (parts[0].length > 5) {
            dialog.showMessageBoxSync(
                {
                    type: "error",
                    title: "KMP Mod Loader",
                    message: "On package " + item + ": invalid package name: tld too long"
                }
            )
        }
        if (item.length > 49) {
            dialog.showMessageBoxSync(
                {
                    type: "error",
                    title: "KMP Mod Loader",
                    message: "On package " + item + ": invalid package name: too long"
                }
            )
        }
        if (parts.length > 7) {
            dialog.showMessageBoxSync(
                {
                    type: "error",
                    title: "KMP Mod Loader",
                    message: "On package " + item + ": invalid package name: too many parts"
                }
            )
        }
        if (!/^[a-zA-Z0-9.]*$/gm.test(item)) {
            dialog.showMessageBoxSync(
                {
                    type: "error",
                    title: "KMP Mod Loader",
                    message: "On package " + item + ": invalid package name: invalid format"
                }
            )
        }
    }
}

for (index in list) {
    item = list[index];

    if (fs.existsSync(homedir + "/.kartik/mods/" + item + "/kartik.ini") && fs.existsSync(homedir + "/.kartik/mods/" + item + "/kartik.yml")) {
        unload(list, item);
        dialog.showMessageBoxSync(
            {
                type: "error",
                title: "KMP Mod Loader",
                message: "On package " + item + ": both kartik.ini and kartik.yml found"
            }
        )
    }
}

global.moddata = {};

for (index in list) {
    if (fs.existsSync(homedir + "/.kartik/mods/" + item + "/kartik.ini")) {
        try {
            moddata[list] = ini.parse(fs.readFileSync(homedir + "/.kartik/mods/" + item + "/kartik.ini", "utf-8"));
        } catch (e) {
            unload(list, item);
            console.error(e);
            dialog.showMessageBoxSync(
                {
                    type: "error",
                    title: "KMP Mod Loader",
                    message: "On package " + item + ": ini parser error"
                }
            )
        }
    } else {
        try {
            moddata[list] = YAML.parse(fs.readFileSync(homedir + "/.kartik/mods/" + item + "/kartik.yml", "utf-8"));
        } catch (e) {
            unload(list, item);
            console.error(e);
            dialog.showMessageBoxSync(
                {
                    type: "error",
                    title: "KMP Mod Loader",
                    message: "On package " + item + ": yaml parser error"
                }
            )
        }
    }
}

for (index in list) {
    item = list[index];
    mod = moddata[item];

    roots = Object.keys(mod);

    for (i1 in roots) {
        r = roots[i1];
        if (r !== "Meta" && r !== "Hook") {
            unload(list, item);
            dialog.showMessageBoxSync(
                {
                    type: "error",
                    title: "KMP Mod Loader",
                    message: "On package " + item + ": invalid root section: " + r
                }
            )
        }
    }

    for (i2 in Object.keys(mod["Meta"])) {
        r = Object.keys(mod["Meta"])[i2];
        if (r !== "Properties" && r !== "Hooks") {
            unload(list, item);
            dialog.showMessageBoxSync(
                {
                    type: "error",
                    title: "KMP Mod Loader",
                    message: "On package " + item + ": invalid meta section: " + r
                }
            )
        }
    }

    if (Object.keys(mod["Meta"]).length < 2) {
        unload(list, item);
        dialog.showMessageBoxSync(
            {
                type: "error",
                title: "KMP Mod Loader",
                message: "On package " + item + ": meta sections incomplete"
            }
        )
    }

    meta = mod["Meta"];

    for (i3 in Object.keys(meta["Properties"])) {
        r = Object.keys(meta["Properties"])[i3];
        if (r !== "Mod.Name" && r !== "Mod.Version" && r !== "Mod.Author" && r !== "Mod.Required") {
            unload(list, item);
            dialog.showMessageBoxSync(
                {
                    type: "error",
                    title: "KMP Mod Loader",
                    message: "On package " + item + ": invalid property: " + r
                }
            )
        }
    }

    if (Object.keys(meta["Properties"]).length < 4) {
        unload(list, item);
        dialog.showMessageBoxSync(
            {
                type: "error",
                title: "KMP Mod Loader",
                message: "On package " + item + ": properties incomplete"
            }
        )
    }

    props = meta.Properties;

    if (props["Mod.Required"].trim() !== "*") {
        sver = require('../package.json').version.split(".").map((i) => { if (!isNaN((i - 1 + 1))) { return (i - 1 + 1).toString(); } else { return i; } }).join(".");
        if (semver.valid(sver)) {
            if (!semver.satisfies(sver, props["Mod.Required"].trim())) {
                unload(list, item);
                dialog.showMessageBoxSync(
                    {
                        type: "error",
                        title: "KMP Mod Loader",
                        message: "On package " + item + ": mod made for another version of Kartik"
                    }
                )
            }
        } else {
            if (require('../package.json').channel !== "git" && require('../package.json').channel !== "nightly") {
                unload(list, item);
                dialog.showMessageBoxSync(
                    {
                        type: "error",
                        title: "KMP Mod Loader",
                        message: "On package " + item + ": invalid game version"
                    }
                )
            }
        }
    }

    hooks = meta["Hooks"];
    hname = Object.keys(hooks);

    for (i4 in hname) {
        hookn = hname[i4];
        hook = hooks[hookn];
        if (typeof mod["Hook"][hook] === "undefined") {
            unload(list, item);
            dialog.showMessageBoxSync(
                {
                    type: "error",
                    title: "KMP Mod Loader",
                    message: "On package " + item + ": block " + hook + " required by hook " + hookn + " not found"
                }
            )
        }
    }
}

for (index in list) {
    item = list[index];
    mod = moddata[item];
    meta = mod["Meta"];

    hooks = meta["Hooks"];
    hname = Object.keys(hooks);

    for (i4 in hname) {
        hookn = hname[i4];
        hook = hooks[hookn];

        mod["_Path"] = homedir + "/.kartik/mods/" + item;

        console.log(" * KMP hook: " + item + "$" + hookn)
        require('./hooks')(mod, hookn, hook);
    }
}

global.mods = list;
