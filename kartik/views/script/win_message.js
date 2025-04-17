if (location.search === "?sp") {
    if ((location.hash.substr(4) - 1 + 2) == 1) {
        document.write(lang.win.solo.win);
    } else {
        document.write(lang.win.solo.lose);
    }
} else {
    document.write(lang.win.versus.replace("0", (location.hash.substr(4) - 1 + 2)));
}