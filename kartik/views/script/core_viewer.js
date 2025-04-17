const webview = document.getElementById('wb');

try {
    webview.addEventListener('dom-ready', () => {
        setTimeout(() => {
            document.getElementById('dummyloader').style.display = "none";
        }, 5000)
        require('@electron/remote').getCurrentWindow().log(" * " + webview.getURL());
        require('@electron/remote').getCurrentWindow().focus();
        if (location.hash === "#ready") {
            require('@electron/remote').webContents.fromId(webview.getWebContentsId()).send("ready", true);
        }
        webview.focus();
        try {
            if (require('@electron/remote').getCurrentWindow().debug) {
                info("MainWindow", "Opening debugging tools...");
                webview.openDevTools();
            }
        } catch (e) {}
    })

    webview.addEventListener('dom-ready', () => {
        setInterval(() => {
            try {
                if (webview.isCrashed() && !gameCrashed) {
                    require('@electron/remote').getCurrentWindow().log(" * Compositing engine crashed!");
                    error("MainWindow", "Subcontainer crashed");
                    crash(new Error("Webview crashed"));
                }
            } catch (e) {}
        }, 2000)
    })
} catch (e) {}