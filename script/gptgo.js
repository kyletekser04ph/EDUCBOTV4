module.exports.config = {
  name: 'gptgo',
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
          const messageInfo = await new Promise(resolve => {
              api.sendMessage('Please provide a question first!', event.threadID, (err, info) => {
                  resolve(info);
              });
          });
          setTimeout(() => {            api.unsendMessage(messageInfo.messageID);
          }, 5000);         
          return;
      }

      const cliff = await new Promise(resolve => { api.sendMessage('[ ▸ ] | 𝗚𝗣𝗧𝗚𝗢\n━━━━━━━━━━━━━━━━━━━ \n🔍 Searching Please Wait....', event.threadID, (err, info1) => {
      resolve(info1);
     }, event.messageID);
    });

      const response = await axios.get(`https://for-devs.onrender.com/api/gpt4turbo?query=${encodeURIComponent(user)}&imageUrl=&apikey=api1&uid=${uid}`);

      const responseData = response.data.result;
      const baby = `[ ▸ ] | 𝗚𝗣𝗧-𝗚𝗢\n━━━━━━━━━━━━━━━━━━━ \n${responseData}\n━━━━━━━━━━━━━━━━━━━`;
      api.editMessage(baby, cliff.messageID);
  } catch (err) {
      return api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};