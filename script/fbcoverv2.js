module.exports.config = {
  name: "fbcoverv2",
  version: "1.0.0",
  role: 0,
  credits: "kim",
  description: "Generate Facebook cover photo v2",
  hasPrefix: false,
  aliases: ["cover2"],
  usage: "[fbcover name | color | address | email | subname | number]",
  cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args, prefix }) {
  try {
      const input = args.join(" ");
      const [name, color, address, email, subname, sdt] = input.split(" ");

      if (!name || !color || !address || !email || !subname || !sdt) {
          return api.sendMessage(`Invalid Usage: Use ${prefix}fbcoverv2 <name>  <color> <address>  <email> <subname> <number>.`, event.threadID);
      }

      const apiUrl = `https://hiroshi-rest-api.replit.app/canvas/fbcoverv2?name=${encodeURIComponent(name)}&color=${encodeURIComponent(color)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&subname=${encodeURIComponent(subname)}&sdt=${encodeURIComponent(sdt)}&uid=${event.senderID}`;

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
      api.sendMessage("An error bawal kana gumamit haha", event.threadID);
  }
};
