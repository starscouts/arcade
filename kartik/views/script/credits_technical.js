document.write("Kartik: A New Start");
document.write(" on " + navigator.userAgent + "<br>")
if (navigator.hardwareConcurrency > 1 || navigator.hardwareConcurrency === 0) {
    document.write(navigator.hardwareConcurrency + " processors, ");
} else {
    document.write(navigator.hardwareConcurrency + " processor, ");
}
if (navigator.maxTouchPoints > 1 || navigator.maxTouchPoints === 0) {
    document.write(navigator.maxTouchPoints + " touch points<br>");
} else {
    document.write(navigator.maxTouchPoints + " touch point<br>");
}