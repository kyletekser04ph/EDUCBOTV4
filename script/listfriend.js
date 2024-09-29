module.exports.config = {
  name: "listfriend",
  version: "1.0.0",
  role: 2,
  hasPrefix: false,
  credits: "cliff",
  description: "View friends information/Delete friends by command",
  usages: "[page/delete <number|userID>]",
  cooldown: 5
};

module.exports.run = async function ({ event, api, args, prefix }) {
  const { threadID, messageID } = event;

  try {
    const dataFriend = await api.getFriendsList();
    const totalFriends = dataFriend.length;
    const command = args[0] || "page";
    const limit = 10; 

    if (command === "delete") {
      const deleteArgs = args.slice(1);
      let message = "💢Delete Friends💢\n\n";
      for (const input of deleteArgs) {
        let friend = dataFriend.find(f => f.userID === input || dataFriend.indexOf(f) + 1 == input);

        if (friend) {
          api.unfriend(friend.userID);
          message += `- ${friend.fullName || "No name"}\n🌐ProfileUrl: ${friend.profileUrl}\n\n`;
        } else {
          message += `Friend with ID/Number "${input}" not found.\n\n`;
        }
      }
      return api.sendMessage(message, threadID, messageID);
    }

    let page = parseInt(args[1]) || 1;
    page = Math.max(page, 1);

    const totalPages = Math.ceil(totalFriends / limit);
    if (page > totalPages) page = totalPages;

    const listStart = (page - 1) * limit;
    const listEnd = Math.min(listStart + limit, totalFriends);

    let msg = `${totalFriends} TOTAL FRIENDS\n\n`;
    for (let i = listStart; i < listEnd; i++) {
      const friend = dataFriend[i];
      msg += `[ ${i + 1}. ]\n𝗡𝗔𝗠𝗘: ${friend.fullName || "No name"}\n𝗜𝗗: ${friend.userID}\n𝗚𝗘𝗡𝗗𝗘𝗥: ${friend.gender}\n𝗩𝗔𝗡𝗜𝗧𝗬 : ${friend.vanity}\n𝗣𝗿𝗼𝗳𝗶𝗹𝗲_𝗨𝗿𝗹: ${friend.profileUrl}\n\n`;
    }

    msg += `➟ 𝗣𝗔𝗚𝗘 ${page}/${totalPages} \nUse ${prefix}listfriend page <number> to navigate or ${prefix}listfriend delete <number/userID> to delete.\n`;

    return api.sendMessage(msg, threadID, messageID);
  } catch (error) {
    return api.sendMessage("wala kang friends 😀", threadID, messageID);
  }
};
