const fs = require('fs');
const path = require('path');

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list-countries')
    .setDescription('Lists all countries'),

  //Starts executing command
  //Reads countries.json so that it can be compared and used later
  async execute(interaction) {     
    const filePath = path.join(__dirname, '..', 'data', 'countries.json');
    const countries = JSON.parse(fs.readFileSync(filePath));

    let countryList = `List of countries:\n`;

    //goes through all registered countries and displays with name of leader
    for (const country of countries) {
        const leader = interaction.guild.members.cache.get(country.leader.id);      // Get leader's member object
        const leaderName = leader ? leader.displayName : country.leader.username;   // Returns displayName if they have, if not it'll return username
        countryList += `${country.name} (${leaderName})\n`;
    }

    //Failsafe
    try {
        await interaction.reply(countryList);
      } catch (error) {
        console.error(error);
      }
  }
}