const axios = require('axios');

module.exports.config = {
  name: "pair",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  credits: "Cliff",
  description: "",
  usages: "{p}pair or {p}pair mention",
  cooldown: 5,
  aliases: []
};

module.exports.run = async function ({ api, event, args }) {
const { threadID, messageID, senderID } = event;
  let mentionID = Object.keys(event.mentions)[0];
  let pairingID = mentionID || event.senderID;

  let tl = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%"];
  let tle = tl[Math.floor(Math.random() * tl.length)];

  let senderData = await api.getUserInfo(event.senderID);
  let senderName = senderData[event.senderID].name;

  let pairData = await api.getUserInfo(pairingID);
  let pairName = pairData[pairingID].name;

  let loz = await api.getThreadInfo(event.threadID);
  let emoji = loz.participantIDs;
  let randomID = emoji[Math.floor(Math.random() * emoji.length)];
  let randomData = await api.getUserInfo(randomID);
  let randomName = randomData[randomID].name;

  let arraytag = [
    { id: event.senderID, tag: senderName },
    { id: randomID, tag: randomName }
  ];

  let sex = randomData[randomID].gender;
  let gender = sex == 2 ? "Male🧑" : sex == 1 ? "Female👩‍" : "Tran Duc Bo";

  let url = `https://api.popcat.xyz/ship?user1=https://api-canvass.vercel.app/profile?uid=${event.senderID}&user2=https://api-canvass.vercel.app/profile?uid=${pairingID}`;
  let response = await axios.get(url, { responseType: 'stream' });

  api.sendMessage({
    body: `Congrats ${senderName} has been paired with ${randomName}\nThe Match rate is: ${tle}`,
    mentions: arraytag,
    attachment: response.data
  }, threadID, messageID);
};
