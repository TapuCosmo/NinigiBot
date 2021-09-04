module.exports = async (client, message, replyText, embeds = null, files = null, ephemeral = true, components = null, slashComponents = false) => {
    try {
        if (!message) return;

        // 'DEFAULT' = text message, 'APPLICATION_COMMAND' = slash command
        let messageObject = {};
        if (replyText) messageObject['content'] = replyText;
        if (embeds) {
            if (Array.isArray(embeds)) {
                messageObject['embeds'] = embeds;
            } else {
                messageObject['embeds'] = [embeds];
            };
        };
        if (files) {
            // Ephemeral messages don't support attachments
            ephemeral = false;
            if (Array.isArray(files)) {
                messageObject['files'] = files;
            } else {
                messageObject['files'] = [files];
            };
        };
        // Don't add components to slash commands unless specifically told to do so
        if (components && ((slashComponents && message.type == 'APPLICATION_COMMAND') || message.type == 'DEFAULT')) {
            // Components, i.e. buttons
            if (Array.isArray(components)) {
                messageObject['components'] = components;
            } else {
                messageObject['components'] = [components];
            };
        };
        messageObject['ephemeral'] = ephemeral;
        if (message.type == "DEFAULT") messageObject['allowedMentions'] = { repliedUser: false, roles: false };

        if (message.type == "DEFAULT" && message.deleted == true) return message.channel.send(messageObject);
        return message.reply(messageObject);

    } catch (e) {
        // log error
        const logger = require('./logger');

        logger(e, client);
    };
};