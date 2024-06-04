//Establish library
const {SlashCommandBuilder} = require("discord.js"); //Discord API

module.exports = { //Deploys commands
    //Command name and description
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("Provides server information."),
    //Command function
    async execute(interaction) {
        //interaction.guild refers to server where command is executed
        await interaction.reply(`Server: ${interaction.guild.name}\nSize: ${interaction.guild.memberCount}`); //Prints server information
    },
};