let join = {};

join["config"] = {
    name: "thread",
    version: "2.0",
    credits: "Kshitiz",
    cooldowns: 5,
    role: 0,
    hasPrefix: false,
    description: "Join the group that bot is in",
    usage:"{p}thread list {p}thread join number/userid",
};

join["run"] = async function ({ api, event, args, prefix}) {
    try {
        if (args[0] === "list") {
            const groupList = await api.getThreadList(10, null, ['INBOX']);
            const filteredList = groupList.filter(group => group.threadName !== null);

            if (filteredList.length === 0) {
                api.sendMessage('No group chats found.', event.threadID);
            } else {
                const formattedList = filteredList.map((group, index) =>
                    `│${index + 1}. ${group.threadName}\n│𝐓𝐈𝐃: ${group.threadID}\n│𝐓𝐨𝐭𝐚𝐥 𝐦𝐞𝐦𝐛𝐞𝐫𝐬: ${group.participantIDs.length}\n│`
                );
                const message = `╭─╮\n│𝐋𝐢𝐬𝐭 𝐨𝐟 𝐠𝐫𝐨𝐮𝐩 𝐜𝐡𝐚𝐭𝐬:\n${formattedList.map(line => `${line}`).join("\n")}\n╰───────────ꔪ\n𝐌𝐚𝐱𝐢𝐦𝐮𝐦 𝐌𝐞𝐦𝐛𝐞𝐫𝐬 = 100\nUse: ${prefix}thread join [group number] or ${prefix}thread join [group TID]`;

                await api.sendMessage(message, event.threadID);
            }
        } 
        else if (args[0] === "join") {
            if (!args[1]) {
                api.sendMessage('Please provide a group number or TID to join.', event.threadID);
                return;
            }

            const groupIdentifier = args[1];
            const groupList = await api.getThreadList(10, null, ['INBOX']);
            const filteredList = groupList.filter(group => group.threadName !== null);

            let selectedGroup;

            if (!isNaN(groupIdentifier)) {
                const groupIndex = parseInt(groupIdentifier, 10);

                if (groupIndex <= 0 || groupIndex > filteredList.length) {
                    api.sendMessage('Invalid group number. Please choose a valid group.', event.threadID);
                    return;
                }

                selectedGroup = filteredList[groupIndex - 1];
            } 
            else {
                selectedGroup = filteredList.find(group => group.threadID === groupIdentifier);

                if (!selectedGroup) {
                    api.sendMessage('Invalid group TID. Please provide a valid group TID.', event.threadID);
                    return;
                }
            }

            const groupID = selectedGroup.threadID;
            const memberList = await api.getThreadInfo(groupID);

            if (memberList.participantIDs.includes(event.senderID)) {
                api.sendMessage(`You're already in the group chat: ${selectedGroup.threadName}`, event.threadID);
                return;
            }

            if (memberList.participantIDs.length >= 100) {
                api.sendMessage(`The group chat is full: ${selectedGroup.threadName}`, event.threadID);
                return;
            }

            await api.addUserToGroup(event.senderID, groupID);
            api.sendMessage(`You have joined the group chat: ${selectedGroup.threadName}`, event.threadID);
        }
    } catch (error) {
        api.sendMessage('An error occurred. Please try again later.', event.threadID);
    }
};

module.exports = join;
