const axios = require('axios');

let fuck = {};

fuck["config"] = {
  name: "riddle",
  aliases: [],
  version: "1.0.0",
  credits: "KA TIAN JHYY",
  cooldown: 3,
  role: 0,
  hasPrefix: false,
  shortDescription: "➜ Fetch a random riddle",
  longDescription: "➜ Retrieve a random riddle for some fun!",
  category: "𝗚𝗔𝗠𝗘𝗦",
  usage: "➜ {p}riddle",
};

fuck["run"] = async function ({ api, event }) {
  const { threadID, messageID } = event;

  api.sendMessage("⚙ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗿𝗶𝗱𝗱𝗹𝗲...", threadID, messageID);

  try {
    const response = await axios.get('https://riddles-api.vercel.app/random');
    const data = response.data;

    if (!data || !data.riddle) {
      return api.sendMessage(
        "🥺 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗳𝗶𝗻𝗱 𝗮 𝗿𝗶𝗱𝗱𝗹𝗲.",
        threadID,
        messageID
      );
    }

    const riddle = data.riddle;
    api.sendMessage(`🧩 𝗛𝗲𝗿𝗲 𝗶𝘀 𝘁𝗵𝗲 𝗿𝗶𝗱𝗱𝗹𝗲:\n\n${riddle}`, threadID, messageID);
  } catch (error) {
    api.sendMessage(
      `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}`,
      threadID,
      messageID
    );
  }
};

module.exports = fuck;
