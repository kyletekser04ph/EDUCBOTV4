let t = {};

t["config"] = {
    name: "albert",
    version: "1.0.1",
    role: 0,
    hasPrefix: false,
    credits: "cliff",
    description: "albert Einstein canvas",
    commandCategory: "game",
    usages: "[text]",
    cooldowns: 0
};

t["run"] = async function({ api, event, args }) {	
    const fs = require("fs-extra");
    const axios = require("axios");
    const pathImg = __dirname + '/cache/e.png';
    const text = args.join(" ");

    if (!text) return api.sendMessage("provide a text first", event.threadID, event.messageID);	

    try {
        const response = await axios.get(`https://api-canvass.vercel.app/albert?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });

        await fs.writeFile(pathImg, response.data);

        return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
    } catch (error) {
        return api.sendMessage("API SUCKS", event.threadID, event.messageID);
    }        
}

module.exports = t;
