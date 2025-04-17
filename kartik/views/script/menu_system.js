
switch (require('os').platform()) {
    case "win32":
        document.write("Windows");
        break
    case "aix":
        document.write("AIX");
        break
    case "android":
        document.write("Android");
        break
    case "cygwin":
        document.write("Cygwin");
        break
    case "darwin":
        document.write("macOS");
        break
    case "freebsd":
        document.write("FreeBSD");
        break
    case "linux":
        document.write("GNU/Linux");
        break
    case "netbsd":
        document.write("NetBSD");
        break
    case "openbsd":
        document.write("OpenBSD");
        break
    case "sunos":
        document.write("Solaris");
        break
}
