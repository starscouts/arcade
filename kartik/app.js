console.log(" _  __          _   _ _    \n| |/ /__ _ _ __| |_(_) | __\n| ' // _` | '__| __| | |/ /\n| . \\ (_| | |  | |_| |   < \n|_|\\_\\__,_|_|   \\__|_|_|\\_\\\n                           ");
switch (require('./package.json').channel) {
    case "stable":
        console.log("   Kartik " + require('./package.json').version + " (Official Release) [stable]\n");
        break;
    case "eap":
        console.log("   Kartik " + require('./package.json').version + " (Early Access Release) [eap]\n");
        break;
    case "nightly":
        console.log("   Kartik " + require('./package.json').version + " (Rawhide Release) [nightly]\n");
        break;
    case "beta":
        console.log("   Kartik " + require('./package.json').version + " (Branched Release) [beta]\n");
        break;
    case "git":
        console.log("   Kartik " + require('./package.json').version + " (Trunk Build) [git]\n");
        break;
}

global.start = new Date();
global.KartikRoot = __dirname;
global.shouldExitIfClosed = false;
const { app, BrowserWindow } = require('electron');
const fs = require("fs");

(async () => {
    process.on('uncaughtException', (error) => {
        console.log(" * Starting recovery procedure: E_ERROR: " + error.message);
        id = new Date().toISOString().replaceAll(":", "-");

        require('fs').writeFileSync(require('os').userInfo().homedir + "/.kartik/crashes/" + id + ".txt", "Kartik Bootstraper Crash\n\n" + error.stack);
        if (require('os').platform() === "win32") {
            require('child_process').exec("runtime\\kartik-crash.bat " + id);
        } else if (require('os').platform() === "darwin") {
            require('child_process').exec("./runtime/kartik-crash-mac.sh " + id);
        } else {
            require('child_process').exec("./runtime/kartik-crash.sh " + id);
        }
        process.exit(2);
    })

    process.on('unhandledRejection', (reason) => {
        console.log(" * Starting recovery procedure: E_PROMISE: " + reason);
        id = new Date().toISOString();

        require('fs').writeFileSync(homedir + "/.kartik/crashes/" + id + ".txt", "Kartik Bootstraper Crash (in promise)\n\n" + reason);
        if (require('os').platform() === "win32") {
            require('child_process').exec("runtime\\kartik-crash.bat");
        } else if (require('os').platform() === "darwin") {
            require('child_process').exec("./runtime/kartik-crash-mac.sh");
        } else {
            require('child_process').exec("./runtime/kartik-crash.sh");
        }
        process.exit(2);
    })

    if (process.argv[2] === "m") {
        console.log(" * *******************************************");
        console.log(" * *         DATA MITIGATION MODE            *");
        console.log(" * *                                         *");
        console.log(" * * Unless you ABSOLUTELY need this, please *");
        console.log(" * * consider starting Kartik normally.      *");
        console.log(" * *******************************************");
        if (!require('fs').existsSync(__dirname + "/data")) {
            require('fs').mkdirSync(__dirname + "/data");
        }
        global.homedir = __dirname + "/data";
    } else {
        global.homedir = require('os').userInfo().homedir;
    }

    /* --------------------- */

    console.log(" * Preparing application paths");
    app.setAppLogsPath(homedir + "/.kartik/logs");
    app.setPath("crashDumps", homedir + "/.kartik/dumps");
    app.setPath('userData', homedir + "/.kartik/storage");
    app.whenReady().then(async () => {
        if (require('./package.json').channel !== "stable" && require('./package.json').channel !== "git" && !require('fs').existsSync(homedir + "/.kartik/current.kfn")) {
            console.log(" * Opening save data conversion dialog");
            global.converting = true;
            btn = require('electron').dialog.showMessageBoxSync(
                {
                    type: "warning",
                    title: "Migrating save data to Kartik Fox Nest required",
                    message: "Your save data needs to be converted",
                    buttons: [
                        "Use a new game directory (recommended)",
                        "Convert existing save data",
                        "Quit without doing anything"
                    ],
                    cancelId: 2,
                    detail: "Kartik Fox Nest (the new save data format) has been introduced in this version, and it requires converting from the old save data format. Because it is not possible to downgrade from Kartik Fox Nest to the old save data format, you have to choose what to do."
                }
            )

            switch (btn) {
                case 2:
                    process.exit(2);
                    break;
                case 1:
                    break;
                case 0:
                    if (process.argv[2] === "m") {
                        console.log(" * *******************************************");
                        console.log(" * *         DATA MITIGATION MODE            *");
                        console.log(" * *                                         *");
                        console.log(" * * Unless you ABSOLUTELY need this, please *");
                        console.log(" * * consider starting Kartik normally.      *");
                        console.log(" * *******************************************");
                        if (!require('fs').existsSync(__dirname + "/data")) {
                            require('fs').mkdirSync(__dirname + "/data");
                        }
                        global.homedir = __dirname + "/data/.KartikStaging$";
                    } else {
                        global.homedir = require('os').userInfo().homedir + "/.KartikStaging$";
                    }
                    app.setAppLogsPath(homedir + "/.kartik/logs");
                    app.setPath("crashDumps", homedir + "/.kartik/dumps");
                    app.setPath('userData', homedir + "/.kartik/storage");
                    if (!require('fs').existsSync(homedir)) {
                        require('fs').mkdirSync(homedir);
                    }
                    break;
            }
        }

        console.log(" * Gathering language");
        slpm = require('os-locale');
        slpw = await slpm();
        slpo = slpw.substr(0, 2);
        slng = require('./lang/languages.json');
        if (Object.keys(slng).includes(slpo)) {
            dlp = slpo;
        } else {
            dlp = "en";
        }

        console.log(" * Saving to " + homedir);

        if (!require('fs').existsSync(homedir + "/.kartik")) {
            require('fs').mkdirSync(homedir + "/.kartik")
        }

        if (!require('fs').existsSync(homedir + "/.kartik/crashes")) {
            require('fs').mkdirSync(homedir + "/.kartik/crashes")
        }

        if (!require('fs').existsSync(homedir + "/.kartik/mods")) {
            require('fs').mkdirSync(homedir + "/.kartik/mods")
        }

        if (require('fs').existsSync(homedir + "/.kartik/build")) {
            require('fs').rmSync(homedir + "/.kartik/build", { recursive: true })
        }
        require('fs').mkdirSync(homedir + "/.kartik/build")

        console.log(" * Creating configuration");

        const fs = require('fs');
        const Nest = require('./nest/abi');

        if (fs.existsSync(homedir + "/.kartik/config") && fs.existsSync(homedir + "/.kartik/config/voice.txt") && fs.existsSync(homedir + "/.kartik/config/online.txt") && fs.existsSync(homedir + "/.kartik/config/music.txt") && fs.existsSync(homedir + "/.kartik/config/lang.txt") && fs.existsSync(homedir + "/.kartik/stats.json")) {
            console.log(" * Found complete Config V1, migrating to Kartik Fox Nest...");
            Nest.convert(homedir + "/.kartik/current.kfn", homedir + "/.kartik");
        } else {
            if (!fs.existsSync(homedir + "/.kartik/current.kfn")) {
                console.log(" * No Kartik Fox Nest found, generating one...");
                Nest.generate(homedir + "/.kartik/current.kfn");
            } else {
                fs.copyFileSync(homedir + "/.kartik/current.kfn", homedir + "/.kartik/latest.kfn");
            }
        }

        global.currentNest = Nest.load(homedir + "/.kartik/current.kfn");
        console.log(" * Kartik Fox Nest loaded, " + fs.readFileSync(homedir + "/.kartik/current.kfn").toString().length + " bytes, last loaded in Kartik " + currentNest._version);

        currentNest._version = require('./package.json').version;
        Nest.export(homedir + "/.kartik/current.kfn", currentNest);

        /* --------------------- */

        require('@electron/remote/main').initialize();

        function createWindow () {
            console.log(" * Checking configuration");

            lp = currentNest.config.lang

            time = new Date() - start;
            console.log(" * Started successfully in " + Math.round(time/1000) + " seconds");
            console.log(" * Why are you EVEN reading this?");
            global.shouldExitIfClosed = true;

            console.log(" * Starting IPC engine");
            win.pwidth = 720;
            win.pheight = 540;
            win.log = console.log;

            win.debug = process.argv[2] === "d";
            win.channel = channel;
            win.cmdlineargs = process.argv;
            win.scale = 1.2;
            win.update = dimga;
            win.gamepads = [];
            win.controllerAttached = false;
            win.webview = null;
            win.dstate = "Kartik";
            win.ddetails = "Kartik";
            win.mods = mods;

            win.invalidfiles = invalidfiles;
            win.modsfiles = compiledTypeScriptFiles;
            win.homedir = homedir;

            win.lp = lp;
            win.music = currentNest.config.music;
            win.voice = currentNest.config.voice;

            win.online = currentNest.config.online;
            win.nest = currentNest;

            win.resources = resources;
            global.currentSongValue = null;

            console.log(" * Starting language preloader");
            require('./lang/preload.js');
            console.log(" * Starting Discord RPC");
            require('./discord/client.js');

            if (win.debug) {
                console.log(" * *******************************************");
                console.log(" * *          KARTIK DEBUG MODE              *");
                console.log(" * *******************************************");
                win.openDevTools();
            }

            setTimeout(() => {
                win.webContents.send('ready', true);
            }, 3000)

            win.webContents.on('dom-ready', () => {
                musicIpc = require('electron').ipcMain;
                musicIpc.on('newmusic', (event, value) => {
                    if (music) {
                        win.webContents.send('setmusic', value);
                    }
                })

                musicIpc.on('reloadNest', (event) => {
                    currentNest = Nest.load(homedir + "/.kartik/current.kfn");
                    win.nest = currentNest;
                })

                const LevelsAPI = require('./views/script/global_levelsapi');
                const lvl = new LevelsAPI();

                stats = currentNest.stats;
                musicIpc.on('addstats', (event, value) => {
                    currentNest.stats[value.catalog][value.key] = currentNest.stats[value.catalog][value.key] + value.add;
                    Nest.export(homedir + "/.kartik/current.kfn", currentNest);
                    currentNest = Nest.load(homedir + "/.kartik/current.kfn");
                    win.nest = currentNest;

                    if (value.key === "laps" && currentNest.auth) {
                        auth = currentNest.auth;
                        level = lvl.correspond(currentNest.stats["ingame"]["laps"], "256") - 1 + 1;

                        if (level !== auth.level) {
                            currentNest.auth.level = level;
                            Nest.export(homedir + "/.kartik/current.kfn", currentNest);
                            currentNest = Nest.load(homedir + "/.kartik/current.kfn");
                            win.nest = currentNest;
                            if (level < 200) {
                                win.webContents.send("notification", {title: lang.polymer.levelup[0], message: lang.polymer.levelup[1] + " " + level + " " + lang.polymer.levelup[2]});
                            } else {
                                win.webContents.send("notification", {title: lang.polymer.finished[0], message: lang.polymer.finished[1]});
                            }
                        }
                    }
                })
                musicIpc.on('addstatsandclose', (event, value) => {
                    currentNest.stats[value.catalog][value.key] = currentNest.stats[value.catalog][value.key] + value.add;
                    Nest.export(homedir + "/.kartik/current.kfn", currentNest);
                    currentNest = Nest.load(homedir + "/.kartik/current.kfn");
                    win.nest = currentNest;
                    win.destroy();
                })
            })
        }

        console.log(" * Starting splash screen");

        console.log(" * Checking channel");
        if (require('./package.json').channel === "stable") {
            logo = "logo/logo.png";
            channel = " ";
            global.dimg = "official";
            global.dimga = "stable";
            global.dchan = "Kartik Stable";
        } else if (require('./package.json').channel === "beta") {
            logo = "logo/logo-beta.png";
            channel = " Beta ";
            global.dimg = "beta";
            global.dimga = "beta";
            global.dchan = "Kartik Beta";
        } else if (require('./package.json').channel === "nightly") {
            logo = "logo/logo-nightly.png";
            channel = " Nightly ";
            global.dimg = "nightly";
            global.dimga = "nightly";
            global.dchan = "Kartik Nightly";
        } else if (require('./package.json').channel === "eap") {
            logo = "logo/logo-eap.png";
            channel = " EAP ";
            global.dimg = "eap";
            global.dimga = "eap";
            global.dchan = "Kartik EAP";
        } else if (require('./package.json').channel === "git") {
            logo = "logo/logo-git.png";
            channel = " Trunk ";
            global.dimg = "git";
            global.dimga = "git";
            global.dchan = "Kartik Trunk";
            try {
                pk = require('./package.json');
                pk.version = require('fs').readFileSync("./.git/refs/heads/trunk").toString().substr(0, 7);
                fs.writeFileSync("./package.json", JSON.stringify(pk, 2))
            } catch (e) {}
        }

        global.win = new BrowserWindow({
            width: 1220,
            height: 720,
            minWidth: 720,
            minHeight: 540,
            resizeable: true,
            resizable: true,
            maximizable: true,
            show: false,
            enableLargerThanScreen: true,
            icon: logo,
            backgroundColor: "#000000",
            title: "Kartik",
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                webviewTag: true,
                disableBlinkFeatures: "MediaSessionService",
            }
        })
        console.log(" * Loading view");
        win.loadFile('./index.html')
        win.setMenu(null);
        win.webContents.once('dom-ready', () => {
            console.log(" * Showing splash screen");
            win.show();
            setTimeout(() => {
                console.log(" * Checking signatures");

                invalidfiles = [];

                sigdb = require("./bin/signatures.json");
                total = Object.keys(sigdb["v1"]).length * 3;
                processed = 0;
                for (file in sigdb["v1"]) {
                    if (fs.existsSync(file) && !invalidfiles.includes(file)) {
                        try {
                            hash = require('crypto').createHash('sha512').update(fs.readFileSync(file)).digest('base64');
                            if (hash !== sigdb["v1"][file]) {
                                invalidfiles.push(file);
                            }
                        } catch (e) {
                            console.warn(" ! Could not compute V1 hash for " + file);
                        }
                    }

                    processed++;
                    win.webContents.send('progress', (processed/total)*100);
                }
                for (file in sigdb["v2"]) {
                    if (fs.existsSync(file) && !invalidfiles.includes(file)) {
                        try {
                            hash = require('crypto').createHash('sha1').update(fs.readFileSync(file)).digest('base64');
                            if (hash !== sigdb["v2"][file]) {
                                invalidfiles.push(file);
                            }
                        } catch (e) {
                            console.warn(" ! Could not compute V2 hash for " + file);
                        }
                    }

                    processed++;
                    win.webContents.send('progress', (processed/total)*100);
                }
                for (file in sigdb["v3"]) {
                    if (fs.existsSync(file) && !invalidfiles.includes(file)) {
                        try {
                            hash = require('crypto').createHash('md5').update(fs.readFileSync(file)).digest('base64');
                            if (hash !== sigdb["v3"][file]) {
                                invalidfiles.push(file);
                            }
                        } catch (e) {
                            console.warn(" ! Could not compute V3 hash for " + file);
                        }
                    }

                    processed++;
                    win.webContents.send('progress', (processed/total)*100);
                }

                global.importedTypeScriptFiles = [];
                global.compiledTypeScriptFiles = [];
                console.log(" * Generating resources pack");
                require('./modding/resources');
                console.log(" * Starting Kartik Modding Platform");
                require('./modding/parser');
                console.log(" * Compiling KMP API TypeScript files");
                require('./modding/compiler');
                console.log(" * Loading KMP TypeScript mods");
                require('./typescript/preloader');
                createWindow();
            }, 5000)
        })
    })

    app.on('window-all-closed', () => {
        if (shouldExitIfClosed) {
            console.log(" * Bye!");
            app.quit()
        }
    })
})();
