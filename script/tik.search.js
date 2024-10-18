module.exports.config = {
  name: "tiktok",
  version: "1.0.0",
  role: 0,
  credits: "cliff",
  description: "tiktok search videos",
  hasPrefix: false,
  aliases: ["tik"],
  usage: "[Tiktok <search>]",
  cooldown: 5,
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
  try {
    const searchQuery = args.join(" ");
    if (!searchQuery) {
    const messageInfo = await new Promise(resolve => {
            api.sendMessage("Usage: tiktok <search text>", event.threadID, (err, info) => {
                resolve(info);
            });
        });

        setTimeout(() => {
            api.unsendMessage(messageInfo.messageID);
        }, 10000);

        return;
  }

    const ugh = api.sendMessage("⏱️ | Searching, please wait...", event.threadID, event.messageID);

    const response = await axios.get(`https://betadash-search-download.vercel.app/tiksearch?search=${encodeURIComponent(searchQuery)}`);

    const videoData = response.data;

    if (!videoData || !videoData.url) {
      api.sendMessage("No videos found for the given search query.", event.threadID);
      return;
    }

    const videoUrl = videoData.url;
    const message = `𝐓𝐢𝐤𝐭𝐨𝐤 𝐫𝐞𝐬𝐮𝐥𝐭:\n\n𝐓𝐢𝐭𝐥𝐞: ${videoData.title}\n𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧: ${videoData.duration}s\n𝐑𝐞𝐠𝐢𝐨𝐧: ${videoData.region}`;

    const filePath = path.join(__dirname, 'cache', 'tiktok_video.mp4');
    const writer = fs.createWriteStream(filePath);

    const videoResponse = await axios({
      method: 'get',
      url: videoUrl,
      responseType: 'stream'
    });

    videoResponse.data.pipe(writer);

    writer.on('finish', () => {

api.unsendMessage(ugh.messageID);
      
      api.sendMessage(
        { body: message, attachment: fs.createReadStream(filePath) },
        event.threadID, event.messageID,
        () => fs.unlinkSync(filePath)
      );
    });
  } catch (error) {
    api.sendMessage("An error occurred while processing the request.", event.threadID);
  }
};
