const fs = require('node:fs');                                                                  //define 
const path = require('node:path');                                                              //define
const { Client, Collection, GatewayIntentBits } = require('discord.js');                        //define 
const { token } = require('./config.json');                                                     //define the token by where to direct to for the data

const client = new Client({ intents: [GatewayIntentBits.Guilds] });                             //define

client.commands = new Collection();                                                             //define, creating collection
const commandsPath = path.join(__dirname, 'commands');                                          //define commandPath
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));         //define commandFiles

for (const file of commandFiles) {                                                              //for every X (file) of commandFiles
	const filePath = path.join(commandsPath, file);                                             //define "FilePath" as file of commandsPath (AKA every file in the folder "commands")
	const command = require(filePath);                                                          //define "command" as to be a file inside "commands" (required)
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module                    //refering to collection(value, key, collection)
	client.commands.set(command.data.name, command);                                            
}

client.once('ready', () => {                                                                    //checking if the bot is running
	console.log('Ready!');                                                                      //print in console "Ready!" if the bot is running
});


client.on('interactionCreate', async interaction => {                                           //
	if (!interaction.isChatInputCommand()) return;                                              //

	const command = client.commands.get(interaction.commandName);                               //

	if (!command) return;                                                                       //

	try {                                                                                       //check for errors in execution of command
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


client.login(token);


