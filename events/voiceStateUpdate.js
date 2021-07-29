module.exports = async (client, oldMember, newMember) => {
    try {
        const Discord = require("discord.js");
        const { VCTextChannels } = require('../database/dbObjects');
        let oldID = null;
        let newID = null;
        if (oldMember.channelId) oldID = oldMember.channelId;
        if (newMember.channelId) newID = newMember.channelId;

        let user = client.users.cache.get(newMember.id);
        if (user.bot) return;
        let VCTextChannel = await VCTextChannels.findOne({ where: { server_id: newMember.guild.id } });
        if (!VCTextChannel) return;
        await newMember.guild.channels.fetch();
        let textChannel = await newMember.guild.channels.cache.find(channel => channel.id == VCTextChannel.channel_id);
        if (!textChannel) return;
        await textChannel.fetch();
        let channelPermOverride = await textChannel.permissionOverwrites.cache.get(newMember.id);
        if (!channelPermOverride) channelPermOverride = await textChannel.permissionOverwrites.cache.get(oldMember.id);

        console.log("base")
        // Joined VC
        if (newID) {
            console.log("huh")
            if (channelPermOverride) {
                console.log("thats not right")
                try {
                    return channelPermOverride.edit({
                        VIEW_CHANNEL: true,
                        READ_MESSAGE_HISTORY: true, user: user
                    });
                } catch (e) {
                    console.log(e);
                };
            } else {
                try {
                    console.log("wtf")
                    return channelPermOverride.create({
                        VIEW_CHANNEL: true,
                        READ_MESSAGE_HISTORY: true, user: user
                    });
                } catch (e) {
                    console.log(e);
                };
            };
            //Left VC
        } else if (oldID) {
            console.log("delet")
            if (channelPermOverride) {
                console.log("success?")
                await channelPermOverride.delete();
                return;
            } else {
                return;
            };
        };

    } catch (e) {
        // log error
        console.log(e);
    };
};