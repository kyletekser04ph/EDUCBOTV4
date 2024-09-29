const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function getUserName(api, senderID) {
  try {
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID]?.name || "User";
  } catch (error) {
    console.error('Error fetching user name:', error);
    return "User";
  }
}

module.exports.config = {
  name: "fbpost",
  version: "1.0.0",
  role: 0,
  credits: "Cliff", // api by josh
  description: "",
  hasPrefix: false,
  aliases: ["post"],
  usage: "{p}{n} <text>",
  cooldown: 5
};

module.exports.run = async function({ api, event, args }) {
  const text = args.join(" ");

  if (!text) {
    return api.sendMessage("Please provide a text.", event.threadID);
  }

  let name;
  try {
    name = await getUserName(api, event.senderID);
  } catch (error) {
    console.error('Error fetching user name:', error);
    name = "User";
  }

  try {
    const apiUrl = `https://ggwp-yyxy.onrender.com/canvas/fbpost?uid=${event.senderID}&text=${encodeURIComponent(text)}&name=${name}`;

    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const coverPhotoPath = path.join(__dirname, "post.jpg");

    fs.writeFileSync(coverPhotoPath, response.data);

    api.sendMessage({
      body: "",
      attachment: fs.createReadStream(coverPhotoPath)
    }, event.threadID, () => {
      fs.unlinkSync(coverPhotoPath);
    });
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage("An error occurred while processing your request.", event.threadID);
  }
};
