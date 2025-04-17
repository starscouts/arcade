setInterval(() => {
    try {
        currentMemory = process.memoryUsage().rss;
        currentMemoryMib = (((currentMemory)/1024)/1024).toFixed(2);
        if ((((currentMemory)/1024)/1024) > ((require('os').totalmem() / 1000000) / 4)) {
            throw new Error("Out of memory");
        }

        file = webview.getURL().split("/")[webview.getURL().split("/").length - 1];
        activity = lang.discord.game[0];
        enableActivity = false;
        eaid = "";

        switch (file) {
            case "game.html?online":
                enableActivity = true;
                activity = lang.online.discord;
                break;
            case "game.html?sp":
                enableActivity = true;
                activity = lang.discord.game[1];
                break;
            case "game.html":
                enableActivity = true;
                activity = lang.discord.game[2];
                break;
            case "intro.html":
                enableActivity = true;
                activity = lang.discord.intro[1];
                break;
            case "settings.html":
            case "stats.html":
                enableActivity = true;
                activity = lang.discord.settings[1];
                break;
            case "credits.html":
                enableActivity = true;
                activity = lang.discord.credits[1];
                break;
            case "online.html":
                enableActivity = true;
                activity = lang.online.discord2;
                break;
            case "menu.html":
            case "win.html":
                enableActivity = true;
                activity = lang.discord.credits[0];
                break;
            case "loader.html":
                enableActivity = false;
                break;
        }

        if (file.includes("online.html")) {
            activity = lang.online.discord2;
        }

        if (enableActivity) {
            eaid = " - " + activity;
        } else {
            eaid = "";
        }

        if (require('./package.json').channel === "git") {
            document.title="Kartik Trunk " +require('./package.json').version;
        } else {
            document.title="Kartik"+require('@electron/remote').getCurrentWindow().channel+require('./package.json').version + eaid;
        }
    } catch (e) {
        if (e.message === "Out of memory") {
            throw e;
        }
    }
}, 1000)