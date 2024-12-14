let t = {};

t["config"] = {
    name: "santas-parcel",
    version: "1.0.1",
    role: 0,
    hasPrefix: false,
    credits: "cliff",
    description: " canvas",
    commandCategory: "game",
    usages: "[text]",
    cooldowns: 0
};

t["run"] = async function({ api, event, args }) {	
    const fs = require("fs-extra");
    const axios = require("axios");
    const pathImg = __dirname + '/cache/e.png';
    const text = args.join(" ");

    try {
const mentionID = event.senderID || Object.keys(event.mentions)[0] || (event.messageReply && event.messageReply.senderID);


if (!mentionID || !text) {
      return api.sendMessage('Please mention or reply to a user. and provide a text', event.threadID, event.messageID);
    }

    if (!mentionID || !text) return api.sendMessage("provide a text first", event.threadID, event.messageID);	
        const response = await axios.get(`https://api-canvass.vercel.app/santas-parcel?userid=${mentionID}&text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });

        await fs.writeFile(pathImg, response.data);

        return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
    } catch (error) {
        return api.sendMessage("API SUCKS", event.threadID, event.messageID);
    }        
}

module.exports = t;
