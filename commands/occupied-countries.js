const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

function hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
  }


module.exports = {
	data: new SlashCommandBuilder()
		.setName('occupied-countries')
		.setDescription('Shows all occupied countries'),

	async execute(interaction) {
	    const filePath = path.join(__dirname, '..', 'data', 'countries.json');
        const countries = JSON.parse(fs.readFileSync(filePath));

        const cntrs = [];
        cntrs.lenght = 0                                                                    //Make sure it gets reset for every time the command is used

        //Used to make sure every first letter in country names are upper, after whitespace as well
        //Not actually necessary, but I made it here at first and can't be bothered to remove it, we'll call it extra measures ;)
        for (let element of countries){                                                     //For the full array
            
            const word = element.name.toString();
            const words = word.split(" ");


            for (let i = 0; i < words.length; i++) {                                        //For each country
                words[i] = words[i][0].toUpperCase() + words[i].substr(1);
                fullword = words.join(" ");
                
            }
            cntrs.push(` ${fullword}`);
            
            
        }
        return interaction.reply(`The current occupied countries are: ${cntrs}`);
	},
};


            //first = element.name.charAt(0).toUpperCase()
            //rest = element.name.slice(1)
            //space = hasWhiteSpace(element)