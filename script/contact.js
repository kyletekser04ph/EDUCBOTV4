const fs = require('fs');
const path = require('path');

async function getUserName(api, senderID) {
  try {
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID]?.name || "User";
  } catch (error) {
    console.log(error);
    return "User";
  }
}

const autofont = {
  sansbold: {
    a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶",
    j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿",
    s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇",
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
    J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
    S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
    " ": " "
  },
};

const textToAutofont = (text, font) => {
  const convertedText = [...text].map(char => font[char] || char).join("");
  return convertedText;
};


module.exports["config"] = {
    name: "adminoti",
    version: "1.0.0",
    credits: "developer",
    role: 2, 
    usage: "[prefix]sessionadminoti",
    hasPrefix: false,
    cooldown: 0
};

module.exports["run"] = async function ({ api, event, args, prefix, admin }) {
    try {
        const allowedUserIDs = ["61565022752745"]; 
        const senderID = event.senderID.toString();
        if (!admin.includes(event.senderID))
   return api.sendMessage("This Command is only for 𝗘𝗱𝘂𝗰-𝗯𝗼𝘁 owner.", event.threadID, event.messageID);

        const notificationMessage = args.join(" ");

        const historyPath = path.join('./data/history.json');
        if (!fs.existsSync(historyPath)) {
            throw new Error("History file does not exist.");
        }

        const name = await getUserName(api, admin);
        const ye = "Cliff Vincent";
        const ad = textToAutofont(`${name}`, autofont.sansbold);
        const du = textToAutofont(`${ye}`, autofont.sansbold);
  let mentions = [];
    mentions.push({
        tag: name,
        id: event.senderID,
    });

        const historyData = fs.readFileSync(historyPath, 'utf-8');
        const historyJson = JSON.parse(historyData);
        var l = require("moment-timezone").tz("Asia/Manila").format("HH:mm:ss D/MM/YYYY");
        const baby = `━━━『OWNER』━━━\n\n👑𝗢𝘄𝗻𝗲𝗿: ${du}\n👤𝗔𝗱𝗺𝗶𝗻𝗯𝗼𝘁: ${ad}\n💬𝗠𝗲𝘀𝘀𝗮𝗴𝗲:\n━━━━━━━━━━━━━━━━━━\n${notificationMessage}\n━━━━━━━━━━━━━━━━━━\n⏰𝗧𝗶𝗺𝗲: ${l}`;

        for (const session of historyJson) {
            const adminUID = session.admin[0]; 
            try {
                await api.sendMessage(baby,adminUID);
            } catch (error) {
                api.sendMessage(`Failed to send notification to UID ${adminUID}: ${error.message}`);
            }
        }

        api.sendMessage("Notifications sent to all admins.", event.threadID);
    } catch (error) {
        api.sendMessage("An error occurred. Please try again later.", event.threadID);
    }
};
