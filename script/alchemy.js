const axios = require('axios');

let canvas = {};

canvas["config"] = {
  name: "alchemy",
  version: "1.0",
  credits: "Samir",
  cooldown: 5,
  hasPrefix: false,
  role: 0,
  description: {
    vi: "",
    en: "Generate a response using the Alchemy API."
  },
  category: "𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥",
  usage: {
    vi: "{pn} <text>",
    en: "{pn} <text>"
  }
};

canvas["run"] = async function ({ api, event, args }) {
  if (args.length === 0) {
    return api.sendMessage("Please provide some text.", event.threadID);
  }

  const text = args.join(' ');

  const domainPart1 = 'https://www.samirxpikachu';
  const domainPart2 = '.run';
  const domainPart3 = '.place';

  const apiUrl = `${domainPart1}${domainPart2}${domainPart3}/alchemy?text=${encodeURIComponent(text)}`;

  api.sendMessage("Processing your request, please wait...", async (err, info) => {
    const id = info.messageID;
    try {
      const imageStream = await axios.get(apiUrl, { responseType: 'stream' });
      api.unsendMessage(id);
      api.sendMessage({
        body: `Here is your image:`,
        attachment: imageStream.data
      });
    } catch (error) {
      api.sendMessage(`Error: ${error.message}`, event.threadID);
    }
  });
};

module.exports = canvas;
