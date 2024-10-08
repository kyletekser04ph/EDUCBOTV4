const fs = require("fs-extra");
const axios = require("axios");

let m = {};
m["config"] = {
  name: "mark",
  version: "1.0.1",
  role: 0,
  hasPrefix: false,
  credits: "cliff",
  description: "Comment on the board",
  commandCategory: "game",
  usages: "[text]",
  cooldowns: 5,
};

m["run"] = async function({ api, event, args }) {
  const pathImg = __dirname + '/cache/markngu.png';
  const text = args.join(" ");

  if (!text) return api.sendMessage("Enter the content of the comment on the board", event.threadID, event.messageID);	

  try {
      const response = await axios.get(`https://api-canvass.vercel.app/mark?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });

      await fs.writeFile(pathImg, response.data);

      return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
  } catch (error) {
      return api.sendMessage("API SUCKS", event.threadID, event.messageID);
  }        
}

module.exports = m;
