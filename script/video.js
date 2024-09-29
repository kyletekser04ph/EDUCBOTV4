const path = require("path");
const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "video",
  version: "9",
  credits: "Cliff", //api by jonell & churo
  description: "Search video from YouTube",
  commandCategory: "media",
  hasPermssion: 0,
  cooldowns: 9,
  usages: "[video [search]",
  role: 0,
  hasPrefix: false,
};

module.exports.run = async function ({ api, args, event }) {
  try {
    const searchQuery = args.join(" ");
    if (!searchQuery) {
      const messageInfo = await new Promise(resolve => {
            api.sendMessage('Usage: video <search text>', event.threadID, (err, info) => {
                resolve(info);
            });
        });

        setTimeout(() => {
            api.unsendMessage(messageInfo.messageID);
        }, 10000);

        return;
    }

    const ugh = api.sendMessage(`⏱️ | Searching, for '${searchQuery}' please wait...`, event.threadID);

    api.setMessageReaction("🕥", event.messageID, (err) => {}, true);

    const response = await axios.get(`https://betadash-api-swordslush.vercel.app/video?search=${encodeURIComponent(searchQuery)}`);

    const data = response.data;
    const videoUrl = data.downloadUrl;
    const title = data.title;
    const thumbnail = data.thumbnail;

    const videoPath = path.join(__dirname, "cache", "video.mp4");

    const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer" });

    fs.writeFileSync(videoPath, Buffer.from(videoResponse.data));

    api.setMessageReaction("✅", event.messageID, (err) => {}, true);

    await api.sendMessage(
      {
        body: `Here's your video, enjoy!🥰\n\n𝗧𝗶𝘁𝘁𝗹𝗲: ${title}`,
        attachment: fs.createReadStream(videoPath),
      },
      event.threadID,
      event.messageID
    );
    fs.unlinkSync(videoPath);
    api.unsendMessage(ugh.messageID);
  } catch (error) {
             const tf = await new Promise(resolve => {
                api.sendMessage(error.message, event.threadID, (err, info) => {
                    resolve(info);
                });
            });
        
            setTimeout(() => {
                api.unsendMessage(tf.messageID);
            }, 10000);
          
            return;
  }
};