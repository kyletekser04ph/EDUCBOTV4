module.exports.config = {
  name: 'gpt4o',
  version: '1.1.1',
  hasPermssion: 0,
  role: 0,
  credits: "cliff",
  author: '',
  description: 'An powered by openai',
  usePrefix: false,
  hasPrefix: false,
  commandCategory: 'AI',
  usage: '[prompt]',
  cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
  const axios = require('axios');
  const userid = event.senderID;
  let user = args.join(' ');

  try {
    if (!user) {
      const messageInfo = await new Promise(resolve => {
              api.sendMessage('Please provide a question first!', event.threadID, (err, info) => {
                  resolve(info);
              });
          });
          setTimeout(() => {            api.unsendMessage(messageInfo.messageID);
          }, 5000);         
          return;
    }

    const cliff = await new Promise(resolve => { 
      api.sendMessage('֎ | Searching Please Wait....', event.threadID, (err, info1) => {
        resolve(info1);
      }, event.messageID);
    });

    const response = await axios.get(`https://markdevs-last-api-s7d0.onrender.com/gpt4?prompt=${encodeURIComponent(user)}&uid=${userid}`);

    const responseData = response.data.gpt4;

    const baby = `֎ | 𝗚𝗣𝗧-𝟰𝗢 [𝗖𝗢𝗡𝗩𝗘𝗥𝗦...]\n━━━━━━━━━━━━━━━━━━\n${responseData}\n━━━━━━━━━━━━━━━━━━\n𖣓 𝚄𝚂𝙴 "𝙲𝙻𝙴𝙰𝚁" 𝚃𝙾 𝚁𝙴𝚂𝙴𝚃 𝙲𝙾𝙽𝚅𝙴𝚁𝚂𝙰𝚃𝙸𝙾𝙽.`;
    api.editMessage(baby, cliff.messageID);
  } catch (err) {
             const tf = await new Promise(resolve => {
                api.sendMessage('Error Api sucks', event.threadID, (err, info) => {
                    resolve(info);
                });
            });
        
            setTimeout(() => {
                api.unsendMessage(tf.messageID);
            }, 10000);
          
            return;
  }
};
