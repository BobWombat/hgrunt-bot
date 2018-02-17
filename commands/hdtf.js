const hdtf = require("../utils/hdtf.js");

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {string[]} args
 */
exports.run = async (client, msg, args) => {
    if (args.length <= 0) return msg.channel.send("```Usage: !hdtf <words>```");

    hdtf(msg, args, "./hdtf/banner.png");
};