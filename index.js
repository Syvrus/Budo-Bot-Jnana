//Establish requirement
const fs = require('node:fs'); //identifies command files
const path = require('node:path'); //assistance for accessing files and directories
const {Client,Collection,Events,GatewayIntentBits} = require("discord.js"); //access discord library
const {token} = require("./config.json"); //bot identifier

//Declare client
const client = new Client({intents: [GatewayIntentBits.Guilds]});
//Stores and Retrieves commands for execution
client.commands = new Collection();
//Establish command location
const foldersPath = path.join(__dirname, "commands"); //path to commands
const commandFolders = fs.readdirSync(foldersPath); //path to command subfolders
//Goes through subfolders
for(const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder); //open subfolder
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js")); //access command files grouped in subfolder
    //Goes through command group in subfolder
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file); //open command
        const command = require(filePath); //access command
        //Checks command for required identification and functionality properties
        if('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command); //Execute
        } else {
            console.log(`[WARNING] Command at ${filePath} is missing require "data" or "execute" property.`)
        }
    }
}

//Console intro message
client.once(Events.ClientReady, readyClient => {
    console.log(`Activating...${readyClient.user.tag} is online.`)
})

//Activate
client.login(token);

