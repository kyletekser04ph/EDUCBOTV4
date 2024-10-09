const axios = require('axios');

async function getUserName(api, senderID) {
  try {
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID]?.name || "User";
  } catch (error) {
    console.log("Error fetching user info:", error);
    return "User";
  }
}

module.exports.config = {
  name: "fuck",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  credits: "Cliff",
  description: "Tag a user and initiate some fun interaction",
  usages: "{p}{n} mention",
  cooldown: 5,
  aliases: []
};

module.exports.run = async function ({ api, event }) {
  try {
    const mentionID = Object.keys(event.mentions)[0] || (event.messageReply && event.messageReply.senderID);

    if (!mentionID) {
      return api.sendMessage('Please mention or reply a user you want to fuck!', event.threadID, event.messageID);
    }

    const userInfo = await api.getUserInfo(mentionID);
    const realName = userInfo[mentionID]?.name;

    const url = `https://api-canvass.vercel.app/fuck?one=${event.senderID}&two=${mentionID}`;

    let senderName = await getUserName(api, event.senderID);
    let mentions = [
      { tag: senderName, id: event.senderID }
    ];

    let response = await axios.get(url, { responseType: 'stream' });

    const message = {
      body: `Ugh, sige pa! ${realName}`, 
      mentions: mentions, 
      attachment: response.data,
    };

    api.sendMessage(message, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage(`An error occurred: ${error.message}`, event.threadID, event.messageID);
  }
};

