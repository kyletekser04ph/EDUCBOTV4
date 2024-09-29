const axios = require("axios");

let k = {};

k["config"] = {
  name: "ocr",
  version: "1.1",
  credits: "dipto",
  cooldown: 5,
  role: 0,
  hasPrefix: false,
  description: "The `ocr` command allows you to extract text from images.",
  usage: "{pn} reply to an image"
};

k["run"] = async function({ event: yazky, api: dipto }) {
  try {
    const link = yazky.messageReply.attachments[0].url || args.join(" ");
    if (!link) return api.sendMessage('Please reply to an image.', yazky.threadID, yazky.messageID);

    const response = await axios.get(`https://www.noobs-api.000.pe/dipto/ocr?imageUrl=${encodeURIComponent(link)}`);
    api.sendMessage(`${response.data.dipto}`, yazky.threadID, yazky.messageID);
  } catch (error) {
    dipto.sendMessage("Malabo ang picture.", yazky.threadID, yazky.messageID);
  }
};

module.exports = k;