if (location.hash === "#ready") {
    global.musicElement = new Audio();

    global.musicManager = {
        setMusic: (args) => {
            musicElement.src = args;
            musicElement.play();
            musicElement.volume = 1;
            musicElement.loop = true;
        },
        fadeMusic: () => {
            if (!musicElement.paused) {
                csi1 = setInterval(() => {
                    if (musicElement.volume <= 0.3) {
                        clearInterval(csi1);
                        return;
                    }
                    musicElement.volume = musicElement.volume - 0.05;
                }, 100)
            }
        },
        unfadeMusic: () => {
            if (!musicElement.paused) {
                csi1 = setInterval(() => {
                    if (musicElement.volume >= 0.95) {
                        clearInterval(csi1);
                        return;
                    }
                    musicElement.volume = musicElement.volume + 0.05;
                }, 100)
            }
        }
    }

}