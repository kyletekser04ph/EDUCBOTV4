const axios = require('axios');

module.exports.config = {
  name: 'ai2',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: [],
  description: "An AI command powered by GPT-4",
  usages: "ai [prompt]",
  credits: 'Developer',
  cooldowns: 3,
  dependencies: {
    "axios": ""
  }
};

module.exports["run"] = async function({ api, event, args }) {
  const input = args.join(' ');

  if (!input) {
    api.sendMessage(`Please provide a question or statement after 'ai2'. For example: 'ai What is the capital of France?'`, event.threadID, event.messageID);
    return;
  }

  if (input === "clear") {
    try {
      await axios.post('https://gaypt4ai.onrender.com/clear', { id: event.senderID });
      return api.sendMessage("Chat history has been cleared.", event.threadID, event.messageID);
    } catch {
      return api.sendMessage('An error occurred while clearing the chat history.', event.threadID, event.messageID);
    }
  }

  api.sendMessage(`🔍 "${input}"...`, event.threadID, event.messageID);

  try {
    const url = event.type === "message_reply" && event.messageReply.attachments[0]?.type === "photo"
      ? { link: event.messageReply.attachments[0].url }
      : {};

    const { data } = await axios.post('https://gaypt4ai.onrender.com/chat', {
      prompt: input,
      customId: event.senderID,
      ...url
    });
    api.sendMessage(`𖣐 | 𝗚𝗣𝗧-𝟰 𝗢𝗠𝗡𝗜\n━━━━━━━━━━━━━━━━━━\n${data.message}\n━━━━━━━━━━━━━━━━━━\n⬣ 𝚄𝚂𝙴 "𝙲𝙻𝙴𝙰𝚁" 𝚃𝙾 𝚁𝙴𝚂𝙴𝚃 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽.`, event.threadID, event.messageID);
  } catch {
    api.sendMessage('API SUCKS', event.threadID, event.messageID);
  }
};