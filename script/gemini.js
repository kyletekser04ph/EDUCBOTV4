module.exports.config = {
  name: "gemini",
  role: 0,
  credits: "Deku",
  description: "Talk to Gemini (conversational)",
  hasPrefix: false,
  version: "5.6.7",
  aliases: ["bard"],
  usage: "gemini [prompt]"
};

module.exports.run = async function ({ api, event, args }) {
  const symbols = ["▞", "✦", "✧", "✦", "⟡", "ᯤ"];
  const randomIndex = Math.floor(Math.random() * symbols.length);
  const i = ["https://i.imgur.com/VN9ugwO.jpeg", "https://i.imgur.com/qpInllD.jpeg"];
  const k = Math.floor(Math.random() * i.length);
  const g = i[k];
  const tae = symbols[randomIndex];
  const axios = require("axios");
  let prompt = encodeURIComponent(args.join(" ")),
      uid = event.senderID,
      url;
  if (!prompt) {
             const tf = await new Promise(resolve => {
                api.sendMessage('please provide a prompt', event.threadID, (err, info) => {
                    resolve(info);
                });
            });

            setTimeout(() => {
                api.unsendMessage(tf.messageID);
            }, 10000);

            return;
  }

  try {
    const geminiApi = `https://haji-mix.onrender.com`;
    if (event.type == "message_reply") {
      if (event.messageReply.attachments[0]?.type == "photo") {
        url = encodeURIComponent(event.messageReply.attachments[0].url);
        const res = (await axios.get(`https://kaiz-apis.gleeze.com/api/gemini-vision?q=${prompt}&uid=${event.senderID}&imageUrl=${url}`)).data;
const r = `${tae} | 𝗚𝗘𝗠𝗜𝗡𝗜-𝗙𝗟𝗔𝗦𝗛\n━━━━━━━━━━━━━━━━━━\n${res.response}\n━━━━━━━━━━━━━━━━━━`;

        return api.sendMessage(r, event.threadID);
      } else {
        return api.sendMessage('Please reply to an image.', event.threadID);
      }
    }

    const y = await axios.get(g, { responseType: 'stream' });
    const response = (await axios.get(`http://sgp1.hmvhostings.com:25721/gemini?question=${prompt}`)).data;
    const d = `${tae} | 𝗚𝗘𝗠𝗜𝗡𝗜-𝗙𝗟𝗔𝗦𝗛\n━━━━━━━━━━━━━━━━━━\n${response.answer}\n━━━━━━━━━━━━━━━━━━`;    
    return api.sendMessage(d, event.threadID);
  } catch (error) {
    return api.sendMessage({body: '404 NOT FOUND', attachment: y.data}, event.threadID);
  }
};