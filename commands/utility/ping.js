//Establish library
const {SlashCommandBuilder} = require("discord.js"); //Discord API

module.exports = { //Deploys commands
    //Command name and description
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    //Command function
    async execute(interaction) {
        await interaction.reply("Pong!"); //Prints Pong!
    },
};