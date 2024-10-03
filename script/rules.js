module.exports.config = {
  name: "rules",
  version: "1.0.2",
  role: 2,
  credits: "cliff",
  description: "Rules of the group",
  hasPrefix: false,
  cooldowns: 5,
  aliases: [],
};

const rules = `
🌟 GROUP RULES 🌟

1. 🚫 Do not buy/sell in group
2. ⚠️ Do not change the box information
3. ❌ No pedophilia/18+
4. 🚷 LGBTQ+ SUPPORT IS STRICTLY PROHIBITED
5. 🤬 Do not use disrespectful words to each other
6. 🖼️ Error reports must include photos/videos
7. 🗣️ Please use only Tagalog or English
8. 🚫 No simping allowed
9. 🙅‍♂️ Don't mention @everyone
10. 📵 No bot talk without admin's permission
11. 🚫 Restricted: "Shortcut/Shorts" command
12. 🛑 No criticizing races/people/groups
13. ✋ Do not share political memes/photos
14. 😂 If you're having fun, take others' fun actions lightly
15. 🤖 Pretending to be a bot is prohibited
16. 🎮 Don’t use Gemini for games
17. 📝 No albums without permission
18. 🔞 No 18+ content
19. 🌙 Don't mention Cliff at night

Follow the rules, be kind!`;

module.exports.run = async function ({ api, event }) {
  api.sendMessage(rules, event.threadID, event.messageID);
};
