const axios = require("axios");

module.exports.config = {
  name: "compile",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  aliases: ['tescode'],
  description: "compile code with various languages",
  usage: "compile [code]",
  credits: '😘',
  cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const code = args.join(" ");
   if (!code) {
     const messageInfo = await new Promise(resolve => {
            api.sendMessage('Please provide a code first', event.threadID, (err, info) => {
                resolve(info);
            });
        });

        setTimeout(() => {
            api.unsendMessage(messageInfo.messageID);
        }, 10000);

        return;
   }
    const language = /^#!\s*\/bin\/bash/.test(code) ? 'bash' :
                     /public\s+class\s+\w+/.test(code) && /public\s+static\s+void\s+main\s*\(/.test(code) ? 'java' :
                     /def\s+\w+\s*\(/.test(code) || /import\s+\w+/.test(code) || code.includes('print(') ? 'python' :
                     /^\s*#include\s+<.*?>/.test(code) || /namespace\s+\w+/.test(code) ? 'cpp' :
                     /^\s*using\s+System/.test(code) || /namespace\s+\w+/.test(code) ? 'csharp' :
                     /^\s*require\s*\(\s*['"][^'"]+['"]\s*\)/.test(code) || /function\s+\w+\s*\(/.test(code) || /console\.log\(/.test(code) ? 'node' :
                     /^\s*import\s+\w+/.test(code) || /function\s+\w+\s*\(/.test(code) ? 'typescript' :
                     /(\bfor\s+\w+\s+in\s+\w+|\bwhile\s+\w+|\becho\s+.*)/.test(code) ? 'bash' : 'unsupported';

    const { data } = await axios.post('https://apiv3-2l3o.onrender.com/compile', {
      language,
      code,
      input: ''
    });
    api.sendMessage(data.output, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage(error.response?.data || error.message, event.threadID, event.messageID);
  }
};