const axios = require('axios');

module.exports.config = {
  name: "moonshot",
  version: "9",
  role: 0,
  hasPrefix: false,
  credits: "Cliff", //api by kiff
  description: "AI powered by command R",
  aliases: [],
  cooldowns: 0,
};
module.exports.run = async function ({api, event, args}) {
  const symbols = ["⎔", "⏍", "⌘"];
  const randomIndex = Math.floor(Math.random() * symbols.length);
  const tae = symbols[randomIndex];
  const query = encodeURIComponent(args.join(" "));

if (!query) {
          return api.sendMessage('Please provide a question first!', event.threadID, event.messageID);
      }

      const cliff = await new Promise(resolve => { api.sendMessage('🔍 Searching Please Wait....', event.threadID, (err, info1) => {
      resolve(info1);
     }, event.messageID);
    });

  const apiUrl = `https://www.vertearth.cloud/api/moonshot?prompt=${query}`;

  try {
    const response = await axios.get(apiUrl);
    const ans = response.data.response;
    api.editMessage(`
❨ ◯ | 𝗠𝗢𝗢𝗡𝗦𝗛𝗢𝗧\n━━━━━━━━━━━━━━━━━━\n${ans}\n━━━━━━━━━━━━━━━━━━`, cliff.messageID);
  } catch (error) {
    console.error();
    api.sendMessage("API SUCKS", event.threadID, event.messageID);
  }
};

