//Establish requirement
const fs = require("node:fs"); //identify command file
const path = require("node:path"); //file and directory access assistance
const {Client,Collection,Events,GatewayIntentBits} = require("discord.js"); //discord api
const {token} = require("./config.json"); //keys

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
            client.commands.set(command.data.name, command); //load command
        } else {
            console.log(`[WARNING] Command at ${filePath} is missing require "data" or "execute" property.`);
        }
    }
}
//Listens for interactions
client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return; //Checks for non command interactions
    //Obtain command interaction
    const command = interaction.client.commands.get(interaction.commandName);
    //Checks if command exists
    if(!command) {
        console.error(`${interaction.commandName} not found.`);
        return;
    }
    //Execute command
    try {
        await command.execute(interaction);
    } catch (error) { //Logs when error occurs with command functionality
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: "Error with executing command", ephemeral: true }); //When error occurs post-output or timeout
        } else {
            await interaction.reply({ content: "Error with executing command", ephemeral: true }); //When error occurs pre-output
        }
    }
})

//Console intro message
client.once(Events.ClientReady, readyClient => {
    console.log(`Activating...${readyClient.user.tag} is online.`)
})

//Activate
client.login(token);

