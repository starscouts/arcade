const fs = require('fs');
const crypto = require('crypto');
global.sdb = {
    "v1": {},
    "v2": {},
    "v3": {}
};

function scan(start) {
    rt = fs.readdirSync(start);
    for (file of rt) {
        if (file !== ".git" && file !== "build" && file !== "signatures.json" && file !== "staging" && file !== "node_modules" && !file.endsWith(".staging") && !file.endsWith(".old") && file !== "_translate" && file !== "macos") {
            if (fs.lstatSync(start + "/" + file).isDirectory()) {
                scan(start + "/" + file);
            } else {
                sign = crypto.createHash('sha512').update(fs.readFileSync(start + "/" + file)).digest('base64')
                console.log("Signed (SHA-512): " + start + "/" + file + ": " + sign);
                sdb["v1"][(start + "/" + file).substr(1)] = sign;

                sign = crypto.createHash('sha1').update(fs.readFileSync(start + "/" + file)).digest('base64')
                console.log("Signed (SHA-1): " + start + "/" + file + ": " + sign);
                sdb["v2"][(start + "/" + file).substr(1)] = sign;

                sign = crypto.createHash('md5').update(fs.readFileSync(start + "/" + file)).digest('base64')
                console.log("Signed (MD5): " + start + "/" + file + ": " + sign);
                sdb["v3"][(start + "/" + file).substr(1)] = sign;
            }
        }
    }
}

scan("..");
fs.writeFileSync("../bin/signatures.json", JSON.stringify(sdb));
