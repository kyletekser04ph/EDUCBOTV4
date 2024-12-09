let t = {};

t["config"] = {
    name: "bogart",
    version: "1.0.1",
    role: 0,
    hasPrefix: false,
    credits: "cliff",
    description: "bogart Canvas meme",
    commandCategory: "game",
    usages: "[text]",
    cooldowns: 5,
};

t["run"] = async function({ api, event, args }) {	
    const fs = require("fs-extra");
    const axios = require("axios");
    const pathImg = __dirname + '/cache/bogart.png';
    const text = args.join(" ");

    if (!text) return api.sendMessage("please provide a text", event.threadID, event.messageID);	

    try {
        const response = await axios.get(`https://api-canvass.vercel.app/bogart?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });

        await fs.writeFile(pathImg, response.data);

        return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
    } catch (error) {
        return api.sendMessage("API SUCKS", event.threadID, event.messageID);
    }        
}
