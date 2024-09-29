module.exports.config = {
  name: "out",
  version: "1.0.0",
  role: 2,
  hasPrefix: false,
  credits: "Developer",
  description: "Bot leaves the thread",
  usages: "out",
  cooldowns: 10,
};

module.exports.run = async function({ api, event, args, admin }) {
  const leave = args.join(" ");
let threadInfo = await api.getThreadInfo(leave);

  try {
    if (!args[0]) {
      await api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
    } else if (!isNaN(args[0])) {
      await api.removeUserFromGroup(api.getCurrentUserID(), leave);
    }
    api.sendMessage(`Successfull left on\n⇒𝗧𝗵𝗿𝗲𝗮𝗱𝗡𝗮𝗺𝗲: ${threadInfo.threadName}\n⇒𝗧𝗵𝗿𝗲𝗮𝗱𝗜𝗗: ${leave}`, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage(`Error leaving the thread: ${error.message}`, event.threadID, event.messageID);
  }
};
