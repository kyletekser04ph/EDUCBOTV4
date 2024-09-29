module.exports.config = {
  name: 'gpt4turbo',
  version: '1.1.1',
  hasPermssion: 0,
  role: 0,
  author: 'hazey_api',
  description: 'An AI powered Antarctic',
  usePrefix: false,
  hasPrefix: false,
  commandCategory: 'AI',
  usage: '[prompt]',
  cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
  const axios = require('axios');

  function formatFont(text) {
      const fontMapping = {
          a: '𝚊', b: '𝚋', c: '𝚌', d: '𝚍', e: '𝚎', f: '𝚏', g: '𝚐', h: '𝚑', i: '𝚒', j: '𝚓', k: '𝚔', l: '𝚕', m: '𝚖',
          n: '𝚗', o: '𝚘', p: '𝚙', q: '𝚚', r: '𝚛', s: '𝚜', t: '𝚝', u: '𝚞', v: '𝚟', w: '𝚠', x: '𝚡', y: '𝚢', z: '𝚣',
          A: '𝙰', B: '𝙱', C: '𝙲', D: '𝙳', E: '𝙴', F: '𝙵', G: '𝙶', H: '𝙷', I: '𝙸', J: '𝙹', K: '𝙺', L: '𝙻', M: '𝙼',
          N: '𝙽', O: '𝙾', P: '𝙿', Q: '𝚀', R: '𝚁', S: '𝚂', T: '𝚃', U: '𝚄', V: '𝚅', W: '𝚆', X: '𝚇', Y: '𝚈', Z: '𝚉',
      };

      return text.split('').map((char) => fontMapping[char] || char).join('');
  }

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

      const cliff = await new Promise(resolve => { api.sendMessage('֎ | 𝗚𝗣𝗧𝟰-𝗧𝗨𝗥𝗕𝗢 (AI)\n━━━━━━━━━━━━━━━━━━━ \n🔍 Searching Please Wait....', event.threadID, (err, info1) => {
      resolve(info1);
     }, event.messageID);
    });

      const response = await axios.get(`https://markdevs-api.onrender.com/api/v2/gpt4?query=${encodeURIComponent(user)}`);

      const responseData = response.data;
      const content = formatFont(responseData.respond);
      const baby = `֎ | 𝗚𝗣𝗧𝟰-𝗧𝗨𝗥𝗕𝗢 (AI)\n━━━━━━━━━━━━━━━━━━━ \n🖋️ Ans: '${content}`;

      api.editMessage(baby, cliff.messageID);
  } catch (err) {
                        const tf = await new Promise(resolve => {
                api.sendMessage('error api sucks' + err, event.threadID, (err, info) => {
                    resolve(info);
                });
            });
        
            setTimeout(() => {
                api.unsendMessage(tf.messageID);
            }, 10000);
          
            return;
  }
};
