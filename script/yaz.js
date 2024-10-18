const axios = require('axios');
const fs = require('fs').promises;

const storageFile = 'user_data.json';
const axiosStatusFile = 'axios_status.json';

const primaryApiUrl = 'https://ccprojectsjonellapis-production.up.railway.app/api/gptconvo';
const backupApiUrl = 'https://ccprojectsjonellapis-production.up.railway.app/api/gpt4o';

let isPrimaryApiStable = true;

module.exports.config = {
    name: "yaz",
    version: "1.0.0",
    role: 0,
    credits: "Jonell Magallanes",
    description: "EDUCATIONAL",
    hasPrefix: false,
    aliases: ["Gpt5", "gpt5"],
    usages: "[question]",
    cooldowns: 5,
    hasPermission: 0,
    commandCategory: "boxchat",
    usage: "[question]",
    usePrefix: false,
    cooldowns: 10,

};

module.exports.run = async function ({ api, event, args }) {
    const content = encodeURIComponent(args.join(" "));
    const uid = event.senderID;

    let apiUrl, apiName;

    if (isPrimaryApiStable) {
        apiUrl = `${primaryApiUrl}?ask=${content}&id=${uid}`;
        apiName = 'Primary Axios';
    } else {
        apiUrl = `${backupApiUrl}?ask=${content}&id=${uid}`;
        apiName = 'Backup Axios';
    }

    if (!content) {
    const messageInfo = await new Promise(resolve => {
            api.sendMessage('Please provide your question.\n\nExample: ai what is the solar system?', event.threadID, (err, info) => {
                resolve(info);
            });
        });

        setTimeout(() => {
            api.unsendMessage(messageInfo.messageID);
        }, 10000);

        return;
}

    try {
        const cliff = await new Promise(resolve => { 
        api.sendMessage('💬 | Searching Please Wait....', event.threadID, (err, info1) => {
          resolve(info1);
        }, event.messageID);
      });

        const response = await axios.get(apiUrl);
        const result = isPrimaryApiStable ? response.data.response : response.data.response;

        if (!result) {
            throw new Error("Axios response is undefined");
        }

        const userData = await getUserData(uid);
        userData.requestCount = (userData.requestCount || 0) + 1;
        userData.responses = userData.responses || [];
        userData.responses.push({ question: content, response: result });
        await saveUserData(uid, userData, apiName);

        const totalRequestCount = await getTotalRequestCount();
        const userNames = await getUserNames(api, uid);

        const responseMessage = `🧩 | 𝗚𝗣𝗧𝟱 - 𝖢𝖮𝖭𝖵𝖤𝖱S......\n━━━━━━━━━━━━━━━━━━\n${result}\n━━━━━━━━━━━━━━━━━━\n👤 Asked by: ${userNames.join(', ')}`;
        api.editMessage(responseMessage, cliff.messageID);

        await saveAxiosStatus(apiName);

        if (!isPrimaryApiStable) {
            isPrimaryApiStable = true;
            api.sendMessage("࿖ | Switching back to the primary Axios. Just please wait.", event.threadID);
        }

    } catch (error) {
        console.error(error);

        try {
            api.sendMessage("࿖ | Trying Switching Axios!", event.threadID);
            const backupResponse = await axios.get(`${backupApiUrl}?ask=${content}&id=${uid}`);
            const backupResult = backupResponse.data.response;

            if (!backupResult) {
                throw new Error("Backup Axios response is undefined");
            }

            const userData = await getUserData(uid);
            userData.requestCount = (userData.requestCount || 0) + 1;
            userData.responses = userData.responses || [];
            userData.responses.push({ question: content, response: backupResult });
            await saveUserData(uid, userData, 'Backup Axios');

            const totalRequestCount = await getTotalRequestCount();
            const userNames = await getUserNames(api, uid);

            const responseMessage = `🧩 | 𝗚𝗣𝗧𝟱 - 𝖢𝖮𝖭𝖵𝖤𝖱S.....\n━━━━━━━━━━━━━━━━━━\n${backupResult}\n━━━━━━━━━━━━━━━━━━\n👤 Asked by: ${userNames.join(', ')}`;
            api.editMessage(responseMessage, cliff.messageID);

            isPrimaryApiStable = false;

            await saveAxiosStatus('Backup Axios');

        } catch (backupError) {
            api.sendMessage("An error occurred while processing your request.", event.threadID);

            await saveAxiosStatus('Unknown');
        }
    }
};

async function getUserData(uid) {
    try {
        const data = await fs.readFile(storageFile, 'utf-8');
        const jsonData = JSON.parse(data);
        return jsonData[uid] || {};
    } catch (error) {
        return {};
    }
}

async function saveUserData(uid, data, apiName) {
    try {
        const existingData = await getUserData(uid);
        const newData = { ...existingData, ...data, apiUsed: apiName };
        const allData = await getAllUserData();
        allData[uid] = newData;
        await fs.writeFile(storageFile, JSON.stringify(allData, null, 2), 'utf-8');
    } catch (error) {
        console.error();
    }
}

async function getTotalRequestCount() {
    try {
        const allData = await getAllUserData();
        return Object.values(allData).reduce((total, userData) => total + (userData.requestCount || 0), 0);
    } catch (error) {
        return 0;
    }
}

async function getUserNames(api, uid) {
    try {
        const userInfo = await api.getUserInfo([uid]);
        return Object.values(userInfo).map(user => user.name || `User${uid}`);
    } catch (error) {
        api.sendMessage('Error getting user names:', error);
        return [];
    }
}

async function getAllUserData() {
    try {
        const data = await fs.readFile(storageFile, 'utf-8');
        return JSON.parse(data) || {};
    } catch (error) {
        return {};
    }
}

async function saveAxiosStatus(apiName) {
    try {
        await fs.writeFile(axiosStatusFile, JSON.stringify({ axiosUsed: apiName }), 'utf-8');
    } catch (error) {
        api.sendMessage('Error saving Axios status:', error);
    }
}
