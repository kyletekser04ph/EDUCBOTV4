module.exports.config = {
  name: 'shorten',
  version: '1.1.1',
  hasPermssion: 0,
  role: 0,
  credits: "cliff",
  author: '',
  aliases: [],
  description: 'shorten link',
  usePrefix: false,
  hasPrefix: false,
  commandCategory: '',
  usage: '{pn} url',
  cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
  const axios = require('axios');

  const link = args.join('');

  try {
    if (!link) {
      return api.sendMessage('Provide a link you want to shorten', event.threadID, event.messageID);
    }
    const response = await axios.get(`https://betadash-api-swordslush.vercel.app/shorten?link=${link}`);
    api.sendMessage(response.data.data.url, event.threadID);
  } catch (err) {
    console.error(err);
    return api.sendMessage('Skills issue', event.threadID, event.messageID);
  }
};
