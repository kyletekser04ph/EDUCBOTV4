const axios = require('axios');

const responseUrl = "https://chorawrs-sheshh.vercel.app/gogo1s?q=";

module.exports.config = {
  name: "gogo",
  version: "1.0.0",
  role: 0,
  credits: "cliff",
  description: "",
  hasPrefix: false,
  aliases: ["gog"],
  usage: "{pn} <title> <episode>",
  cooldown: 5
};

module.exports.run = async function({ api, event, args }) {
  try {
    const input = args.join(" ");
    const [q, ep] = input.split(" ");

    if (!q || !ep) {
      return api.sendMessage(`Invalid Usage: Use ${module.exports.config.usage}`, event.threadID);
    }

    const url = `${responseUrl}${encodeURIComponent(q)}&ep=${encodeURIComponent(ep)}`;
    const response = await axios.get(url);

    if (response.data) {
      return api.sendMessage(response.data, event.threadID, event.messageID);
    } else {
      return api.sendMessage("No data found.", event.threadID, event.messageID);
    }
  } catch (error) {
    return api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};
