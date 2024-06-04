//Establish library
const {SlashCommandBuilder} = require("discord.js"); //Discord API

module.exports = { //Deploys commands
    //Command name and description
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Provides user information."),
    //Command function
    async execute(interaction) {
        //interaction.user refers to user who executed command. interaction.member refers to member in server that ran command
        await interaction.reply(`User: ${interaction.user.username}\nMember since: ${interaction.member.joinedAt}`); //Prints user information
    },
};