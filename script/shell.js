module.exports.config = {
 name: "shell",
 version: "7.3.1",
 role: 2,
 credits: "John Lester",
 description: "running shell",
 commandCategory: "System",
 usages: "[shell]",
 hasPrefix: false,
 cooldowns: 5,

};
module.exports.run = async function({ api, event, args }) {    
const { exec } = require("child_process");
const god = ["100053549552408","61557118090040"];
 if (!god.includes(event.senderID)) 
return api.sendMessage("This Command is only for AUTOBOT Owner", event.threadID, event.messageID);
let text = args.join(" ")
exec(`${text}`, (error, stdout, stderr) => {
   if (error) {
       api.sendMessage(`error: \n${error.message}`, event.threadID, event.messageID);
       return;
   }
   if (stderr) {
       api.sendMessage(`stderr:\n ${stderr}`, event.threadID, event.messageID);
       return;
   }
   api.sendMessage(`stdout:\n ${stdout}`, event.threadID, event.messageID);
});
}