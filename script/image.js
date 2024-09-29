const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "image",
    aliases: ["mage-defusion"], 
    version: "1.0",
    credits: "Samir Œ",
    cooldown: 5,
    role: 0,
    hasPermission: 0,
    hasPrefix: false,
    usePrefix: false,
    description: "anime image generator",
    commandCategory: "𝗔𝗜-𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗",
    usages:"{pn} <prompt>  --ar 16:9",
};

module.exports.run = async function ({ api, event, args }) {
    let prompt = args.join(" ");
    if (!prompt) return api.sendMessage('Missing prompt!', event.threadID, event.messageID);
    const cliff = await new Promise(resolve => { api.sendMessage('Generating Your request....', event.threadID, (err, info1) => {
      resolve(info1);
     }, event.messageID);
    });

    try {
        const apiUrl = `https://samirxpikachu.onrender.com/mageDef?prompt=${encodeURIComponent(prompt)}`;

        const response = await axios({
            url: apiUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const filePath = path.resolve(__dirname, 'cache', 'image.jpg');

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on('finish', () => {
            api.sendMessage({
            body: 'here is your image',
            attachment: fs.createReadStream(filePath)
            }, event.threadID, () => {
                fs.unlinkSync(filePath);
            });
        });

        writer.on('error', (err) => {
            console.error(err);
            api.sendMessage("Failed to retrieve image.");
        });

    } catch (error) {
        console.error(error);
        return api.sendMessage("Failed to retrieve image.");
    }
};
