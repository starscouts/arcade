document.addEventListener('keydown', function(e) {
    if (e.key === "F1" || e.key === "F10" || e.key === "F11") { // F11/F1/F10
        if (!require('@electron/remote').getCurrentWindow().fullScreen && require('@electron/remote').getCurrentWindow().fullScreenable) {
            require('@electron/remote').getCurrentWindow().setFullScreen(true);
        } else {
            require('@electron/remote').getCurrentWindow().setFullScreen(false);
        }
    }
})