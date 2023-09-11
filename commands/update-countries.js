const fs = require('fs');
const path = require('path');

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('update-names')
    .setDescription('Update names in the JSON file'),

  async execute(interaction) {     
    const filePath = path.join(__dirname, '..', 'data', 'countries.json');
    const countries = JSON.parse(fs.readFileSync(filePath));

    for (const country of countries) {
      const leader = interaction.guild.members.cache.get(country.leader.id);
      if (leader) {
        country.leader.username = leader.user.username;
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(countries, null, 2));

    try {
      await interaction.reply('Names updated successfully!');
    } catch (error) {
      console.error(error);
    }
  }
}
