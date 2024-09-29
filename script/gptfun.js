const { get } = require('axios');

module.exports.config = {
  name: 'gptfun',
  credits: "cliff",
  version: '1.0.0',
  role: 0,
  hasPermission: 0,
  aliases: [],
  cooldown: 0,
  hasPrefix: false,
  description: "Random model selection",
  usage: "{p}{n} <Your_questions>",
  cooldowns: 0,
  usePrefix: false,
  usages: "{p}{n} <Your_questions>",
  commandCategory: "GPT",
};

module.exports.run = async function({ api, event, args }) {
  const question = args.join(" ");

  if (!question) {
    const messageInfo = await new Promise(resolve => {
              api.sendMessage('Please provide a question first!', event.threadID, (err, info) => {
                  resolve(info);
              });
          });
          setTimeout(() => {            api.unsendMessage(messageInfo.messageID);
          }, 5000);         
          return;
  }

  try {
    await api.sendMessage('🔍 Searching, please wait...', event.threadID);

    const response = await get(`https://betadash-api-swordslush.vercel.app/gptfun?question=${encodeURIComponent(question)}`);
    const answer = response.data.gptfun;
    const cleanResponseData = answer.replace(/\n欢迎使用 公益站! 站长合作邮箱：wxgpt@qq.com<br\/>/, '');

    if (response.data && cleanResponseData) {
      api.sendMessage(cleanResponseData, event.threadID, event.messageID);
    } else {
      api.sendMessage('❌ Sorry, I could not retrieve an answer. Please try again later.', event.threadID, event.messageID);
    }
  } catch (error) {
    api.sendMessage('❌ An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
  }
};
