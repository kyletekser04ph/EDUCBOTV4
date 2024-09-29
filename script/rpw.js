module.exports.config = {
  name: 'rpw',
  version: '1.1.1',
  hasPermssion: 0,
  role: 0,
  credits: "cliff",
  author: '',
  description: 'An powered by openai',
  usePrefix: false,
  hasPrefix: false,
  commandCategory: 'AI',
  usage: '[prompt]',
  cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
  const axios = require('axios');

  let user = args.join(' ');

  try {
      if (!user) {
          return api.sendMessage('Please provide a question first!', event.threadID, event.messageID);
      }

      const cliff = await new Promise(resolve => { api.sendMessage('(𝗥𝗢𝗟𝗘𝗣𝗟𝗔𝗬 𝗙𝗥𝗜𝗘𝗡𝗗𝗟𝗬-𝗔𝗜)\n▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱\n🔍 Searching Please Wait....', event.threadID, (err, info1) => {
      resolve(info1);
     }, event.messageID);
    });

      const response = await axios.get(`https://openapi-idk8.onrender.com/roleplay?query=${encodeURIComponent(user)}&friendly`);

      const responseData = response.data.response;
      const baby = `(𝗥𝗢𝗟𝗘𝗣𝗟𝗔𝗬 𝗙𝗥𝗜𝗘𝗡𝗗𝗟𝗬-𝗔𝗜)\n▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱\n${responseData}`;
      api.editMessage(baby, cliff.messageID);
  } catch (err) {
      console.error(err);
      return api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
