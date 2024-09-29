const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "sc",
  version: "2.0.6",
  role: 0,
  hasPermission: 0,
  credits: "Jonell",
  description: "Play a song from SoundCloud",
  commandCategory: "utility",
  usages: "[title]",
  usage: "[title]",
  usePrefix: false,
  cooldowns: 1,
  hasPrefix: false,
  aliases: ["soundcloud"],
  cooldown: 1
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

    const soundCloudTrackUrl = `https://betadash-search-download.vercel.app/sc?search=${encodeURIComponent(search)}`;
    const trackResponse = await axios.get(soundCloudTrackUrl, {
      responseType: 'arraybuffer'
    });

    const cacheDir = path.join(__dirname, 'cache');
    const fileName = `${Date.now()}.mp3`;
    const filePath = path.join(cacheDir, fileName);

    fs.ensureDirSync(cacheDir);

    fs.writeFileSync(filePath, Buffer.from(trackResponse.data));

    api.sendMessage({
      body: `𝙷𝙴𝚁𝙴 𝙸𝚂 𝚈𝙾𝚄𝚁 𝙼𝚄𝚂𝙸𝙲 𝙵𝚁𝙾𝙼 𝚂𝙾𝚄𝙽𝙳 𝙲𝙻𝙾𝚄𝙳`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
    api.unsendMessage(findingMessage.messageID);
  } catch (error) {
           const tf = await new Promise(resolve => {
              api.sendMessage('[ERROR]'+ error, event.threadID, (err, info) => {
                    resolve(info);
                });
            });
        
            setTimeout(() => {
                api.unsendMessage(tf.messageID);
            }, 10000);
          
            return;
  }
};
