const axios = require('axios');
const gif = 'https://i.imgur.com/xnWVcVz.gif';

module.exports.config = {
    name: "prefix",
    version: "1.0.1",
    role: 0,
    credits: "",
    description: "Display the prefix of your bot",
    hasPrefix: false,
    usages: "prefix",
    cooldown: 5,
    aliases: ["prefix", "Prefix", "PREFIX", "prefi"],
};

module.exports.run = async function ({ api, event, prefix, admin }) {
    try {
        const userid = await api.getCurrentUserID();
        const bodyText = `Yo, my prefix is [ 𓆩 ${prefix} 𓆪 ]\n\n𝗦𝗢𝗠𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗧𝗛𝗔𝗧 𝗠𝗔𝗬 𝗛𝗘𝗟𝗣 𝗬𝗢𝗨:\n➥ ${prefix}help [number of page] -> see commands\n➥ ${prefix}sim [message] -> talk to bot\n➥ ${prefix}callad [message] -> report any problem encountered\n➥ ${prefix}help [command] -> information and usage of command\n\nHave fun and enjoy using my bot❤️`;

        const response = await axios.get(gif, { responseType: 'stream' });
        api.sendMessage({
            body: bodyText,
            attachment: response.data
        }, event.threadID);
    } catch (error) {
        api.sendMessage('Sorry, I don\'t have a prefix', event.threadID);
    }
};
