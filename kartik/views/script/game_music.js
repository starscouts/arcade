startHooks.push(() => {
    info("MusicMgr", "Playing game" + i + ".mp3");
    window.parent.musicManager.setMusic(kresources.music['game' + i].file);
})

if (location.search === "?online") {
    window.parent.musicManager.setMusic(kresources.music['prepare'].file);
}
