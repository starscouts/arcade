window.addEventListener("load", () => {
    document.getElementById("banner-decoration").style.display = "";
    document.getElementById("banner-outer").style.backgroundImage = "";
    document.getElementById("banner-outer").style.backgroundColor = "#042349";
    document.getElementById("banner-contrast").style.display = "none";

    setTimeout(() => {
        if (native) {
            setTimeout(() => {
                setTimeout(() => {

                    $("#progress").fadeOut(500);
                    setTimeout(() => {
                        window.fetch("https://kartik.hopto.org/latest.php?v=" + require('@electron/remote').getCurrentWindow().update).then((data) => {
                            data.blob().then((a) => {
                                a.text().then((b) => {
                                    if (require('@electron/remote').getCurrentWindow().update === "git") {
                                        document.getElementById('updates').style.backgroundColor = "lightsalmon";
                                        document.getElementById('updates').innerText = lang.updates.git;
                                    } else {
                                        console.log(b);
                                        console.log(require('../package.json').version);
                                        if (b === require('../package.json').version) {
                                            document.getElementById('updates').style.backgroundColor = "lightgreen";
                                            document.getElementById('updates').innerText = lang.updates.ok;
                                        } else {
                                            require('@electron/remote').getCurrentWindow().webContents.send("notification", {title: lang.updates.warn[0], message: lang.updates.warn[1]});
                                            document.getElementById('updates').style.backgroundColor = "lightyellow";
                                            document.getElementById('updates').innerText = lang.updates.available;
                                        }
                                    }
                                    setTimeout(() => {
                                        $("#banner-outer").fadeOut(200);
                                        $("#intro-video").fadeIn(200);
                                        setTimeout(() => {
                                            introsfx = document.getElementById("intro-video");
                                            introsfx.play()
                                            introsfx.onended = () => {
                                                $("body").fadeOut(500);
                                                setTimeout(() => {
                                                    info("LoadWindow", "Switching control to MenuWindow");
                                                    location.href = "intro.html";
                                                }, 1000)
                                            }
                                        }, 200)
                                    }, 2000)
                                }).catch((e) => {
                                    console.warn(e);
                                    document.getElementById('updates').style.backgroundColor = "lightcoral";
                                    document.getElementById('updates').innerText = lang.updates.error;
                                    require('@electron/remote').getCurrentWindow().webContents.send("notification", {title: lang.polymer.updateError[0], message: lang.polymer.updateError[1]});
                                    setTimeout(() => {
                                        $("#banner-outer").fadeOut(200);
                                        $("#intro-video").fadeIn(200);
                                        setTimeout(() => {
                                            introsfx = document.getElementById("intro-video");
                                            introsfx.play()
                                            introsfx.onended = () => {
                                                $("body").fadeOut(500);
                                                setTimeout(() => {
                                                    info("LoadWindow", "Switching control to MenuWindow");
                                                    location.href = "intro.html";
                                                }, 1000)
                                            }
                                        }, 200)
                                    }, 2000)
                                });
                            }).catch((e) => {
                                console.warn(e);
                                document.getElementById('updates').style.backgroundColor = "lightcoral";
                                document.getElementById('updates').innerText = lang.updates.error;
                                require('@electron/remote').getCurrentWindow().webContents.send("notification", {title: lang.polymer.updateError[0], message: lang.polymer.updateError[1]});
                                setTimeout(() => {
                                    $("#banner-outer").fadeOut(200);
                                    $("#intro-video").fadeIn(200);
                                    setTimeout(() => {
                                        introsfx = document.getElementById("intro-video");
                                        introsfx.play()
                                        introsfx.onended = () => {
                                            $("body").fadeOut(500);
                                            setTimeout(() => {
                                                info("LoadWindow", "Switching control to MenuWindow");
                                                location.href = "intro.html";
                                            }, 1000)
                                        }
                                    }, 200)
                                }, 2000)
                            });
                        }).catch((e) => {
                            console.warn(e);
                            document.getElementById('updates').style.backgroundColor = "lightcoral";
                            document.getElementById('updates').innerText = lang.updates.error;
                            require('@electron/remote').getCurrentWindow().webContents.send("notification", {title: lang.polymer.updateError[0], message: lang.polymer.updateError[1]});
                            setTimeout(() => {
                                $("#banner-outer").fadeOut(200);
                                $("#intro-video").fadeIn(200);
                                setTimeout(() => {
                                    introsfx = document.getElementById("intro-video");
                                    introsfx.play()
                                    introsfx.onended = () => {
                                        $("body").fadeOut(500);
                                        setTimeout(() => {
                                            info("LoadWindow", "Switching control to MenuWindow");
                                            location.href = "intro.html";
                                        }, 1000)
                                    }
                                }, 200)
                            }, 2000)
                        });
                    }, 2000)
                }, 3000)
            }, 1000)
        } else {

            setTimeout(() => {
                $("#banner-outer").fadeOut(200);
                $("#intro-video").fadeIn(200);
                setTimeout(() => {
                    introsfx = document.getElementById("intro-video");
                    introsfx.play()
                    introsfx.onended = () => {
                        $("body").fadeOut(500);
                        setTimeout(() => {
                            info("LoadWindow", "Switching control to MenuWindow");
                            location.href = "intro.html";
                        }, 1000)
                    }
                }, 200)
            }, 5000)
        }
    }, 2000)
})