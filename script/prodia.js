const { get } = require('axios');
const fs = require('fs');
const path = require('path');

let url = "https://hiroshi-rest-api.replit.app/";
let f = path.join(__dirname, 'cache', 'gen.png');

module.exports.config = {
    name: "prodia",
    version: "1.0.0",
    role: 2,
    hasPrefix: false,
    credits: "Deku",
    description: "Generate image in emi",
    usages: "[prompt]",
    cooldown: 5,
    aliases: ["gen"]
};

module.exports["run"] = async function ({ api, event, args }) {
    function r(msg) {
        api.sendMessage(msg, event.threadID, event.messageID);
    }

    const a = args.join(" ");
    if (!a) return r('Missing prompt!');

    const cliff = await new Promise(resolve => { 
        api.sendMessage('🔍 | Generating Prodia Image...', event.threadID, (err, info1) => {
            resolve(info1);
        }, event.messageID);
    });

    try {
        const d = (await get(url + 'image/prodia?prompt=' + encodeURIComponent(a), {
            responseType: 'arraybuffer'
        })).data;
        fs.writeFileSync(f, Buffer.from(d, "utf8"));
        r({ attachment: fs.createReadStream(f) });
        fs.unlinkSync(f);
        api.unsendMessage(cliff.messageID);
    } catch (e) {
        return r(e.message);
    }
};
