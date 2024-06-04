//Establish libraries
const {Client,Events,GatewayIntentBits} = require("discord.js");
const {token} = require("./config.json");
//Declare client
const client = new Client({intents: []});

client.once(Events.ClientReady, readyClient => {
    console.log(`Activating...${readyClient.user.tag} is online.`)
})

//Activate
client.login(token);

