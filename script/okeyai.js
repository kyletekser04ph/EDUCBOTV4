const axios = require('axios');

module.exports.config = {
    name: 'okeyai',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    description: "An AI command powered by OpenAI",
    usages: "",
    credits: 'Developer',
    cooldown: 5,
};

module.exports.run = async function({ api, event, args }) {
    if (!args[0]) {
        api.sendMessage("Please provide a question", event.threadID);
        return;
    }

    const question = args.join(" ");
    const apiUrl = `https://www.vertearth.cloud/api/okeyai?prompt=${encodeURIComponent(question)}`;

    try {
        const response = await axios.get(apiUrl);
        api.sendMessage(response.data.response, event.threadID, event.messageID);
    } catch (error) {
        api.sendMessage("An error occurred while processing your request. Please try again later.", event.threadID);
    }
};

