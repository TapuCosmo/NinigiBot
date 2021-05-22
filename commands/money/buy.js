exports.run = async (client, message, args = []) => {
    // Import globals
    let globalVars = require('../../events/ready');
    try {
        const sendMessage = require('../../util/sendMessage');
        const { bank } = require('../../database/bank');
        const { Users, Equipments, Foods, KeyItems, Room, CurrencyShop } = require('../../database/dbObjects');
        const { Op } = require('sequelize');
        const shops = [Equipments, Foods, KeyItems, CurrencyShop];
        const commandArgs = args[0].match(/(\w+)\s*([\s\S]*)/);
        for (let i = 0; i < shops.length; i++) {
            const item = await shops[i].findOne({ where: { name: { [Op.like]: commandArgs } } });
            if (item) {
                if (item.cost === 0) return sendMessage(client, message, `That item doesn't exist.`);
                if (item.cost > bank.currency.getBalance(message.author.id)) {
                    return sendMessage(client, message, `You don't have enough currency.\nThe ${item.name} costs ${item.cost}💰 but you only have ${Math.floor(bank.currency.getBalance(message.author.id))}💰.`);
                };
                const user = await Users.findOne({ where: { user_id: message.author.id } });

                bank.currency.add(message.author.id, -item.cost);
                switch (i) {
                    case 0:
                        await user.addEquipment(item);
                        break;
                    case 1:
                        await user.addFood(item);
                        break;
                    case 2:
                        await user.addKey(item);
                        break;
                    case 3:
                        await user.addItem(item);
                        break;
                    // default:
                    //     await user.changeRoom(item);
                }

                return sendMessage(client, message, `You've bought a ${item.name}.`);
            };
        };
        return sendMessage(client, message, `That item doesn't exist.`);

    } catch (e) {
        // log error
        const logger = require('../../util/logger');

        logger(e, client, message);
    };
};

module.exports.config = {
    name: "buy",
    aliases: [],
    description: "Buy an item from the shop.",
    optiosn: [{
        name: "item-name",
        type: "STRING",
        description: "The name of the item you want to buy.",
        required: true
    }]
};
