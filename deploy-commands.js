//Establish requirements
const { REST, Routes } = require("discord.js"); //discord api
const { clientID, guildID, token } = require("./config.json"); //keys
const fs = require("node:fs"); //identify command file
const path = require("node:path"); //file and directory access assistance
//Command list
const commands = [];

const foldersPath = path.join(__dirname,"commands"); //command folder
const commandFolders = fs.readdirSync(foldersPath); //subfolders
//Go through subfolders
for(const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder); //subfolder
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js")); //commands
    //Go through commands
    for(const file of commandFiles) {
        const filePath = path.join(commandsPath, file); //command
        const command = require(filePath); //command function
        if("data" in command && "execute" in command) {
            commands.push(command.data.toJSON()); //load command as a deploy
        } else { //check if command is complete
            console.log(`[WARNING] Command at ${filePath} is missing require "data" or "execute" property.`);
        }
    }
}
//Script to run separately from start bot start up to change slash command definitions.
const rest = new REST().setToken(token);
//Deploys commands
(async () => {
    try {
        console.log(`Refreshing ${commands.length} (/) commands`); //Start

        const data = await rest.put(
            Routes.applicationGuildCommands(clientID, guildID), //guildId creates server specific update. may omit for global update.
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} (/) commands`); //Finish
    } catch(error) { //Error checking
        console.error(error);
    }
})();