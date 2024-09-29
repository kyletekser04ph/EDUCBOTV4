const axios = require('axios');

module.exports.config = {
  name: "proxy",
  version: "9",
  role: 0,
  hasPrefix: false,
  credits: "Cliff",
  description: "random proxy",
  aliases: ["prox"],
  cooldowns: 0,
};

module.exports.run = async function ({ api, event}) {
  const cliff = await new Promise(resolve => { api.sendMessage('Generating Proxy...', event.threadID, (err, info1) => {
      resolve(info1);
     }, event.messageID);
    });
  try {
    const response = await axios.get('https://proxy-gen-random.vercel.app/proxy/one');
    const { ip, port, code, country, type, updated, https, httpsurl, url } = response.data;
    
    const message = `Proxy Details:\n\n- IP: ${ip}\n- Port: ${port}\n- Code: ${code}\n- Country: ${country}\n- Type: ${type}\n- Updated: ${updated}\n- HTTPS: ${https}\n- HTTPS URL: ${httpsurl}\n- URL: ${url}`;

    api.editMessage(message, cliff.messageID);
  } catch (error) {
    console.error("Error:", error);
    api.sendMessage("An error occurred while fetching the response.", event.threadID, event.messageID);
  }
};
