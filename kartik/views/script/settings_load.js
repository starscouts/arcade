info("OptnWindow", "Restoring settings...");

slang = lp;
langs = JSON.parse($.ajax('../lang/languages.json', { async: false }).responseText);

if (Object.keys(langs).includes(slang)) {
    document.getElementById("setting-lang").innerText = langs[slang];
} else {
    document.getElementById("setting-lang").innerText = slang;
}
