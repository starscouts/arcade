const Sound = {
    pass: () => {
        new Audio(kresources.sfx['pass']).play()
    },
    last: () => {
        new Audio(kresources.sfx['last']).play()
    },
    crash: () => {
        new Audio(kresources.sfx['crash']).play()
    },
    win: () => {
        new Audio(kresources.sfx['win']).play()
    },
    click: () => {
        new Audio(kresources.sfx['click']).play()
    },
    menu: () => {
        new Audio(kresources.sfx['menu']).play()
    },
    pause: () => {
        new Audio(kresources.sfx['pause']).play()
    },
    start: () => {
        new Audio(kresources.sfx['start']).play()
    },
    intro: () => {
        new Audio(kresources.music['start'].file).play()
    },
}

shouldMusicPlay = true;

setInterval(() => {
    try {
        if (typeof document.getElementById('music') !== "undefined" && typeof document.getElementById('music') !== "null") {
            if (shouldMusicPlay) {
                document.getElementById('music').play();
            }
            if (!shouldMusicPlay) {
                document.getElementById('music').pause();
            }
        }
        if (typeof b !== "undefined" && typeof b !== "null") {
            if (shouldMusicPlay) {
                b.play();
            }
            if (!shouldMusicPlay) {
                b.pause();
            }
        }
        if (typeof me !== "undefined" && typeof me !== "null") {
            if (me.currentTime < me.duration) {
                me.play();
            }
            if (me.currentTime >= me.duration) {
                me.pause();
            }
        }
    } catch (e) {}
}, 200)