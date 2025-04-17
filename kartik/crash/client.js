taglines = [
    "Who set us up the engine?",
    "Everything's going as planned. No, really, that was supposed to happen.",
    "Uh... Did I do that? (oops)",
    "Oops.",
    "Why did you do that?",
    "I feel sad now :(",
    "My bad.",
    "I'm sorry, Dave. I'm afraid I can't do that.",
    "I let you down. Sorry :(",
    "On the bright side, I bought you a teddy bear!",
    "Oh - I know what I did wrong!",
    "Hey, that tickles! Hehehe!",
    "I blame Microsoft.",
    "Don't be sad. I'll do better next time, pinky swear!",
    "Don't be sad, have a hug! <3",
    "I just don't know what went wrong :(",
    "Shall we play a game?",
    "Quite honestly, I wouldn't worry myself about that.",
    "Sorry :(",
    "Surprise! Haha. Well, this is awkward.",
    "Would you like a cupcake?",
    "Hi. I'm Kartik, and I'm a crashaholic.",
    "Ooh. Shiny.",
    "This doesn't make any sense!",
    "Why is it breaking :(",
    "Don't do that.",
    "Ouch. That hurt :(",
    "You're mean.",
    "But it works on my machine.",
    "Welp, I guess it's broken now.",
    "¯\\_(ツ)_/¯",
    "*boop*"
]

if (native) {
    function crash(error) {
        id = new Date().toISOString().replaceAll(":", "-");

        try {
            global.pkg = require('./package.json');
        } catch (e) {
            console.warn(e);
            global.pkg = require('../package.json');

        }

        try {
            pubver = require('../package.json').version;
        } catch (e) {
            pubver = require('./package.json').version;
        }
        pvpart = pubver.split(".");
        if (pvpart.length === 3) {
            intver = pvpart[0] + "." + pvpart[1];
        } else {
            intver = "unknown";
        }

        if (require('@electron/remote').getCurrentWindow().mods.length > 0) {
            release = "mods+" + require('@electron/remote').getCurrentWindow().mods.length;
        } else {
            release = "official";
        }

        report = "---- Kartik Crash Report ----\n";
        report += "// " + taglines[Math.floor(Math.random() * taglines.length)] + "\n\n"

        report += "Time: " + new Date().toUTCString() + "\n\n";
        error.stack.split("\n").forEach((line) => {
            report += line + "\n";
        })

        report += "\n\n\nA detailed walkthrough of the error, its code path and all known details is as follows:\n" +
            "---------------------------------------------------------------------------------------\n\n";

        report += "-- Head --\nThread: Renderer #" + process.pid + "\n\n"

        report += "-- Initialization --\nDetails: " + require('@electron/remote').getCurrentWindow().cmdlineargs.join(" ") + "\n\n"

        report += "-- System Details --\nDetails: \n";

        report += "    Kartik Version: " + pkg.version + "\n";
        try {
            channel = require('../package.json').channel;
        } catch (e) {
            channel = require('./package.json').channel;
        }
        report += "    Kartik Version ID: " + intver + "/" + channel + "+" + release + "\n";
        report += "    Kartik Version SKU: " + pkg.serial + "\n";
        report += "    Operating System: " + require('os').type() + " (" + require('os').arch() + ") version " + require('os').release() + "\n";
        report += "    Electron Version: " + process.versions.electron + "\n";
        report += "    Electron VM Version: " + process.versions.v8 + "\n";
        report += "    Node Version: " + process.versions.node + "\n";
        report += "    Memory: " + process.memoryUsage().heapUsed + " bytes (" + Math.round(process.memoryUsage().heapUsed / 1000000) + " MB) / " + process.memoryUsage().heapTotal + " bytes (" + Math.round(process.memoryUsage().heapTotal / 1000000) + " MB) up to " + process.memoryUsage().rss + " bytes (" + Math.round(process.memoryUsage().rss / 1000000) + " MB)\n";
        report += "    CPUs: " + require('os').cpus().length + "\n";
        if (require('@electron/remote').getCurrentWindow().mods.length > 0) {
            report += "    KMP Mods:\n";
            for (mod of require('@electron/remote').getCurrentWindow().mods) {
                report += "        " + mod + "\n";
            }
        }
        report += "    Is Modded: ";
        if (require('@electron/remote').getCurrentWindow().mods.length > 0) {
            report += "Definitely; Client brand changed to 'kmp-client'"
        } else if (require('@electron/remote').getCurrentWindow().invalidfiles.length > 0) {
            if (require('@electron/remote').getCurrentWindow().invalidfiles.length > 1) {
                report += "Very likely; " + require('@electron/remote').getCurrentWindow().invalidfiles.length + " signatures invalidated";
            } else {
                report += "Very likely; " + require('@electron/remote').getCurrentWindow().invalidfiles.length + " signature invalidated";
            }
        } else {
            report += "Probably not. All signatures remains and client brand is untouched.";
        }
        report += "\n";
        report += "    CPU: " + require('os').cpus().length + "x " + require('os').cpus()[0].model.trim() + "\n";

        require('fs').copyFileSync(homedir + "/.kartik/current.kfn", homedir + "/.kartik/crashed.kfn");
        require('fs').writeFileSync(require('os').userInfo().homedir + "/.kartik/crashes/" + id + ".txt", report);
        require('@electron/remote').getCurrentWindow().webContents.send("crashreport", report);
    }

    window.onerror = (_a, _b, _c, _d, error) => {
        if (typeof error != "undefined") {
            crash(error);
        } else {
            error("CrashManager", "An exception was thrown without details about it");
            crash(new Error("Unknown error"));
        }
    }

    process.on('uncaughtException', (error) => {
        if (typeof error != "undefined") {
            crash(error);
        } else {
            error("CrashManager", "An exception was thrown without details about it");
            crash(new Error("Unknown error"));
        }
    })
}
