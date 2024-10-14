module.exports.config = {
  name: 'qwen',
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
  const uid = event.senderID;

  let user = args.join(' ');

  try {
      if (!user) {
          return api.sendMessage('Please provide a question first!', event.threadID, event.messageID);
      }

      const cliff = await new Promise(resolve => { api.sendMessage('🔍 Searching Please Wait....', event.threadID, (err, info1) => {
      resolve(info1);
     }, event.messageID);
    });

      const response = await axios.get(`https://www.vertearth.cloud/api/Qwen1.572BChat?prompt=${encodeURIComponent(user)}`);

      const responseData = response.data.msg;
      const baby = `𝗤𝗪𝗘𝗡-1.572𝗕\n▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱\n${responseData}\n▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱`;
      api.editMessage(baby, cliff.messageID);
  } catch (err) {
      return api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};