const axios = require('axios');

let a = {};

a["config"] = {
  name: "autobot",
  aliases: ["fbbot"],
  description: "This command makes your account a bot",
  hasPrefix: false,
  credits: "cliff",
  usage: "{p}autobot online  {p}autobot create <reply_message_state> <prefix> <bot_name> <adminName> <your_uid>",
  version: "1.0.0",
  role: 2,
  cooldown: 0
};

a["run"] = async ({ api, event, args, admin, prefix }) => {
  if (!admin.includes(event.senderID))
    return api.sendMessage("This command is only for AUTOBOT owner.", event.threadID, event.messageID);

function formatFont(text) {
      const fontMapping = {
          a: '𝚊', b: '𝚋', c: '𝚌', d: '𝚍', e: '𝚎', f: '𝚏', g: '𝚐', h: '𝚑', i: '𝚒', j: '𝚓', k: '𝚔', l: '𝚕', m: '𝚖',
          n: '𝚗', o: '𝚘', p: '𝚙', q: '𝚚', r: '𝚛', s: '𝚜', t: '𝚝', u: '𝚞', v: '𝚟', w: '𝚠', x: '𝚡', y: '𝚢', z: '𝚣',
          A: '𝙰', B: '𝙱', C: '𝙲', D: '𝙳', E: '𝙴', F: '𝙵', G: '𝙶', H: '𝙷', I: '𝙸', J: '𝙹', K: '𝙺', L: '𝙻', M: '𝙼',
          N: '𝙽', O: '𝙾', P: '𝙿', Q: '𝚀', R: '𝚁', S: '𝚂', T: '𝚃', U: '𝚄', V: '𝚅', W: '𝚆', X: '𝚇', Y: '𝚈', Z: '𝚉',
      };

      return text.split('').map((char) => fontMapping[char] || char).join('');
  }


function formatFontt(text) { 
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };

  return text.split('').map((char) => fontMapping[char] || char).join('');
  }


  const input = args[0];
  let input_state, input_prefix, input_botName, input_adminName, input_admin;

  if (event.type === "message_reply") {
    input_state = event.messageReply.body;
    input_prefix = args[1];
    input_botName = args[2];
    input_adminName = args[3];
    input_admin = args[4];
  }

  if (!input) {
    return api.sendMessage(
      `This command makes your account a bot by providing requirements. Use: autobot online or autobot create <reply_message_state> <prefix> <botName> <adminName> <admin_uid>`,
      event.threadID,
      event.messageID
    );
  } else if (input === "online") {
    try {
      const cliff = await new Promise(resolve => {
        api.sendMessage('⏳ Checking active session, Please wait...', event.threadID, (err, info1) => {
          resolve(info1);
        }, event.messageID);
      });      
 const g = "https://i.imgur.com/xkNfU7q.jpeg";     
      const j = await axios.get(g, { responseType: 'stream' });
      const urlsz = "http://fred.hidencloud.com:25711/info";
      const responsee = await axios.get(urlsz);
      const aiList = responsee.data;

      let message = "";
      if (Array.isArray(aiList)) {
        aiList.forEach((result, index) => {
          const { name, profileUrl, time } = result;
          const days = Math.floor(time / (3600 * 24));
          const hours = Math.floor((time % (3600 * 24)) / 3600);
          const minutes = Math.floor((time % 3600) / 60);
          const seconds = Math.floor(time % 60);
const bayot = formatFontt(name);
const lubot = formatFontt(`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`);
          message += `[ ${index + 1} ]\n𝗡𝗔𝗠𝗘: ${bayot}\n𝗨𝗣𝗧𝗜𝗠𝗘: ${lubot}\n\n`;
        });
        api.editMessage(`𝙻𝚒𝚜𝚝 𝚘𝚏 𝙰𝚌𝚝𝚒𝚟𝚎 𝙱𝚘𝚝𝚜.\n\n${message}`, cliff.messageID);
      } else {
        api.sendMessage("Error: aiList is not an array.", event.threadID, event.messageID);
      }
    } catch (err) {
      api.sendMessage(err.message, event.threadID, event.messageID);
      console.log();
    }
  } else if (input === "create") {
    if (!input_state || !input_prefix || !input_botName || !input_adminName || !input_admin) { 
      return api.sendMessage(`Invalid usage: Use ${prefix}autobot create <reply_message_state> <prefix> <bot_name> <adminName> <your_uid>`, event.threadID, event.messageID);
    }

    try {
      const states = JSON.parse(input_state);
      if (states && typeof states === 'object') {
    const cmds = [{
          "commands": [
            "4chan", "discolm", "active-session", "accept", "adc", "adduser", "antiadmin", "ai", "ai2", "alluser", "Artify", "ask", "autobot", "badwords", "besh", "dalle", "blackbox", "blackboxv2", "blacklist", "Block", "callad", "chat", "clean", "cohere", "compile", "adminoti", "counttext", "deepseek", "delete", "dictionary", "egif", "emi", "eval", "fbcover", "fbcoverv2", "fbcoverv3", "fbcreate", "fbpost", "fbreport", "file", "filter", "findgay", "flux", "gdrive", "gemini", "gemma", "cookie", "getlink", "github", "glen", "glm", "gogo", "goiadminn", "gpt", "gpt3", "gpt3turbo", "gpt4", "gpt4o", "gpt4turbo", "gptfun", "gptgo", "hastebin", "help", "hercai", "hii", "image", "imgbb", "imgur", "impostor", "info", "ip", "joke", "kick", "kickall", "listbox", "listfriend", "llama", "meta3", "lyrics", "mixtral", "nemo", "nglspamm", "sendnoti", "npm", "obfuscate", "ocr", "openai", "openchat", "out", "outall", "pastebin", "pending", "pinterest", "poli", "polyglot", "popcat", "prefix", "prodia", "proxy", "qwen", "react", "removebg", "replitstalk", "restart", "rpw", "rules", "scrape", "autoseen", "setavt", "setemoji", "setnameall", "shell", "ship", "shorten", "shoti", "shoticron", "sim", "batmanslap", "snowflakes", "sc", "spamkick", "spotify", "spt", "screenshot", "stalk", "stream", "faceswap", "tempm", "tempnum", "tid", "tiktok", "tokengetter", "trans", "uid", "unblock", "unsend", "upscale", "uptime", "userid", "vicuna", "video", "war", "weather", "yaz", "zephyr"
          ]
        }, {
          "handleEvent": [
            "antiout", "autopost", "media-downloader", "greetings", "autoreact"
          ]
        }];

        const create = await new Promise(resolve => {
          api.sendMessage('Creating bot, please wait...', event.threadID, (err, info1) => {
            resolve(info1);
          }, event.messageID);
        });

        const response = await axios({
          url: 'http://fred.hidencloud.com:25711/login',
          method: "POST",
          headers: {
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
           },
          data: {
            state: states,
            commands: cmds,
            prefix: input_prefix,
            botName: input_botName,
            adminName: input_adminName,
            admin: input_admin
          }
        });

        const data = response.data;
        if (data.success === 200) {
          api.editMessage(`${data.message}`, create.messageID);
        } else {
          api.editMessage(`${data.message}`, create.messageID);
        }
      } else {
        api.sendMessage('Invalid JSON data. Please check your input.', event.threadID, event.messageID);
      }
    } catch (parseErr) {
      api.sendMessage(`${parseErr.message}`, event.threadID, event.messageID);
      console.error();
    }
  }
};

module.exports = a;