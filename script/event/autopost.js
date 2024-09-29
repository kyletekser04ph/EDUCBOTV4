const axios = require('axios');
const cron = require('node-cron');

module.exports.config = {
    name: "autopost",
    version: "1.0.0",
    cliff: "credits",
    description: "post", 
    note: "if you change the cron time: {for hours < 12 * 60 * 60 * 1000} [0 */12 * * *], {for minutes < 60 * 60 * 1000} [*/60 * * * *] tandaan moyan para di mag spam",
};

let lastPostTime = 0;

module.exports.handleEvent = async function ({ api, admin}) {

    async function Bibleverse() {
        const currentTime = Date.now();
        if (currentTime - lastPostTime < 30 * 60 * 1000) { 
            return;
        }
        lastPostTime = currentTime;

        try {
            const verseResponse = await axios.get('https://labs.bible.org/api/?passage=random&type=json');
            const verse = verseResponse.data[0];
            const formattedVerseMessage = 
            `🔔 Random 𝖡𝗂𝖻𝗅𝖾 𝖵𝖾𝗋𝗌𝖾:\n\n${verse.text}\n\n- ${verse.bookname} ${verse.chapter}:${verse.verse}`;
            api.createPost(formattedVerseMessage);
        } catch (error) {
            console.error();
        }
    }

    async function quotes() {
        const currentTime = Date.now();
        if (currentTime - lastPostTime < 12 * 60 * 60 * 1000) {
            return;
        }
        lastPostTime = currentTime;
        try {
            const response = await axios.get('https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json');
            const randomQuote = response.data.quoteText;
            const randomAuthor = response.data.quoteAuthor || "Cliffbot";

            const images = [
                "https://i.imgur.com/p5UC6mk.jpeg",
                "https://i.imgur.com/nHG62W2.jpeg",
                "https://i.imgur.com/NfpInXC.jpeg",
                "https://i.imgur.com/k48dJBU.jpeg",
                "https://i.imgur.com/h9sATxR.jpeg",
                "https://i.imgur.com/vqlyCXj.jpeg",
                "https://i.imgur.com/ZWmgPnh.jpeg",
            ];  //change the background at your own

            const randomIndex = Math.floor(Math.random() * images.length);
            const randomImage = images[randomIndex];

            const guh = `https://api.popcat.xyz/quote?image=${randomImage}&text=${encodeURIComponent(randomQuote)}&font=Poppins-Bold&name=${encodeURIComponent(randomAuthor)}`;

           const response2 = await axios.get(guh, { responseType: 'stream' });

            await api.createPost({
                body: "<[ 𝗔𝗨𝗧𝗢𝗣𝗢𝗦𝗧 𝗤𝗨𝗢𝗧𝗘𝗦 ]>", 
                attachment: [response2.data], //[fs.createReadStream(video)]
                tags: [61557118090040],//[admin]
                baseState: 'EVERYONE',
            });
        } catch (error) {
            console.error();
        }
    }

    cron.schedule('0 */12 * * *', quotes, {
        scheduled: false,
        timezone: "Asia/Manila"
    });

    cron.schedule('*/30 * * * *', Bibleverse, {
        scheduled: true, //change false
        timezone: "Asia/Manila"
    });
};