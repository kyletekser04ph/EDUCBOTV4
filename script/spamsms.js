const axios = require('axios');
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Content-Type': 'application/json',
};

module.exports.config = {
  name: "spamsms",
  version: "2.0.6",
  role: 0,
  hasPermission: 0,
  credits: "Jonell",
  description: "",
  commandCategory: "utility",
  usage: "[]",
  usePrefix: false,
  hasPrefix: false,
  aliases: [],
  cooldown: 0
};

module.exports.run = async ({ api, event, args }) => {
  const arg = args.join(' ');
  const [number, countRaw, intervalRaw] = arg.split(' ');

  if (!args || args.length < 3) {
    const messageInfo = await new Promise((resolve) => {
      api.sendMessage(
        '📩 | Please provide a number, count, and interval',
        event.threadID,
        (err, info) => resolve(info)
      );
    });

    setTimeout(() => {
      api.unsendMessage(messageInfo.messageID);
    }, 10000);

    return;
  }

  const philippinesNumberRegex = /^(?:\+63|0)9\d{9}$/;
  if (!philippinesNumberRegex.test(number)) {
    return api.sendMessage(
      {
        body: '❌ | Please provide only a valid Philippines number (e.g., +639XXXXXXXXX or 09XXXXXXXXX).',
      },
      event.threadID
    );
  }

  let count = parseInt(countRaw, 10) || 1;
  count = Math.abs(count);

  if (count > 30) {
    return api.sendMessage(
      '❌ | The number count limit is 30 only.',
      event.threadID
    );
  }

  let interval = parseInt(intervalRaw, 10) || 200;
  interval = Math.abs(interval);

  if (interval > 1000) {
    return api.sendMessage(
      '❌ | The interval cannot exceed 1000ms. The limit is only 1000ms.',
      event.threadID
    );
  }

  const apiUrl = `https://yt-video-production.up.railway.app/spamsms?number=${encodeURIComponent(
    number
  )}&count=${count}&interval=${interval}`;

  try {
    const response = await axios.get(apiUrl, { headers });

    if (response.data.status) {
      let message = `📩 | Spam SMS Sent\nTarget: ${response.data.target_number}\nCount: ${response.data.count}\nInterval: ${response.data.interval}ms\n\nResults:\n`;
      response.data.result.forEach((res) => {
        message += `Message #${res.messageNumber}: ${res.result}\n`;
      });

      await api.sendMessage(message, event.threadID, event.messageID);
    } else {
      await api.sendMessage(
        '❌ | Failed to send SMS.',
        event.threadID,
        event.messageID
      );
    }
  } catch (error) {
    await api.sendMessage(
      '❌ | Error: Unable to process the request.',
      event.threadID,
      event.messageID
    );
  }
};
