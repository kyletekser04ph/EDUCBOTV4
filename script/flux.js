const k = require('axios');

const c = {};
c["config"] = {
    name: "flux",
    version: "1.0.0",
    role: 0,
    hasPrefix: false,
    credits: String.fromCharCode(99, 108, 105, 102, 102),
    description: "fal.ai Image generation",
    usages: "[prompt]",
    cooldown: 5,
    aliases: ["fluxpro"]
};

c["run"] = async ({ api, event, args }) => {
    const p = args.join(" ");
    if (!p) {
                 const tf = await new Promise(resolve => {
                api.sendMessage('Please provide a prompt first', event.threadID, (err, info) => {
                    resolve(info);
                });
            });

            setTimeout(() => {
                api.unsendMessage(tf.messageID);
            }, 10000);

            return;
    }

    const v = await new Promise(done => {
        api.sendMessage(`𝖨𝗆𝖺𝗀𝖾 for ${p} 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 please wait.`, event.threadID, (err, msgInfo) => {
            done(msgInfo);
        }, event.messageID);
    });

    const { messageID } = v;

    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await api.editMessage(`𝖨𝗆𝖺𝗀𝖾 for ${p} 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 please wait..`, messageID, event.threadID);

        await new Promise(resolve => setTimeout(resolve, 1000));
        await api.editMessage(`𝖨𝗆𝖺𝗀𝖾 for ${p} 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 please wait...`, messageID, event.threadID);

await new Promise(resolve => setTimeout(resolve, 1000));
        await api.editMessage(`ּ𝖨𝗆𝖺𝗀𝖾 for ${p} 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 please wait.`, messageID, event.threadID);

await new Promise(resolve => setTimeout(resolve, 1000));
        await api.editMessage(`𝖨𝗆𝖺𝗀𝖾 for ${p} 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 please wait..`, messageID, event.threadID);

await new Promise(resolve => setTimeout(resolve, 1000));
        await api.editMessage(`𝖨𝗆𝖺𝗀𝖾 for ${p} 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 please wait...`, messageID, event.threadID);


 const b = String.fromCharCode(111, 110, 114, 101, 110, 100, 101, 114, 46, 99, 111, 109);
        const d = `https://image-generations-fal-ai.${b}/flux?prompt=${p}`;
        const r = await k.get(d);
        const f = r.data.imageUrl;
        const h = await k.get(f, { responseType: 'stream' });
        await api.unsendMessage(v.messageID);
        api.sendMessage({ body: ` `, attachment: h.data }, event.threadID, event.messageID);
    } catch (error) {
                 const t = await new Promise(resolve => {
                api.sendMessage('Api failed to fetch the image', event.threadID, (err, info) => {
                    resolve(info);
                });
            });

            setTimeout(() => {
                api.unsendMessage(t.messageID);
            }, 8000);

            return;
    }
};

module.exports = c;