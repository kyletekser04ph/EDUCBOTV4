const axios = require("axios");

module.exports.config = {
    name: "faceswap",
    hasPrefix: false,
    role: 0,
    hasPermission: false,
    commandCategory: "no prefix",
    usePrefix: false,
    cooldown: 5,
    cooldowns: 5,
    aliases: [],
    description: "Generate image",
    usages: "{pn} reply to image",
    usage: "{pn} reply to image",
    credits: "Deku"
};

module.exports.run = async function({ api, event, args }) {
    try {
        let url, url1;

        if (event.type === "message_reply") {
            const attachments = event.messageReply.attachments;
            if (attachments.length < 2) {
                return api.sendMessage("You must reply to exactly 2 images.", event.threadID);
            }

            if (attachments[0].type !== "photo" || attachments[1].type !== "photo") {
                return api.sendMessage("Only images can be used for face swap.", event.threadID);
            }

            url = attachments[0].url;
            url1 = attachments[1].url;



            api.sendMessage("faceswaping two image Please wait...", event.threadID, event.messageID);

            const imgur1 = `https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(url)}`;
            const imgur2 = `https://betadash-uploader.vercel.app/imgur?link=${encodeURIComponent(url1)}`;

            const upload1 = await axios.get(imgur1);
            const imgurLink1 = upload1.data.uploaded.image;

            const upload2 = await axios.get(imgur2);
            const imgurLink2 = upload2.data.uploaded.image;

            const faceswapUrl = `https://kaiz-apis.gleeze.com/api/faceswap-v2?targetUrl=${imgurLink1}&sourceUrl=${imgurLink2}`;
            const faceswapResponse = await axios.get(faceswapUrl, { responseType: "stream" });

            api.sendMessage(
                { body: "Ito na mukhang burat", attachment: faceswapResponse.data },
                event.threadID,
                event.messageID
            );
        } else {
            return api.sendMessage("Please reply to a message containing exactly 2 images.", event.threadID);
        }
    } catch (e) {
        return api.sendMessage("Error: api sucks", event.threadID);
    }
};