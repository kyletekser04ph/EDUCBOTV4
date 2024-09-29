const axios = require('axios');

const i = ["https://i.imgur.com/VN9ugwO.jpeg", "https://i.imgur.com/qpInllD.jpeg"];
  const k = Math.floor(Math.random() * i.length);
  const g = i[k];

async function getAnswerFromAI(user, userID) {
    const services = [
        { url: `https://deku-rest-api.gleeze.com/ai/nemotron?q=${encodeURIComponent(user)}&uid=${userID}` },
    ];

    for (const service of services) {
        const data = await fetchFromAI(service.url);
        if (data) return data;
    }

    throw new Error("No valid response from any AI service");
}

async function fetchFromAI(url) {
    try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.status && data.result) {
            console.log();
            return data.result;
        } else {
            throw new Error("No valid response from AI");
        }
    } catch (error) {
        console.error(); 
        return null;
    }
}

async function getAIResponse(input, userId, messageID) {
    const q = input.trim() || "";
    try {
        const response = await getAnswerFromAI(q, userId);
        return { response, messageID };
    } catch (error) {
        console.error();
        throw error;
    }
}

let lastResponseMessageID = null;

module.exports.config = {
  name: 'nemo',
  version: '1.1.1',
  hasPermssion: 0,
  role: 0,
  credits: "cliff", //api  by deku_juswa
  author: '',
  created: "June 21, 2024 => fully fixed Sept 5, 2024",
  description: 'AI powered by NVIDIA',
  usePrefix: false,
  hasPrefix: true,
  commandCategory: 'AI',
  usage: '[prompt]',
  cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
    let user = args.join(' ');
    const userID = event.senderID;
const y = await axios.get(g, { responseType: 'stream' });
    try {
        if (!user) {
            const messageInfo = await new Promise(resolve => {
            api.sendMessage('Please provide a question first!', event.threadID, (err, info) => {
                resolve(info);
            });
        });

        setTimeout(() => {
            api.unsendMessage(messageInfo.messageID);
        }, 10000);

        return;
        }

        const response = await axios.get(`https://joshweb.click/ai/nemotron?q=${encodeURIComponent(user)}&uid=${userID}`);

        const responseData = response.data.result;
        const baby = 
`☃ | 𝗡 𝗘 𝗠 𝗢 𝗧 𝗥 𝗢 𝗡\n━━━━━━━━━━━━━━━━━━\n${responseData}\n━━━━━━━━━━━━━━━━━━\n۞ Reply this message if you want to continue the conversation`;
        api.sendMessage(baby, event.threadID, event.messageID);
    } catch (err) {
        return api.sendMessage({body: "API SUCKS PLEASE CHECK", attachment: y.data}, event.threadID, event.messageID);
    }
};

module.exports.handleEvent = async function ({ event, api }) {
    const messageContent = event.body.trim().toLowerCase();
    if ((event.messageReply && event.messageReply.senderID === api.getCurrentUserID()) || (messageContent.startsWith("nemo") && event.senderID !== api.getCurrentUserID())) {
        const input = messageContent.replace(/^nemo\s*/, "").trim();
        try {
            const { response, messageID } = await getAIResponse(input, event.senderID, event.messageID);
            lastResponseMessageID = messageID;
            api.sendMessage(`☃ | 𝗡 𝗘 𝗠 𝗢 𝗧 𝗥 𝗢 𝗡\n━━━━━━━━━━━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━━━━\n۞ Reply this message if you want to continue the conversation`, event.threadID, messageID);
        } catch (error) {
            api.sendMessage({body: "API SUCKS PLEASE CHECK", attachment: y.data}, event.threadID, messageID);
        }
    }
};