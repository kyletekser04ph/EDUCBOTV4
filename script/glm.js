const { get } = require('axios');

module.exports.config = {
  name: 'glm',
  credits: "cliff",
  version: '1.0.0',
  role: 0,
  hasPermission: 0,
  aliases: [],
  cooldown: 0,
  hasPrefix: false,
  description: "",
  usage: "{p}{n} <Your_questions>",
  cooldowns: 0,
  usePrefix: false,
  usages: "{p}{n} <Your_questions>",
  commandCategory: "GLM",
};

module.exports.run = async function({ api, event, args }) {
  const search = args.join(" ");

  if (!search) {
    return api.sendMessage('Please provide a question first!', event.threadID, event.messageID);
  }

  try {
    const syugg = await api.sendMessage('🔍 Searching, please wait...', event.threadID);

    const response = await get(`https://nethwieai.neth.workers.dev/ai?model=@hf/nexusflow/starling-lm-7b-beta&system=&user=${encodeURIComponent(search)}`);

    if (response.data && response.data.msg) {
      api.sendMessage(response.data.msg, event.threadID, event.messageID);
    api.unsendMessage(syugg.messageID);
    } else {
      api.sendMessage('❌ Sorry, I could not retrieve an answer. Please try again later.', event.threadID, event.messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage('❌ An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
  }
};
