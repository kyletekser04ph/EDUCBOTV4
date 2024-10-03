async function getUserName(api, senderID) {
  try {
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID]?.name || "User";
  } catch (error) {
    console.log(error);
    return "User";
  }
}

module.exports.config = {
  name: "user",
  version: "1.0",
  role: 2,
  hasPermision: 2,
  credits: "cliff",
  description: "Block and unblock a user",
  hasPrefix: false,
  usePrefix: false,
  commandCategory: "Admin",
  usage: "{p}user block/unblock @mention, reply, senderID",
  aliases: ["block", "unblock", "ban"],
  cooldown: 0,
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const { mentions, messageReply, threadID, messageID } = event;
  const command = args[0];
  let mentionID = Object.keys(mentions)[0] || (messageReply && messageReply.senderID);

  if (!mentionID) {
    return api.sendMessage(`Please mention the user you want to ${command}.`, threadID, messageID);
  }

  if (command === 'block') {
    api.sendMessage("🛡️ | You have been blocked due to spamming.", mentionID);
    api.sendMessage(`🚫 | ${await getUserName(api, mentionID)} has been successfully blocked.`, threadID, messageID);
    api.changeBlockedStatus(mentionID, true);
  } else if (command === 'unblock') {
    api.sendMessage("🔓 | You have been unblocked.", mentionID);
    api.sendMessage(`✅ | ${await getUserName(api, mentionID)} has been successfully unblocked.`, threadID, messageID);
    api.changeBlockedStatus(mentionID, false);
  } else {
    api.sendMessage(`Invalid command. Use "block" or "unblock".`, threadID, messageID);
  }
};
