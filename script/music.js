const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "music",
  version: "2.0.6",
  role: 0,
  hasPermission: 0,
  credits: "Jonell",
  description: "Play a song from YouTube",
  commandCategory: "utility",
  usage: "[title]",
  usePrefix: false,
  hasPrefix: false,
  aliases: ["sing"],
  cooldown: 0
};

module.exports.run = async ({ api, event, args }) => {
  const search = args.join(" ");

  try {
    if (!search) {
      const messageInfo = await new Promise(resolve => {
        api.sendMessage('𝙿𝙻𝙴𝙰𝚂𝙴 𝙿𝚁𝙾𝚅𝙸𝙳𝙴 𝙰 𝚂𝙾𝙽𝙶 𝚃𝙸𝚃𝙻𝙴', event.threadID, (err, info) => {
          resolve(info);
        });
      });

      setTimeout(() => {
        api.unsendMessage(messageInfo.messageID);
      }, 10000);

      return;
    }

    const findingMessage = await api.sendMessage(`𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶 𝙵𝙾𝚁 "${search}"`, event.threadID);

    const youtubeTrackUrl = `https://dlvc.vercel.app/yt-audio?search=${encodeURIComponent(search)}`;
    const trackResponse = await axios.get(youtubeTrackUrl);

    const { downloadUrl, title } = trackResponse.data;

    const cacheDir = path.join(__dirname, 'cache');
    const fileName = `music.mp3`;
    const filePath = path.join(cacheDir, fileName);

    fs.ensureDirSync(cacheDir);

    const audioStream = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(filePath, Buffer.from(audioStream.data));

    api.sendMessage({
      body: `💽 Now playing: ${title}`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

    api.unsendMessage(findingMessage.messageID);
  } catch (error) {
    const errorMessage = await new Promise(resolve => {
      api.sendMessage('[ERROR] ' + error, event.threadID, (err, info) => {
        resolve(info);
      });
    });

    setTimeout(() => {
      api.unsendMessage(errorMessage.messageID);
    }, 10000);

    return;
  }
};
