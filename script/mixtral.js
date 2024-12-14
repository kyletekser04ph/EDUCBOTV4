module.exports.config = {
  name: 'mixtral',
  version: '1.1.1',
  hasPermssion: 0,
  role: 0,
  credits: "cliff",
  author: '',
  description: 'An AI powered by openai',
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

      const cliff = await new Promise(resolve => { api.sendMessage('🔍 Searching Please Wait....', event.threadID, (err, info1) => {
      resolve(info1);
     }, event.messageID);
    });

      const response = await axios.get(`https://api.joshweb.click/api/mixtral-8b?q=${encodeURIComponent(user)}`);

      const responseData = response.data.result;
      const baby = `Պ | 𝗠𝗶𝘅𝘁𝗿𝗮𝗹\n━━━━━━━━━━━━━━━${responseData}\n━━━━━━━━━━━━━━━`;
      api.editMessage(baby, cliff.messageID);
  } catch (err) {
      return api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
