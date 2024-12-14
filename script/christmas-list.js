let t = {};

const name = "christmas-list";

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

    const [list, text1, text2, text3, text4] = g.split(" | ");

    try {
        if (!list || !text1 || !text2 || !text3 || !text4) {
            return api.sendMessage('Please provide all the required texts separated by " | " only 4 text \n\nExample: christmas-list MGA KUPAL | neth | Churchill | jaceti | yazky', event.threadID, event.messageID);
        }
        
        const response = await axios.get(`https://api-canvass.vercel.app/${name}?list=${encodeURIComponent(list)}&text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}&text3=${encodeURIComponent(text3)}&text4=${encodeURIComponent(text4)}`, { responseType: 'arraybuffer' });

        await fs.writeFile(pathImg, response.data);

        return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
    } catch (error) {
        return api.sendMessage("API SUCKS", event.threadID, event.messageID);
    }
}

module.exports = t;
