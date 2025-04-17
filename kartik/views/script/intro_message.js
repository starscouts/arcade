setInterval(() => {
    if (require('@electron/remote').getCurrentWindow().controllerAttached) {
        document.getElementById('progress').innerText = lang.intro[1];
    } else {
        document.getElementById('progress').innerText = lang.intro[0];
    }
}, 100)