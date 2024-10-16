const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "spt",
  version: "2.0.6",
  role: 0,
  hasPermission: 0,
  credits: "Choru",
  description: "Play a song from Spotify",
  commandCategory: "utility",
  usages: "[title]",
  usage: "[title]",
  usePrefix: false,
  cooldowns: 1,
  hasPrefix: false,
  aliases: ["music","sing"],
  cooldown: 10
};

module.exports.run = async ({ api, event, args }) => {
  const search = args.join(" ");

  try {
    if (!search) {
      const messageInfo = await new Promise(resolve => {
            api.sendMessage('Please provide the name of the song you want to search.', event.threadID, (err, info) => {
                resolve(info);
            });
        });

        setTimeout(() => {
            api.unsendMessage(messageInfo.messageID);
        }, 10000);

        return;
    }

    const findingMessage = await api.sendMessage(`Searching for "${search}"`, event.threadID);

    const apiUrl = `https://betadash-search-download.vercel.app/spt?search=${encodeURIComponent(search)}&apikey=syugg`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.spotify.length > 0) {
      const firstSong = response.data.spotify[0].result;

      const cacheDir = path.join(__dirname, 'cache');
      const fileName = `spt.mp3`;
      const filePath = path.join(cacheDir, fileName);

      fs.ensureDirSync(cacheDir);

      const musicResponse = await axios.get(firstSong, {
        responseType: 'arraybuffer'
      });

      fs.writeFileSync(filePath, Buffer.from(musicResponse.data));

      api.sendMessage({
        body: `Here is your music 👍`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

      api.unsendMessage(findingMessage.messageID);
    } else {
        const t = await new Promise(resolve => {
                api.sendMessage('No songs found for the given title.', event.threadID, (err, info) => {
                    resolve(info);
                });
            });
        
            setTimeout(() => {
                api.unsendMessage(t.messageID);
            }, 10000);
          
            return;
    }
  } catch (error) {
         const tf = await new Promise(resolve => {
                api.sendMessage('No songs found for the given title.', event.threadID, (err, info) => {
                    resolve(info);
                });
            });
        
            setTimeout(() => {
                api.unsendMessage(tf.messageID);
            }, 10000);
          
            return;
  }
};