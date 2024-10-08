const axios = require("axios");

module.exports.config = {
  name: "tanjiro",
  credits: "AkhiroDEV",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  description: "A conversational AI with a clear function",
  usage: "{p}{n} <message> | clear"
};

module.exports.run = async function({ api, event, args }) {
  const user = event.senderID;
  const query = args.join(" ").trim();

  switch (query.toLowerCase()) {
    case "clear":
      try {
        await axios.get(`https://akhirotech.onrender.com/api/clear?userId=${encodeURIComponent(user)}`);
        return api.sendMessage("Your conversation has been cleared.", event.threadID, event.messageID);
      } catch (error) {
        return api.sendMessage(`ERROR: Unable to clear the conversation. ${error.message}`, event.threadID, event.messageID);
      }

    default:
      if (!query) {
        return api.sendMessage("Please provide a query.", event.threadID, event.messageID);
      }
      try {
        const AkhiroTECH = await axios.get(`https://akhirotech.onrender.com/api?model=tanjiro&q=${encodeURIComponent(query)}&userId=${user}`);
        const reply = AkhiroTECH.data.message;
        return api.sendMessage(reply, event.threadID, event.messageID);
      } catch (error) {
        return api.sendMessage(`ERROR: ${error.message}`, event.threadID, event.messageID);
      }
  }
};