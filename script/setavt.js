const axios = require("axios");

module.exports.config = {
  name: "setavt",
  aliases: ["changeavt", "setavatar"],
  version: "1.2",
  credits: "NTKhang",
  cooldown: 5,
  role: 2,
  description: "Change bot avatar",
  usage: {
    vi: "   {pn} [<image url> | <phản hồi tin nhắn có ảnh>] [<caption> | để trống] [<expirationAfter (seconds)> | để trống]"
      + "\nPhản hồi 1 tin nhắn có chứa ảnh với nội dung: {pn}"
      + "\nGửi kèm 1 tin nhắn có chứa ảnh với nội dung: {pn}"
      + "\n\nGhi chú:"
      + "\n  + caption: caption sẽ đăng kèm khi đổi avatar"
      + "\n  + expirationAfter: đặt chế độ ảnh đại diện tạm thời (hết hạn sau expirationAfter(seconds))"
      + "\nVí dụ:"
      + "\n   {pn} https://example.com/image.jpg: (đổi ảnh đại diện không caption, không hết hạn)"
      + "\n   {pn} https://example.com/image.jpg Hello: (đổi ảnh đại diện với caption là \"Hello\", không hết hạn)"
      + "\n   {pn} https://example.com/image.jpg Hello 3600: (đổi ảnh đại diện với caption là \"Hello\", đặt tạm thời 1h)"
  }
};

module.exports.run = async function ({ event, api, args, admin }) {
  if (!admin.includes(event.senderID))
   return api.sendMessage("This Command is only for AUTOBOT owner.", event.threadID, event.messageID);
  const imageURL = (args[0] || "").startsWith("http") ? args.shift() : event.attachments?.[0]?.url || event.messageReply?.attachments?.[0]?.url;
  const expirationAfter = !isNaN(args[args.length - 1]) ? args.pop() : null;
  const caption = args.join(" ");
  if (!imageURL) return api.sendMessage("❌ | Image URL not found or no image attached.");
  let response;
  try {
    response = await axios.get(imageURL, { responseType: "stream" });
  } catch (err) {
    return api.sendMessage("❌ | An error occurred while querying the image URL.");
  }
  if (!response.headers["content-type"].includes("image")) return api.sendMessage("❌ | Invalid image format.");
  response.data.path = "avatar.jpg";

  api.changeAvatar(response.data, caption, expirationAfter ? expirationAfter * 1000 : null, (err) => {
    if (err) return api.sendMessage(`❌ | Error: ${err.message}`);
    return api.sendMessage("✅ | Changed bot avatar successfully.");
  });
};