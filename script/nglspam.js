const { NGL } = require('ngl.js');
const ngl = new NGL();

module.exports.config = {
  name: 'nglspamm',
  version: '1.0.1',
  role: 0,
  hasPrefix: false,
  aliases: ['ngl'],
  description: "NGL Spammer",
  usage: "nglspamm [username] [message] [amount]",
  credits: 'Cliff',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const [username, message, amount] = args;
  const responseDiv = { className: '', textContent: '' };
  const logs = [];

  if (!username || !message || isNaN(amount) || amount <= 0) {
    responseDiv.className = 'error';
    responseDiv.textContent = 'Usage: nglspamm [username] [message] [amount]';
    api.sendMessage(responseDiv.textContent, event.threadID, event.messageID);
    return;
  }

  responseDiv.textContent = 'Sending messages...';
  api.sendMessage(responseDiv.textContent, event.threadID, event.messageID);

  for (let i = 0; i < amount; i++) {
    try {
      await ngl.sendMessage(username, message);
      logs.push(`Message ${i + 1} sent successfully`);
      console.log(`Message ${i + 1} sent successfully`);
    } catch (error) {
      console.error(`Error sending message ${i + 1}:`, error);
      logs.push(`Error sending message ${i + 1}`);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));  
  }

  responseDiv.className = 'success';
  responseDiv.textContent = `All messages successfully sent.`;
  api.sendMessage(responseDiv.textContent, event.threadID, event.messageID);
  api.sendMessage(logs.join('\n'), event.threadID, event.messageID);
};
