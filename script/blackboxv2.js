const axios = require('axios');

module.exports.config = {
  name: "blackboxv2",
  version: "9",
  role: 0,
  hasPrefix: false,
  credits: "Cliff", //api by kenlie
  description: "AI powered by blackbox",
  aliases: [],
  cooldowns: 0,
};

module.exports.run = async function ({api, event, args}) {
  const query = encodeURIComponent(args.join(" "));

if (!query) {
        const messageInfo = await new Promise(resolve => {
            api.sendMessage('Please provide a question first!', event.threadID, (err, info) => {
                resolve(info);
            });
        });

        setTimeout(() => {
            api.unsendMessage(messageInfo.messageID);
        }, 10000);

        return;
}

      const cliff = await new Promise(resolve => 
    { api.sendMessage('🔍 Searching Please Wait....', event.threadID, (err, info1) => {
      resolve(info1);
     }, event.messageID);
    });

  const apiUrl = `\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0068\u0061\u0073\u0074\u0065\u0062\u0069\u006e\u0075\u0070\u006c\u006f\u0061\u0064\u002d\u0067\u0068\u006f\u0073\u0074\u002d\u0032\u0064\u0065\u0036\u0031\u0031\u0032\u0065\u002e\u0076\u0065\u0072\u0063\u0065\u006c\u002e\u0061\u0070\u0070\u002f\u0062\u006c\u0061\u0063\u006b\u0062\u006f\u0078\u003f\u0071\u0075\u0065\u0073\u0074\u0069\u006f\u006e\u003d${query}`;

  try {
      const response = await axios.get(apiUrl);
      const ans = response.data.blackbox;   
    api.editMessage(`⬛ | 𝗕𝗟𝗔𝗖𝗞𝗕𝗢𝗫 (ASSISTANT)\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n${ans}`, cliff.messageID);
  } catch (error) {
    console.error("Error:", error);
    api.sendMessage("An error occurred while fetching the response.", event.threadID, event.messageID);
  }
};
