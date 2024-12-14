let t = {};

const name = "clapper-board";

t["config"] = {
    name: name,
    version: "1.0.1",
    role: 0,
    hasPrefix: false,
    credits: "cliff",
    description: "canvas",
    commandCategory: "game",
    usages: "[text]",
    cooldowns: 0
};

t["run"] = async function({ api, event, args }) {	
    const fs = require("fs-extra");
    const axios = require("axios");
    const pathImg = __dirname + '/cache/e.png';
    const g = args.join(" ");

    const mentionID = Object.keys(event.mentions)[0] || (event.messageReply && event.messageReply.senderID);

    if (!mentionID) {
        return api.sendMessage('Please mention or reply to a user and provide the required details.', event.threadID, event.messageID);
    }

    const details = g.split(" | ");
    if (details.length < 6) {
        return api.sendMessage("Please provide all necessary details in this format: Production | Director | Cameraman | Date | Scene | Take", event.threadID, event.messageID);
    }

    const [production, director, cameraman, date, scene, take] = details.map(item => item.trim());

    try {
        const response = await axios.get(
            `https://api-canvass.vercel.app/clapper-board?userid=${mentionID}&production=${production}&director=${director}&cameraman=${cameraman}&date=${date}&scene=${scene}&take=${take}`,
            { responseType: 'arraybuffer' }
        );

        await fs.writeFile(pathImg, response.data);

        return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
    } catch (error) {
        return api.sendMessage("API request failed.", event.threadID, event.messageID);
    }
};

module.exports = t;
