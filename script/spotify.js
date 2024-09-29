const axios = require('axios');

module.exports.config = {
    name: "spotify",
    version: "1.0.0",
    role: 0,
    hasPermission: 0,
    credits: "cliff",
    description: "Search and play music from Spotify",
    commandCategory: "spotify",
    hasPrefix: false,
    usage: "[song name]",
    cooldowns: 5,
    usePrefix: false,
    usages: "[song name]",
    cooldown: 5,  
};

module.exports.run = async function ({ api, event, args }) {
    const listensearch = args.join(" ");
    const apiUrl = `https://betadash-api-swordslush.vercel.app/spotify/search?q=${listensearch}&apikey=syugg`;

    if (!listensearch) {
        const messageInfo = await new Promise(resolve => {
            api.sendMessage('Please provide the name of the song you want to search.', event.threadID, (err, info) => {
                resolve(info);
            });
        });

        setTimeout(() => {
            api.unsendMessage(messageInfo.messageID);
        }, 10000);

        return;
    }

    try {
        api.sendMessage(`🔍 | Searching music ${listensearch}`, event.threadID, event.messageID);

        const response = await axios.get(apiUrl);

        if (response.data.data && response.data.data.length > 0) {
            const song = response.data.data[0]; 
            const title = song.title;
            const track = song.url;
            const popularity = song.popularity;
            const downloadUrl = song.preview;

            if (!downloadUrl) {                
const takte = await new Promise(resolve => {
            api.sendMessage(`Not found search for "${title}"`, event.threadID, (err, info) => {
                resolve(info);
            });
        });

        setTimeout(() => {
            api.unsendMessage(take.messageID);
        }, 10000);

        return;
    }

            const audioResponse = await axios.get(downloadUrl, { responseType: 'stream' });

            api.sendMessage({
                body: `Here's your music from Spotify. Enjoy listening!\n\nTitle: ${title}\nPopularity: ${popularity}\nTrack: ${track}\n\n🎶 Now Playing...`,
                attachment: audioResponse.data
            }, event.threadID, event.messageID);
        } else {
            const tf = await new Promise(resolve => {
                api.sendMessage('Not found music', event.threadID, (err, info) => {
                    resolve(info);
                });
            });

            setTimeout(() => {
                api.unsendMessage(tf.messageID);
            }, 10000);

            return;
        }
    } catch (error) {
                 const tf = await new Promise(resolve => {
                api.sendMessage('Error occurred while searching for the song.', event.threadID, (err, info) => {
                    resolve(info);
                });
            });
        
            setTimeout(() => {
                api.unsendMessage(tf.messageID);
            }, 10000);
          
            return;
    }
};
