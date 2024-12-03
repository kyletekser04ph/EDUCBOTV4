const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "say",
  version: "1.0.0",
  role: 0,
  credits: "cliff",
  description: "Text to voice speech messages",
  hasPrefix: false,
  usages: "Text to speech messages",
  cooldown: 0,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const { createReadStream, unlinkSync, ensureDirSync } = fs;
    const { resolve, join } = path;

    const cacheDir = resolve(__dirname, "cache");
    ensureDirSync(cacheDir);


    let content =
      event.type === "message_reply" && event.messageReply.body
        ? event.messageReply.body
        : args.join(" ");

    if (!content) {
      return api.sendMessage(
        "Please provide text to convert to speech",
        event.threadID,
        event.messageID
      );
    }

    const filePath = join(cacheDir, `say.mp3`);

    await downloadFile(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        content
      )}&tl=tl&client=tw-ob`,
      filePath
    );


    return api.sendMessage(
      { attachment: createReadStream(filePath) },
      event.threadID,
      (err) => {
        if (!err) unlinkSync(filePath);
      },
      event.messageID
    );
  } catch (error) {
    api.sendMessage(
      "An error occurred while processing your request.",
      event.threadID,
event.messageID
    );
  }
};

async function downloadFile(url, filePath) {
  const writer = fs.createWriteStream(filePath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}
