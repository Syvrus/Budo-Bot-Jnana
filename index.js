//Establish libraries
const {Client} = require("discord.js");
const {token} = require("./config.json");
//Declare client
const client = new Client({intents: []});

//Activate
client.login(token);

