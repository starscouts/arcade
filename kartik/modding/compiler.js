class BuildError extends Error {
    constructor(orig, ...params) {
        super(...params);
        this.name = "BuildError";
        this.stack = this.stack + "\n" + orig.stack;
    }
}

const tsbuild = require('../typescript/builder');

for (file of importedTypeScriptFiles) {
    try {
        tsbuild(file.file, homedir + "/.kartik/build/" + file.output);
    } catch (e) {
        throw new BuildError(e, "Error while building " + file.file + " from package " + file.pkg)
    }
}