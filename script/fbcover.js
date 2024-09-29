module.exports.config = {
  name: "fbcover",
  version: "1.0.0",
  role: 0,
  credits: "Cliff", //api by kim
  description: "Generate Facebook cover photo v2",
  hasPrefix: false,
  aliases: ["cover"],
  usage: "{p}{n}fbcover <name> <id> <subname> <color>",
  cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    const input = args.join(" ");
    const [name, id, subname, color] = input.split(" ");
    if (!name || !id || !subname || !color) {
        return api.sendMessage(`Invalid Usage: Use ${module.exports.config.usage}`, event.threadID);
    }

    try {
        const apiUrl = `https://hiroshi-rest-api.replit.app/canvas/fbcoverv1?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}&subname=${encodeURIComponent(subname)}&color=${encodeURIComponent(color)}`;

        api.sendMessage("🔍 | Generating Your Fbcover canvas...", event.threadID);

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const coverPhotoPath = path.join(__dirname, "fbCover.jpg");

        fs.writeFileSync(coverPhotoPath, response.data);

        api.sendMessage({
            body: "Here is your Fbcover ❤️",
            attachment: fs.createReadStream(coverPhotoPath)
        }, event.threadID, () => {
            fs.unlinkSync(coverPhotoPath);
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("Error nadaw sabi ng api", event.threadID);
    }
};
