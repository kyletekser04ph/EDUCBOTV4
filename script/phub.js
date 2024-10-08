const { get } = require('axios');
const fs = require('fs');
const path = require('path');

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
  name: "phub",
  version: "1.0.1",
  role: 0,
  hasPrefix: false,
  credits: "Cliff",
  description: "",
  usages: "{p}{n} mention",
  cooldown: 5,
  aliases: ["fbhack"]
};

module.exports.run = async function ({ api, event, args }) {
  const mentionID = Object.keys(event.mentions)[0];
  const senderID = event.senderID;
const text = args.join(" ");

    if (!text) return api.sendMessage("provide a text first you want to comment on pornhub", event.threadID, event.messageID);	

  const realName = mentionID 
    ? (await api.getUserInfo(mentionID))[mentionID]?.name 
    : (await api.getUserInfo(senderID))[senderID]?.name;

  if (!realName) {
    return api.sendMessage('Could not retrieve the real name.', event.threadID, event.messageID);
  }

  const url = `https://api-canvass.vercel.app/phub?text=${encodeURIComponent(text)}&name=${realName}&id=${mentionID || senderID}`;
  const filePath = path.join(__dirname, 'cache', 'phub.png');

  try {
    let response = await get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(filePath, Buffer.from(response.data, "utf8"));

    let name = await getUserName(api, event.senderID);
    let mentions = [
      {
        tag: name,
        id: event.senderID
      }
    ];

    api.sendMessage({ attachment: fs.createReadStream(filePath) }, event.threadID, () => {
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};
