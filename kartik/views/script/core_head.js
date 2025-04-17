if (native) {global.$ = require('jquery');} else {var script = document.createElement('script');script.src = './webinit/jquery.js';script.type = 'text/javascript';document.getElementsByTagName('head')[0].appendChild(script);}

if (native && require('@electron/remote').getCurrentWindow().debug) {
    document.write('<link rel="stylesheet" href="' + atob("Li92aWV3cy9jb21tb24vZGVidWcuY3Nz") + '">');
}

if (native) {
    var ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.on('scenario', function (event,obj) {
        try {
            console.log(kresources.scenario.voice[obj.lang] + "/" + obj.namespace + obj.id + ".mp3");
            a = new Audio(kresources.scenario.voice[obj.lang] + "/" + obj.namespace + obj.id + ".mp3");
            a.onended = () => {
                setTimeout(() => {
                    $("#message").fadeOut(200);
                    if (typeof obj.cb == "function") {
                        obj.cb();
                    }
                }, 3000)
            }
            a.play();
        } catch (e) {
            console.error(e);
            obj.cb();
        }

        document.getElementById('message-text').innerText = obj.message;
        document.getElementById('message-character-inner').src = kresources.scenario.averi[obj.emote];
        $("#message").fadeIn(200);
    });
}
