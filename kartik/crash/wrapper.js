const { app, BrowserWindow } = require('electron')

lp = "en";

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 375,
        resizeable: false,
        resizable: false,
        maximizable: false,
        bgColor: "#ffffff",
        title: "Kartik",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webviewTag: true
        }
    })

    win.lp = lp;
    win.loadFile('crash.html')
    win.setMenu(null);
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})