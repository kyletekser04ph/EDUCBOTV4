const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "faceswap",
  hasPrefix: false,
  role: 0,
  hasPermission: false,
  commandCategory: "no prefix",
  usePrefix: false,
  cooldown: 5,
  cooldowns: 5,
  aliases: ["swap"],
  description: "Generate image",
  usages: "{pn} reply to image",
  usage: "{pn} reply to image",
  credits: "samir"
};

module.exports.run = async function({ api, event }) {
  try {
    let urlMain, urlFace;
    if (event.type === "message_reply") {
      const attachments = event.messageReply.attachments;
      if (attachments.length < 2) return api.sendMessage("Please reply with two images for the face swap.", event.threadID);

      if (attachments[0].type !== "photo" || attachments[1].type !== "photo") {
        return api.sendMessage("Both attachments must be images.", event.threadID);
      }

      urlMain = attachments[0].url;
      urlFace = attachments[1].url;
      const apiUrl = `https://www.samirxpikachu.run.place/faceswap?mainimg=${encodeURIComponent(urlMain)}&faceimg=${encodeURIComponent(urlFace)}`;

      const response = await axios({
        url: apiUrl,
        method: 'GET',
        responseType: 'arraybuffer',
        headers: {
          'authority': 'www.samirxpikachu.run.place',
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });
    const yu = await axios.get(response, { responseType: 'stream' });
      const buffer = Buffer.from(response.data, 'binary');
      const outputPath = path.join(__dirname, 'faceswap_result.jpg');
      fs.writeFileSync(outputPath, buffer);

      return api.sendMessage({ attachment: yu.data}, event.threadID); // fs.createReadStream(outputPath) }, event.threadID);
    } else {
      return api.sendMessage("Please reply to a message containing two images.", event.threadID);
    }
  } catch (e) {
    return api.sendMessage(e.message, event.threadID);
  }
}
