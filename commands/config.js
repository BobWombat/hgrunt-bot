const { Client, Message } = require("discord.js"); // eslint-disable-line no-unused-vars

exports.help = {
    name: "config",
    usage: "config <prefix|cmd> <args>",
    info: "Configure the prefix for command and disable commands."
};

const blacklist = /eval|config/g;

/**
 * Don't think too hard. This command is kind of difficult to follow.
 * @param {Client} client
 * @param {Message} msg
 * @param {string[]} args
 */
exports.run = async (client, msg, args) => {
    if (msg.member.hasPermission("MANAGE_GUILD")) {
        const guildSettings = client.guildSettings.get(msg.guild.id);
        const disabledCommands = guildSettings.disabledCommands;

        if (args.length === 0) return msg.channel.send(`Usage: ${guildSettings.prefix}${exports.help.usage}`, { code: "" });

        if (args[0] === "prefix") {
            if (args.length !== 2) return msg.channel.send(`Usage: ${guildSettings.prefix}config prefix <prefix>`, { code: "" });

            guildSettings.prefix = args[1];
            client.guildSettings.set(msg.guild.id, guildSettings);

            msg.channel.send(`The prefix has been successfully updated to \`${guildSettings.prefix}\`!`);
        } else if (args[0] === "cmd") {
            if (args[1] === "disable") {
                if (args.length < 3) return msg.channel.send(`Usage: ${guildSettings.prefix}config cmd disable [server] <cmd>`, { code: "" });

                if (blacklist.test(args[2] || blacklist.test(args[3]))) return msg.channel.send("You can't disable that command!");

                if (args[2] === "server") {
                    // disable command for the entire guild
                    if (args.length < 4) return msg.channel.send(`Usage: ${guildSettings.prefix}config cmd disable [server] <cmd>`, { code: "" });

                    let realCmd = args[3].replace(guildSettings.prefix, "");

                    if (!client.commands[realCmd]) return msg.channel.send("Command not found!");
                    if (client.commands[realCmd].help) realCmd = client.commands[realCmd].help.name; // lookup real command name in case this is an alias
                    if (disabledCommands.some(dc => dc.command === realCmd && dc.channels.length === 0)) return msg.channel.send("That command is already disabled!");

                    if (disabledCommands.some(dc => dc.command === realCmd)) { // command was disabled in a channel before, override it
                        disabledCommands.find(dc => dc.command === realCmd).channels = [];
                    } else {
                        disabledCommands.push({ command: realCmd, channels: [] });
                    }

                    client.guildSettings.set(msg.guild.id, guildSettings);

                    return msg.channel.send("Command successfully disabled server-wide!");
                } else {
                    let realCmd = args[2].replace(guildSettings.prefix, "");

                    if (!client.commands[realCmd]) return msg.channel.send("Command not found!");
                    if (client.commands[realCmd].help) realCmd = client.commands[realCmd].help.name; // lookup real command name in case this is an alias
                    if (disabledCommands.some(dc => dc.command === realCmd && dc.channels.includes(msg.channel.id))) return msg.channel.send("That command is already disabled in this channel!");

                    if (disabledCommands.some(dc => dc.command === realCmd)) { // command was disabled in a channel before, add this channel id to it
                        disabledCommands.find(dc => dc.command === realCmd).channels.push(msg.channel.id);
                    } else {
                        disabledCommands.push({ command: realCmd, channels: [msg.channel.id] });
                    }

                    client.guildSettings.set(msg.guild.id, guildSettings);

                    return msg.channel.send("Command successfully disabled in this channel!");
                }
            } else if (args[1] === "enable") {
                if (args.length < 3) return msg.channel.send(`Usage: ${guildSettings.prefix}config cmd enable <cmd>`, { code: "" });

                let realCmd = args[2].replace(guildSettings.prefix, "");

                if (!client.commands[realCmd]) return msg.channel.send("Command not found!");
                if (client.commands[realCmd].help) realCmd = client.commands[realCmd].help.name; // lookup real command name in case this is an alias
                if (!disabledCommands.some(dc => dc.command === realCmd)) return msg.channel.send("That command is already enabled!");
                if (!disabledCommands.some(dc => dc.command === realCmd
                    && dc.channels.includes(msg.channel.id)) && disabledCommands.find(dc => dc.command === realCmd).channels.length > 0) return msg.channel.send("That command is already enabled here!");

                const channels = disabledCommands.find(dc => dc.command === realCmd).channels;

                if (channels.length > 1) {
                    channels.splice(channels.findIndex(ch => ch === msg.channel.id), 1); // remove this channel id from the channels array
                } else {
                    disabledCommands.splice(disabledCommands.findIndex(dc => dc.command === realCmd), 1);
                }

                client.guildSettings.set(msg.guild.id, guildSettings);

                return msg.channel.send("Command successfully enabled in this channel!");
            } else if (args[1] === "list") {
                if (disabledCommands.length === 0) return msg.channel.send("No commands have been disabled!");

                let final = "Disabled Commands:```\n";

                for (let i = 0; i < disabledCommands.length; i++) {
                    if (disabledCommands[i].channels.length !== 0) {
                        const chNames = [];
                        disabledCommands[i].channels.forEach(ch => chNames.push(`#${client.channels.get(ch).name}`));
                        final += `${disabledCommands[i].command} - disabled in ${chNames.join(", ")}\n`;
                    } else final += `${disabledCommands[i].command} - disabled server-wide\n`;
                }

                msg.channel.send(final + "```", );
            } else return msg.channel.send(`Usage: ${guildSettings.prefix}config cmd [disable|enable|list]`, { code: "" });
        } else return msg.channel.send(`Usage: ${guildSettings.prefix}${exports.help.usage}`, { code: "" });
    } else {
        msg.reply("You need to have the `Manage Server` permission to use this command!");
    }
};