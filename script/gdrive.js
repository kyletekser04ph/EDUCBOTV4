const axios = require('axios');

module.exports.config = {
  name: "gdrive",
  version: "1.0.1",
  role: 0,
  credits: "Jonell Magallanes",
  description: "Get the URL Download from Video, Audio is sent from the group and Get Google Drive Link No Expired Link",
  hasPrefix: false,
  commandCategory: "Tool",
  usages: "getLink",
  cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  if (event.type !== "message_reply") {
    return api.sendMessage("❌ You need to reply to a message containing an audio, video, or picture", event.threadID, event.messageID);
  }

  const attachments = event.messageReply.attachments;

  if (!attachments || attachments.length === 0) {
    return api.sendMessage("❌ You need to reply to a message containing an audio, video, or picture", event.threadID, event.messageID);
  }

  if (attachments.length > 1) {
    return api.sendMessage("❌ You need to reply to a message containing a single audio, video, or picture", event.threadID, event.messageID);
  }

  const attachmentUrl = attachments[0].url;

  const cliff = await new Promise(resolve => {
    api.sendMessage('Uploading Attachment URL...', event.threadID, (err, info1) => {
      resolve(info1);
    }, event.messageID);
  });

  try {
    const apiUrl = `https://ccprojectprivilege.adaptable.app/api/upload?url=${attachmentUrl}`;

    const response = await axios.get(apiUrl);
    const responseData = response.data;

    api.editMessage(`☁️ 𝗚𝗼𝗼𝗴𝗹𝗲 𝗗𝗿𝗶𝘃𝗲 𝗨𝗽𝗹𝗼𝗮𝗱 𝗙𝗶𝗹𝗲 \n━━━━━━━━━━━━━━━━━━\n${responseData}`, cliff.messageID);
  } catch (error) {
    console.error('Error sending request to external API:', error);
    return api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
  }
}
