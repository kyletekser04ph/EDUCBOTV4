const path = require("path");
const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "vimeo",
  version: "9",
  credits: "Cliff",
  description: "Downloader",
  commandCategory: "media",
  hasPermssion: 0,
  cooldowns: 9,
  usages: "[vimeo [search]",
  role: 0,
  hasPrefix: false,
};

module.exports.run = async function ({ api, args, event }) {
  try {
    const searchQuery = args.join(" ");
    if (!searchQuery) {
      const messageInfo = await new Promise(resolve => {
            api.sendMessage('Usage: vimeo <url>', event.threadID, (err, info) => {
                resolve(info);
            });
        });

        setTimeout(() => {
            api.unsendMessage(messageInfo.messageID);
        }, 10000);

        return;
    }

 const ugh = await new Promise(resolve => { api.sendMessage(`Downloading please wait...`, event.threadID, (err, info1) => {
      resolve(info1);
     }, event.messageID);
    });

    const response = await axios.get(`https://betadash-search-download.vercel.app/vimeo?url=${encodeURIComponent(searchQuery)}`);

    const data = response.data;
    const videoUrl = data.url;
    const title = data.title;
    const thumbnail = data.thumbnail;

    const videoPath = path.join(__dirname, "cache", "viimeo.mp4");

    const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer" });

    fs.writeFileSync(videoPath, Buffer.from(videoResponse.data));

api.unsendMessage(ugh.messageID);

    await api.sendMessage(
      {
        body: `Downloaded Successfull`,
        attachment: fs.createReadStream(videoPath),
      },
      event.threadID,
      event.messageID
    );
    fs.unlinkSync(videoPath);
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
