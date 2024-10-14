const fs = require('fs');

module.exports.config = {
  name: "track",
  version: "1.0.0",
  role: 1,
  hasPrefix: false,
  credits: "cliff",
  description: "",
  usage: "{p}track-list",
  cooldown: 0,
};

module.exports.run = async function ({ api, event }) {
  const d = ['61557118090040','100053549552408'];
  if (!d.includes(event.senderID)) {
    return api.sendMessage("This Command is only for AUTOBOT owner.", event.threadID, event.messageID);
  }

  const { threadID, messageID } = event;

  fs.readFile('./public/count.json', 'utf8', (err, data) => {
    if (err) {
      return api.sendMessage("Failed to read count.json", threadID, messageID);
    }

    const jsonData = JSON.parse(data);
    let message = "╭─╮\n│𝐈𝐏-𝐓𝐑𝐀𝐂𝐊-𝐋𝐈𝐒𝐓:\n│\n";

    jsonData.forEach((entry, index) => {
      message += `│${index + 1}.\n│𝐈𝐏: ${entry.ip}\n│𝐂𝐨𝐮𝐧𝐭-𝐑𝐞𝐪: ${entry.count}\n`;
    });

    message += "╰─────────ꔪ";

    api.sendMessage(message.trim(), threadID, messageID);
  });
};

