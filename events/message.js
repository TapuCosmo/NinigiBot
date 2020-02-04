module.exports = (client, message) => {
  const Discord = require("discord.js");
  let NinigiDMChannelID = "674371091006881832";

  // Import totals
  let globalVars = require('./ready');

  // Ignore all bots
  if (message.author.bot) return;

  // +1 messages count
  globalVars.totalMessages += 1;

  // Ignore commands in DMs
  if (message.channel.type == "dm") {
    if (message.content.indexOf(client.config.prefix) == 0) {
      message.author.send(`> Sorry <@${message.author.id}>, you're not allowed to use commands in private messages!`).catch(console.error);
    };
    // Send message contents to dm channel
    let DMChannel = client.channels.find('id', NinigiDMChannelID);

    console.log("yest")

    const dmEmbed = new Discord.RichEmbed()
      .setColor("#219DCD")
      .setAuthor(`DM`, message.author.avatarURL)
      .setThumbnail(message.author.avatarURL)
      .addField(`Author account:`, message.author, false)
      .addField(`Author ID:`, message.author.id, false)
      .addField(`Message content:`, message.content, false)
      .setFooter(`DM passed through by ${client.config.botName}.`)
      .setTimestamp();

    return DMChannel.send(dmEmbed);
  };

  // Ignore messages not starting with the prefix
  if (message.content.indexOf(client.config.prefix) !== 0) return;

  // Ignore messages that are just prefix
  if (message.content === client.config.prefix) return;

  // Ignore messages that start with prefix double or prefix space
  let secondCharacter = message.content.charAt(1);
  if (secondCharacter == client.config.prefix || secondCharacter == ` `) return;

  // Standard definition
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Grab the command data from the client.commands Enmap
  const cmd = client.commands.get(command);

  // If that command doesn't exist, exit
  if (!cmd) return message.channel.send(`> Sorry <@${message.author.id}>, that command doesn't exist.`);

  // +1 command count and drop message count
  globalVars.totalCommands += 1;
  globalVars.totalMessages -= 1;

  // Run the command
  cmd.run(client, message, args);
};