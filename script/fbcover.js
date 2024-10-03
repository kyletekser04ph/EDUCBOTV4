module.exports.config = {
  name: "fbcover",
  version: "1.0.0",
  role: 0,
  credits: "Cliff", //api by mark
  description: "Generate Facebook cover photo v2",
  hasPrefix: false,
  aliases: ["cover"],
  usage: "{p}{n}fbcover <name> <id> <subname>",
  cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    const input = args.join(" ");
    const [name, id, subname] = input.split(" ");
    if (!name || !id || !subname) {
        return api.sendMessage(`Invalid Usage: Use ${module.exports.config.usage}`, event.threadID);
    }

    try {
        const apiUrl = `https://markdevs-api.onrender.com/api/canvas/fbcover1?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}&subname=${encodeURIComponent(subname)}`;

    const message = await api.sendMessage(`Generating Your Fbcover canvas...`, event.threadID);

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const coverPhotoPath = path.join(__dirname, "cache", "fbCover.jpg");

        fs.writeFileSync(coverPhotoPath, response.data);

api.unsendMessage(message.messageID);

        api.sendMessage({
            body: "Here is your Fbcover ❤️",
            attachment: fs.createReadStream(coverPhotoPath)
        }, event.threadID, () => {
            fs.unlinkSync(coverPhotoPath);
        });
    } catch (error) {
        api.sendMessage("Error occurred while generating the cover photo.", event.threadID);
    }
};
