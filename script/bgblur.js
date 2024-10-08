const axios = require('axios');
const fs = require('fs');
const path = require('path');

let tae = {};

tae["config"] = {  
    name: "bgblur",
    version: "1.0",
    credits: "Samir Œ",
    cooldown: 5,
    hasPrefix: false,
    role: 0,
    description: {
      vi: "Tạo ảnh ảo giác từ ảnh gốc",
      en: "Create an illusion image from the original image"
    },
    usage: {
      vi: "{pn} [prompt] - Trả lời một hình ảnh với lệnh này",
      en: "{pn} [prompt] - Reply to an image with this command"
    }
  };

tae["run"] = async function ({ api, args, message, event }) {
    const { messageReply } = event;
    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return api.sendMessage("Please reply to an image with this command.", event.threadID);
    }

    const imageUrl = messageReply.attachments[0].url;
    const prompt = args.join(" ") || "34";

    try {
      const response = await axios.get(`https://betadash-api-swordslush.vercel.app/shorten?link=${encodeURIComponent(imageUrl)}`);
      const shortLink = response.data.url;

      const illusionUrl = `https://samirxpikachuiox.onrender.com/bgblur?url=${encodeURIComponent(shortLink)}&strength=${encodeURIComponent(prompt)}`;
      const imageResponse = await axios.get(illusionUrl, { responseType: 'arraybuffer' });
      const imagePath = path.join(__dirname, 'cache', 'blurredImage.png');

      fs.writeFileSync(imagePath, imageResponse.data);

      await api.sendMessage({
        attachment: fs.createReadStream(imagePath),
      }, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(`An error occurred: ${error.message}`, event.threadID);
    }
};

module.exports = tae;