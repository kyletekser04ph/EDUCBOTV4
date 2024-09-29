const moment = require("moment");
const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "github",
  credits: "junjam",
  cooldown: 5,
  version: "587",
  role: 0,
  hasPrefix: false,
  description: "info github",
};

module.exports.run = async function ({ api, event, args }) {
  if (!args[0]) {
    return api.sendMessage("Please provide a GitHub username!", event.threadID, event.messageID);
  }

  try {
    const response = await axios.get(`https://api.github.com/users/${encodeURI(args.join(" "))}`);
    const body = response.data;

    if (body.message) {
      return api.sendMessage("User not found. Please provide a valid username!", event.threadID, event.messageID);
    }

    const { login, avatar_url, name, id, html_url, public_repos, followers, following, location, created_at, bio } = body;
    const info = `>>${login} Information!<<\n\nUsername: ${login}\nID: ${id}\nBio: ${bio || "No Bio"}\nPublic Repositories: ${public_repos || "None"}\nFollowers: ${followers}\nFollowing: ${following}\nLocation: ${location || "No Location"}\nAccount Created: ${moment.utc(created_at).format("dddd, MMMM Do YYYY")}\nAvatar:`;

    const imageBuffer = await axios.get(avatar_url, { responseType: "arraybuffer" }).then((res) => res.data);
    const avatarPath = `${__dirname}/cache/avatargithub.png`;
    fs.writeFileSync(avatarPath, imageBuffer);  // Removed "utf-8" encoding

    api.sendMessage(
      {
        attachment: fs.createReadStream(avatarPath),
        body: info,
      },
      event.threadID,
      () => fs.unlinkSync(avatarPath)
    );
  } catch (err) {
    console.error(err);
    api.sendMessage("An error occurred while fetching the user's information. Please try again later.", event.threadID, event.messageID);
  }
};