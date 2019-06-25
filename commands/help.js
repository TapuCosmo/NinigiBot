const fs = require("fs");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args, con) => {
    fs.readdir("./commands/", (err, files) => {
        if (err) console.error(err);

        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        if (jsfiles.length <= 0) {
            console.log("No commands to load!");
            return;
        }

        var namelist = "";
        var desclist = "";
        var usage = "";

        let result = jsfiles.forEach((f, i) => {
            let props = require(`./${f}`);
            namelist = help.name;
            desclist = help.description;
            usage = help.usage;

            // send help text
            message.author.send(`**${namelist}** \n${desclist} \n${usage}`).catch(console.error);
        });
    });
};

module.exports.help = {
    name: "help",
    description: "Lists all commands.",
    usage: `help`
};