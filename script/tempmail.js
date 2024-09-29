const axios = require("axios");

module.exports.config = {
    name: "tempm",
    version: "1.0",
    author: "cliff",
    countDown: 5,
    hasPrefix: false,
    cooldown: 5,
    role: 0,
    description: {
        en: "generate temporary email and retrieve inbox messages",
        vi: "generate temporary email and retrieve inbox messages",
    },
    commandCategory: "tool",
    usages: "{pn} gen\n{pn} inbox (email) |  {pn} create (email)",
};

module.exports.run = async function ({ api, args, event }) {
    const command = args[0];

    try {
        if (command === "gen") {
            const response = await axios.get(`https://temp-teach-mail-syuzz.vercel.app/api/generate_email`);
            const email = response.data.email;

            return api.sendMessage(`ɢᴇɴᴇʀᴀᴛᴇᴅ ᴛᴇᴍᴘᴏʀᴀʀʏ ᴇᴍᴀɪʟ:\n\n${email}`, event.threadID);

        } else if (command === "inbox") {
            const email = args[1];

            if (!email) {
                return api.sendMessage("Please provide a valid email address for retrieving inbox messages.", event.threadID);
            }

            const inboxResponse = await axios.get(`https://temp-teach-mail-syuzz.vercel.app/api/inbox?email=${email}`);
            const inbox = inboxResponse.data.data;
            let subject = inboxResponse.map(item => item.subject).join('\n\n');
            let uid = inboxResponse.map(item => item.uid).join('\n\n');
            let date = inboxResponse.map(item => item.date).join('\n\n');
            let message_id = inboxResponse.map(item => item.message_id).join('\n\n');

            if (inboxMessages.length === 0) {
                return api.sendMessage(`No messages found for ${email}.`, event.threadID);
            }

            return api.sendMessage(`Inbox messages for ${email}:\n\n${inbox}\n${subject}\n${uid}\n${date}\n${message_id}`, event.threadID);

        } else if (command === "create") {
            const email = args[1];

            if (!email) {
                return api.sendMessage("Please provide a valid email address to create.", event.threadID);
            }

            const createResponse = await axios.get(`https://temp-teach-mail-syuzz.vercel.app/api/create_email?email=${email}`);
            const createdEmail = createResponse.data.error;

            return api.sendMessage(`${createdEmail}`, event.threadID);

        } else {
            return api.sendMessage("Invalid command. Use {pn} gen, {pn} inbox (email), or {pn} create (email).", event.threadID);
        }
    } catch (error) {
        console.error(error);
        return api.sendMessage("An error occurred. Please try again later.", event.threadID);
    }
};
