function getCookie(cname) {
   var name = cname + "=";
   var decodedCookie = decodeURIComponent(document.cookie);
   var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
    return "";
}

if (getCookie("kartik_lang").trim() === "") {
    document.cookie = "kartik_lang=en; path=/";
}

try {
    global.lp = getCookie("kartik_lang");
    global.lang = JSON.parse($.ajax("/kartik/lang/" + lp + ".json", { async: false }).responseText);
} catch (e) {
    console.error(e);
    global.lp = "en";
    global.lang = JSON.parse($.ajax("/kartik/lang/" + lp + ".json", { async: false }).responseText);
}