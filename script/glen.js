const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

module.exports.config = {
    name: "glen",
    version: "1.1",
    credits: "Samir Œ",
    cooldown: 5,
    role: 0,
    hasPrefix: false,
    description: "Search for images and display results from source URL",
    commandCategory: "UTILITY"
};

module.exports.run = async function ({ api, args, event }) {
    let imageUrl;

    if (event.messageReply && event.messageReply.attachments.length > 0) {
        imageUrl = event.messageReply.attachments[0].url;
    } else if (args.length > 0) {
        imageUrl = args[0];
    } else {
        return api.sendMessage({ body: "Please reply to an image or provide an image URL." }, event.threadID, event.messageID);
    }

    try {
        const response = await axios.get(`https://www.samirxpikachu.run.place/glens?url=${encodeURIComponent(imageUrl)}`);
        const results = response.data.slice(0, 6);

        if (results.length > 0) {
            const trackInfo = results.map((result, index) => 
                `${index + 1}. ${result.title}\nURL: ${result.link}\n`
            ).join("\n\n");

            const attachments = await Promise.all(
                results.map(async result => {
                    const response = await axios({
                        url: result.thumbnail,
                        responseType: 'stream'
                    });

                    const tempPath = path.join(__dirname, 'cache', `${path.basename(result.thumbnail)}`);
                    await pipeline(response.data, fs.createWriteStream(tempPath));
                    const readStream = fs.createReadStream(tempPath);

                    readStream.on('close', () => {
                        fs.unlinkSync(tempPath);
                    });

                    return readStream;
                })
            );

            await api.sendMessage({
                body: trackInfo,
                attachment: attachments
            }, event.threadID, event.messageID);
        } else {
            api.sendMessage({ body: "No results found for the given image." }, event.threadID, event.messageID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage({ body: "An error occurred while fetching image search results." }, event.threadID, event.messageID);
    }
};
