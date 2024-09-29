const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "stream",
  version: "1.1",
  hasPrefix: false,
  hasPermission: 0,
  usePrefix: false,
  commandCategory: "media",
  author: "Cliff",
  description: "Send media from URL",
  longDescription: "Send media (video or audio) from a URL using fs module.",
  category: "𝗠𝗘𝗗𝗜𝗔",
  guide: "{prefix}stream <media URL>",
  usages: "{prefix}stream <media URL>",
  cooldown: 5,
  usage: "{prefix}stream <media URL>",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const mediaURL = args[0];

  if (!mediaURL) {
    return api.sendMessage("Please provide the URL of the media.", event.threadID);
  }

  try {
    const response = await axios.get(mediaURL, { responseType: 'stream' });

    const contentType = response.headers['content-type'];
    let fileExtension = '';

    if (contentType.includes('video/mp4')) {
      fileExtension = 'mp4';
    } else if (contentType.includes('audio/mpeg')) {
      fileExtension = 'mp3';
    } else {
      return api.sendMessage("Unsupported media type.", event.threadID);
    }

    const fileName = `media.${fileExtension}`;
    const mediaStream = fs.createWriteStream(fileName);
    response.data.pipe(mediaStream);

    await new Promise((resolve, reject) => {
      mediaStream.on('finish', resolve);
      mediaStream.on('error', reject);
    });

    await api.sendMessage({
      attachment: fs.createReadStream(fileName)
    }, event.threadID);

    fs.unlinkSync(fileName);

  } catch (error) {
    console.error(error);
    return api.sendMessage("Failed to send the media.", event.threadID);
  }
};

