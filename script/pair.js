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
    var tl = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%"];
        var tle = tl[Math.floor(Math.random() * tl.length)];
        let dataa = await api.getUserInfo(event.senderID);
        let namee = await dataa[event.senderID].name;
        let loz = await api.getThreadInfo(event.threadID);
        var emoji = loz.participantIDs;
        var id = emoji[Math.floor(Math.random() * emoji.length)];
        let data = await api.getUserInfo(id);
        let name = await data[id].name
        var arraytag = [];
                arraytag.push({id: event.senderID, tag: namee});
                arraytag.push({id: id, tag: name});

        var sex = await data[id].gender;
        var gender = sex == 2 ? "Male🧑" : sex == 1 ? "Female👩‍  " : "Gay";

  let url = `https://api.popcat.xyz/ship?user1=https://api-canvass.vercel.app/profile?uid=${event.senderID}&user2=https://api-canvass.vercel.app/profile?uid=${id}`;
  let response = await axios.get(url, { responseType: 'stream' });

  api.sendMessage({
    body: `Congrats ${namee} has been paired with ${name}\nThe Match rate is: ${tle}`, mentions: arraytag,
    attachment: response.data
  }, threadID, messageID);
};