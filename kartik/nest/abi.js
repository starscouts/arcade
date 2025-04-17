const fs = require('fs');
var zlib = require('zlib');

console.log("\n\nKartik Fox Nest, a compressed and simple data storage for Kartik.\n(c) Minteck, All Rights Reserved\n\n")

module.exports = {
    export(file, obj) {
        fs.writeFileSync(file, zlib.deflateSync(Buffer.from(Buffer.from(JSON.stringify(obj)).toString("base64")).toString("base64")))
    },

    load(file) {
        data = fs.readFileSync(file)
        uncomp = zlib.inflateSync(data);

        b1 = Buffer.from(uncomp, "base64").toString("utf-8");
        b2 = Buffer.from(b1, "base64").toString("utf-8");

        item = Buffer.from(b2, "base64").toString("utf-8");
        decoded = JSON.parse(item);

        return decoded;
    },

    generate(file) {
        o = {
            "_version": "<unknown>",
            "stats": {
                "times": {
                    "single": 0,
                    "local": 0,
                    "online": 0
                },
                "results": {
                    "wins": 0,
                    "loses": 0
                },
                "ingame": {
                    "walls": 0,
                    "laps": 0,
                    "turns": 0
                }
            },
            "auth": null,
            "config": {
                "lang": "en",
                "music": true,
                "online": true,
                "voice": false
            }
        }

        this.export(file, o);
    },

    convert(file, dotkartik) {
        if (fs.existsSync(dotkartik + "/authentication.json")) {
            auth = JSON.parse(fs.readFileSync(dotkartik + "/authentication.json"));
        } else {
            auth = null;
        }

        o = {
            "_version": "<unknown>",
            "stats": JSON.parse(fs.readFileSync(dotkartik + "/stats.json").toString()),
            "auth": auth,
            "config": {
                "lang": fs.readFileSync(dotkartik + "/config/lang.txt").toString().trim(),
                "music": fs.readFileSync(dotkartik + "/config/music.txt").toString().trim() === "1",
                "online": fs.readFileSync(dotkartik + "/config/online.txt").toString().trim() === "1",
                "voice": fs.readFileSync(dotkartik + "/config/voice.txt").toString().trim() === "1"
            }
        }

        this.export(file, o);
    }
}