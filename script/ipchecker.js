const axios = require("axios");

module.exports.config = {
    name: "ip",
    countDown: 5,
    cooldown: 5,
    role: 0,
    hasPrefix: false,
    category: "boxchat",
    description: "check IP address",
};

module.exports["run"] = async function ({ api, event, args }) {
    const uid = event.senderID;
    if (!args.join("")) {
        api.sendMessage("Enter your IP address!!!", event.threadID, event.messageID);
    } else {
        try {
            var data = (await axios.get(`http://ipapi.co/${args.join(" ")}/json`)).data;

            if (!data.ip) {
                api.sendMessage("This IP address could not be found!", event.threadID);
            } else {
                api.sendMessage(
                    {
                        body: `=====✅ IP Information ✅=====\n\n🌍 IP Address: ${data.ip}\n🔗 Network: ${data.network}\n🌐 IP Version: ${data.version}\n🏙 City: ${data.city}\n🏞 Region: ${data.region} (Code: ${data.region_code})\n🏛 Country: ${data.country_name} (${data.country})\n🌍 ISO Country Code: ${data.country_code_iso3}\n🏙 Capital: ${data.country_capital}\n🌐 Country TLD: ${data.country_tld}\n🌎 Continent Code: ${data.continent_code}\n🇪🇺 In EU: ${data.in_eu ? "Yes" : "No"}\n📮 Postal Code: ${data.postal}\n📍 Latitude: ${data.latitude}\n📍 Longitude: ${data.longitude}\n⏰ Timezone: ${data.timezone}\n🕒 UTC Offset: ${data.utc_offset}\n☎️ Calling Code: ${data.country_calling_code}\n💵 Currency: ${data.currency} (${data.currency_name})\n🗣 Languages: ${data.languages}\n🗺 Country Area: ${data.country_area} km²\n👥 Population: ${data.country_population}\n📡 ASN: ${data.asn}\n🏢 Organization: ${data.org}`,
                        location: {
                            latitude: data.latitude,
                            longitude: data.longitude,
                            current: true,
                        },
                    },
                    event.threadID
                );
            }
        } catch (error) {
            api.sendMessage("Not found", event.threadID);
        }
    }
};