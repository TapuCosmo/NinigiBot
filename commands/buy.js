exports.run = async (client, message) => {
    try {
        const { bank } = require('../database/bank');
        const { Users, CurrencyShop } = require('../database/dbObjects');
        const { Op } = require('sequelize');
        const input = message.content.slice(1).trim();
        const [, , commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: commandArgs } } });
        if (!item) return message.channel.send(`> That item doesn't exist, ${message.author}.`);
        if (item.cost > bank.currency.getBalance(message.author.id)) {
            return message.channel.send(`> You don't have enough currency, ${message.author}, you only have ${Math.floor(bank.currency.getBalance(message.author.id))}💰, but the ${item.name} costs ${item.cost}💰.`);
        };

        const user = await Users.findOne({ where: { user_id: message.author.id } });
        bank.currency.add(message.author.id, -item.cost);
        await user.addItem(item);

        return message.channel.send(`> You've bought a ${item.name}, ${message.author}.`);

    } catch (e) {
        // log error
        console.log(e);

        // return confirmation
        return message.channel.send(`> An error has occurred trying to run the command, please report this as an issue on the Github page or send a message to the bot owner. For links and other information use ${client.config.prefix}info.`);
    };
};
