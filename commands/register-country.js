const fs = require('fs');
const path = require('path');

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register-country')
    .setDescription('Register a new country')
    .addStringOption((option) =>
      option
        .setName('named')
        .setDescription('The name of the country')
        .setRequired(true))
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to assign as the leader of the country')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
  async execute(interaction) {
    const named = interaction.options.getString('named').toLowerCase();
    const leader = interaction.options.getUser('user');

    //Check if country already exists in the JSON file
    const filePath = path.join(__dirname, '..', 'data', 'countries.json');
    const countries = JSON.parse(fs.readFileSync(filePath));
    const occupiedCountries = countries.find((country) => country.name.toLowerCase() === named);

    //Check if the country exists
    const filePath2 = path.join(__dirname, '..', 'data', 'countryarray.json');
    const countries2 = JSON.parse(fs.readFileSync(filePath2));
    const existingCountries = countries2.find((country) => country.toLowerCase() === named);

    //This line is the prework for the "else if" further down
    const existingLeader = countries.find((country) => country.leader.id === leader.id);

    if (occupiedCountries) {
      return interaction.reply(`The country *${named}* is already registered.`);
    }
    else if (!existingCountries) {
      return interaction.reply(`"${named}" doesn't exist. It's a hoax!`);
    }

    else if (existingLeader) {
      return interaction.reply(`Dear leader. ${user} is already reigning a country.`);
    }
    else{
      

      //Sets all letters after whitespace to Upper
      const word = named.toString();                                          //got typeerror at some point for String, it isn't necessary anymore, it's mainly there as a reminder
      const words = word.split(" ");                           
      //const name = ("");                       

      for (let i = 0; i < words.length; i++) {                                        //For each country name
          words[i] = words[i][0].toUpperCase() + words[i].substr(1);
          nr = i
      }

      const name = words.join(" ");

      // Create a new country object and add it to the list of countries
      const newCountry = { name, leader: leader, gold: 0 };
      countries.push(newCountry);

      // Write the updated country data back to the JSON file
      fs.writeFileSync(filePath, JSON.stringify(countries));

      return interaction.reply(`Successfully registered **${name}** as a new country with ${leader} as the leader!`);
    }
  },
};