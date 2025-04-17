if (location.search !== "?noreset") {
    console.log("back");
    window.parent.musicManager.setMusic(kresources.music['title'].file);
}
info("MenuWindow", "Menu opened");
