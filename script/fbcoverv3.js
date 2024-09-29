module.exports.config = {
  name: "fbcoverv3",
  version: "1.0.0",
  role: 0,
  credits: "chill",
  description: "Generate Facebook cover photo v2",
  hasPrefix: false,
  aliases: ["cover3"],
  usage: "{pn}fbcoverv3 <name> <birthday> <love> <location> <hometown> <follow> <gender>",
  cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
  try {
      const input = args.join(" ");
      const [name, birthday, love, location, hometown, follow, gender] = input.split(" ");

      if (!name || !birthday || !love || !location || !hometown || !follow || !gender) {
          return api.sendMessage(`Invalid Usage: Use ${module.exports.config.usage}`, event.threadID);
      }

      const userProfileUrl = `https://graph.facebook.com/${event.senderID}/picture?type=large`;
      const profilePicPath = path.join(__dirname, "cache", "profilePic.jpg");

      const profilePicResponse = await axios({
          url: userProfileUrl,
          method: 'GET',
          responseType: 'stream'
      });

      const writer = fs.createWriteStream(profilePicPath);
      profilePicResponse.data.pipe(writer);

      writer.on('finish', async () => {
          const apiUrl = `https://deku-rest-api.gleeze.com/canvas/fbcoverv3?name=${encodeURIComponent(name)}&birthday=${encodeURIComponent(birthday)}&love=${encodeURIComponent(love)}&location=${encodeURIComponent(location)}&hometown=${encodeURIComponent(hometown)}&follow=${encodeURIComponent(follow)}&gender=${encodeURIComponent(gender)}&uid=${event.senderID}`;

          api.sendMessage("🔍 | Generating Your Fbcover canvas...", event.threadID);

          const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
          const coverPhotoPath = path.join(__dirname, "fbCover.jpg");

          fs.writeFileSync(coverPhotoPath, response.data);

          api.sendMessage({
              body: "Here is your Fbcover:",
              attachment: fs.createReadStream(coverPhotoPath)
          }, event.threadID, () => {
              fs.unlinkSync(profilePicPath);
              fs.unlinkSync(coverPhotoPath);
          });
      });

      writer.on('error', (err) => {
          console.error('Stream writer error:', err);
          api.sendMessage("Skills issue", event.threadID);
      });
  } catch (error) {
      console.error('Error:', error);
      api.sendMessage("Skills issue", event.threadID);
  }
};