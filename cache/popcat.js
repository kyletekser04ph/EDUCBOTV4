const axios = require('axios');

module.exports.config = {
  name: "popcat-auto-reply",
  version: "1.0",  
  credits: "cliff",
};

module.exports.handleEvent = async function ({ api, event }) {
  if (event.body) {
    const input = event.body;

    let { messageID, threadID } = event;
    let tid = threadID,
        mid = messageID;

    const res = await axios.get(`https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(input)}&owner=Cliff+Vincent&botname=Pop+Cat`);
    const respond = res.data.response;
    if (res.data.error) {
      api.sendMessage(`Error: ${res.data.error}`, tid,mid);
    } else {
      api.sendMessage(respond, tid, mid);
    }
  }
};