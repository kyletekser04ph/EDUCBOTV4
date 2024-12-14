const axios = require("axios");
const fs = require("fs");

const fontMapping = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
    'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
    'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
    'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
    'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
    'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
    'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇'
};

function convertToBold(text) {
    return text.replace(/(?:\*\*(.*?)\*\*|## (.*?)|### (.*?))/g, (match, boldText, h2Text, h3Text) => {
        const targetText = boldText || h2Text || h3Text;
        return [...targetText].map(char => fontMapping[char] || char).join('');
    });
}

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
  let prompt = encodeURIComponent(args.join(" ")),
      uid = event.senderID,
      url;

  if (!prompt) {
    const tf = await new Promise(resolve => {
      api.sendMessage('Please provide a prompt', event.threadID, (err, info) => {
        resolve(info);
      });
    });

    setTimeout(() => {
      api.unsendMessage(tf.messageID);
    }, 10000);

    return;
  }

  try {
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

    const attachments = [];
    const imageUrls = response.imageUrls;

    if (imageUrls && imageUrls.length > 0) {
      for (let i = 0; i < imageUrls.length; i++) {
        try {
          const imageUrl = imageUrls[i];
          const img = (await axios.get(imageUrl, { responseType: "arraybuffer" })).data;
          const imageFilePath = __dirname + `/cache/gemini_image_url_${i}.jpg`;
          fs.writeFileSync(imageFilePath, Buffer.from(img, "binary"));
          attachments.push(fs.createReadStream(imageFilePath));
        } catch (error) {R
        }
      }
    }

    const g = convertToBold(response.answer);

    api.sendMessage({
      body: `${tae} | 𝗚𝗘𝗠𝗜𝗡𝗜-𝗙𝗟𝗔𝗦𝗛\n━━━━━━━━━━━━━━━━━━\n${g}\n━━━━━━━━━━━━━━━━━━`,
      attachment: attachments,
    }, event.threadID, (err, info) => {
      if (err) return console.error(err);

      attachments.forEach((attachment) => {
        try {
          const filePath = attachment.path;
          if (filePath) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
        }
      });
    });

  } catch (error) {
    return api.sendMessage({body: '404 NOT FOUND', attachment: y.data}, event.threadID);
  }
};
