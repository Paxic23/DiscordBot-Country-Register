const fs = require('fs');
const path = require('path');

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const countries = require('../data/countryarray.json')


module.exports = {
  data: new SlashCommandBuilder()
    .setName('search-country')
    .setDescription('Gives information about said country')
    .addStringOption(option =>
      option.setName('named')
        .setDescription('The country to search')
        .setRequired(true)
    ),


  
  async execute(interaction) {     
    const chosenCountry = interaction.options.getString('named');
    
    const filePath = path.join(__dirname, '..', 'data', 'countries.json');
    const countries = JSON.parse(fs.readFileSync(filePath));
    const existingCountry = countries.find((country) => country.name.toLowerCase() === chosenCountry.toLowerCase());
    if (existingCountry) {
        const leader = interaction.guild.members.cache.get(existingCountry.leader.id);      // Get leader's member object
        const leaderName = leader ? leader.displayName : country.leader.username;   // Returns displayName if they have, if not it'll return username
        return interaction.reply(`${existingCountry.name} is a country lead by ${leaderName} with a wealth of ${existingCountry.gold} gold.`);
    }
    else if (!existingCountry) {
        return interaction.reply(`${chosenCountry}?! No such country exists!`)
    }
    else{
        return interaction.reply(`There is no information about ${chosenCountry}.`);
    }

  }
}