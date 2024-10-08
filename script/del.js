module.exports.config = {
  name: "del",
  version: "1.0.0",
  role: 2,
  credits: "CLIFF",
  description: "delete file",
  aliases: [],
  usages: "{p}delete {filename}",
  hasPrefix: false,
  cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const admin = '61557118090040';
  if (!admin.includes(event.senderID))
   return api.sendMessage("This Command is only for AUTOBOT owner.", event.threadID, event.messageID);
  const fs = require('fs');
  const path = require('path');

  const fileName = args[0];

  if (!fileName) {
    api.sendMessage("Please provide a file name to delete.", event.threadID);
    return;
  }

  const filePath = path.join(__dirname, fileName);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      api.sendMessage(`❎ | Failed to delete ${fileName}.`, event.threadID);
      return;
    }
    api.sendMessage(`✅ ( ${fileName} ) Deleted successfully!`, event.threadID);
  });
};