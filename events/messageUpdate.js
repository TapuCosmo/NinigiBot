const { update } = require("lodash");

module.exports = async (client, message, newMessage) => {
    const logger = require('../util/logger');
    // Import globals
    let globalVars = require('./ready');
    try {
        const Discord = require("discord.js");
        const autoMod = require('../util/autoMod');

        if (!message.guild) return;

        // Get log
        const { LogChannels } = require('../database/dbObjects');
        let logChannel = await LogChannels.findOne({ where: { server_id: message.guild.id } });
        if (!logChannel) return;
        let log = message.guild.channels.cache.find(channel => channel.id == logChannel.channel_id);
        if (!log) return;

        let botMember = await message.guild.members.fetch(client.user.id);

        // Check message content
        if (log.permissionsFor(botMember).has("SEND_MESSAGES") && log.permissionsFor(botMember).has("EMBED_LINKS")) {
            if (!message || !message.author) return;
            if (message.content === newMessage.content) return;

            let messageImage = null;
            if (message.attachments.size > 0) messageImage = message.attachments.first().url;

            if (!messageImage && !newMessage.content) return;

            let messageContent = message.content;
            let newMessageContent = newMessage.content
            if (messageContent.length > 1024) messageContent = `${messageContent.substring(0, 1020)}...`;
            if (newMessageContent.length > 1024) newMessageContent = `${newMessageContent.substring(0, 1020)}...`;

            await autoMod(client, newMessage);

            let isReply = false;
            let replyMessage;
            if (message.reference) isReply = true;

            if (isReply) {
                try {
                    replyMessage = await message.channel.messages.fetch(message.reference.messageId);
                } catch (e) {
                    isReply = false;
                };
            };

            let avatar = newMessage.member.displayAvatarURL(globalVars.displayAvatarSettings);

            const updateEmbed = new Discord.MessageEmbed()
                .setColor(globalVars.embedColor)
                .setAuthor(`Message Edited ⚒️`, avatar)
                .setDescription(`Message sent by ${message.author} (${message.author.id}) edited in ${message.channel}.`);
            if (messageContent.length > 0) updateEmbed.addField(`Before:`, messageContent, false);
            updateEmbed
                .addField(`After:`, newMessageContent, false)
            if (isReply) updateEmbed.addField(`Replying to:`, `"${replyMessage.content}"\n-${replyMessage.author}`);
            updateEmbed
                .addField(`Jump to message:`, `[Link](${message.url})`, false)
                .setImage(messageImage)
                .setFooter(message.author.tag)
                .setTimestamp(message.createdTimestamp);

            return log.send({ embeds: [updateEmbed] });
        } else if (log.permissionsFor(botMember).has("SEND_MESSAGES") && !log.permissionsFor(botMember).has("EMBED_LINKS")) {
            return log.send({ content: `I lack permissions to send embeds in your log channel.` });
        } else {
            return;
        };

    } catch (e) {
        // Log error
        logger(e, client, message);
    };
};