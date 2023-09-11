const fs = require('fs');
const path = require('path');

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const countryNames = require('../data/countryarray.json')




module.exports = {
  data: new SlashCommandBuilder()
    .setName('pick-country')
    .setDescription('Pick a country')
    .addStringOption(option =>
      option.setName('country')
        .setDescription('The country to pick')
        .setRequired(true)
        //.addChoices(countryNames.map((name) => [name]))
    ),

  async execute(interaction) {
    const chosenCountry = interaction.options.getString('country').toLowerCase();

    const leader = interaction.user;                                            //Gets user info of the one who uses the slashcommand
    

    //Available countries
    const filePath = path.join(__dirname, '..', 'data', 'countryarray.json');   //Could be changed out with 'countrylist.json', but remember to fix 'country.name.toLowerCase()' in that case
    const countries = JSON.parse(fs.readFileSync(filePath));

    //Taken countries countries
    const filePath2 = path.join(__dirname, '..', 'data', 'countries.json');
    const countries2 = JSON.parse(fs.readFileSync(filePath2));
    const existingCountry = countries2.find((country) => country.name.toLowerCase() === chosenCountry);         //Finds or searches in the array under .name for something named the same
    
    //Index of matching country
    const countryIndex = countries.findIndex(country => country.toLowerCase() === chosenCountry);

    
    if (countryIndex === -1) {                                                  //If the input cannot be found as an index in the array (could've been used !existingCountry instead)
      return interaction.reply(`There is no country called ${chosenCountry}. (you might've misspelled it ¯/ _ (ツ) _ / ¯)`);
    }

    else if (existingCountry) {                                                 //If it is an existing country (can be found as a name in the array)
      return interaction.reply(`${chosenCountry} already has a leader!`);
    }
    
    else {
      const filePath3 = path.join(__dirname, '..', 'data', 'countries.json');
      const countries3 = JSON.parse(fs.readFileSync(filePath3));
      const existingLeader = countries3.find((country) => country.leader.id === leader.id);
      if (existingLeader) {
        return interaction.reply(`Dear leader. You're already reigning a country.`);
      }
      else{
        //Sets all letters after whitespace to Upper
            const word = chosenCountry.toString();                                          //got typeerror at some point for String, it isn't necessary anymore, it's mainly there as a reminder
            const words = word.split(" ");                                                  

            for (let i = 0; i < words.length; i++) {                                        //For each country
                words[i] = words[i][0].toUpperCase() + words[i].substr(1);
                fullword = words.join(" ");
            }

        const newCountry = { name: fullword, leader: leader, gold: 0 };
        countries2.push(newCountry);

        fs.writeFileSync(filePath2, JSON.stringify(countries2));


        return interaction.reply(`${leader} is now the leader of **${fullword}**. May he be a catalyst for his country.`);
      }
    }
  }
};

//for (let i = 0; i < countryNames.lenght; i++){
      //if (chosenCountry = countryNames[i]){
          //const embed = new MessageEmbed()
          //.setTitle(`You picked ${chosenCountry}`)
          //.setColor('GREEN');
          //await interaction.reply({ embeds: [embed] });

          //return interaction.reply({chosenCountry});
      //}


//if (!selectedCountry) {
        //return interaction.reply({ content: 'Invalid country selected.', ephemeral: true });
    //}


    //const embed = new MessageEmbed()
      //.setTitle(`You picked ${selectedCountry}`)
      //.setColor('GREEN');

    //await interaction.reply({ embeds: [embed] });


