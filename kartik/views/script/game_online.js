if (location.search === "?online") {
    document.getElementById('online-login').style.display = "";
    document.write(`<` + `script src="../online/global.js"></` + `script>`);
} else {
    startHooks.forEach((hook) => {
        hook(this);
    })
    document.getElementById('ping').style.display = "none";
}