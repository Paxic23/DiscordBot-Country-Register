const fs = require('fs');
const path = require('path');

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Send gold from your country to another specified country')
    .addStringOption(option => option.setName('target')
      .setDescription('The name of the country you want to send gold to')
      .setRequired(true))
    .addIntegerOption(option => option.setName('amount')
      .setDescription('The amount of gold you want to send')
      .setRequired(true)),
  async execute(interaction) {
    const sender = interaction.user;
    const target = interaction.options.getString('target');
    const amount = interaction.options.getInteger('amount');
    
    // Read in the existing country data from the JSON file
    const filePath = path.join(__dirname, '..', 'data', 'countries.json');
    const countries = JSON.parse(fs.readFileSync(filePath));

    // Find the sender's country
    const senderCountry = countries.find(country => country.leader === sender.id);
    if (!senderCountry) {
      return await interaction.reply('You do not lead a country!');
    }

    // Find the target country
    const targetCountry = countries.find(country => country.name === target);
    if (!targetCountry) {
      return await interaction.reply(`The country "${target}" does not exist!`);
    }

    // Check if the sender has enough gold to send
    if (senderCountry.gold < amount) {
      return await interaction.reply(`You do not have enough gold to send ${amount} gold!`);
    }

    // Subtract the gold from the sender's country and add it to the target country
    senderCountry.gold -= amount;
    targetCountry.gold += amount;

    // Write the updated country data back to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(countries));

    await interaction.reply(`Successfully sent ${amount} gold from your country to ${target}!`);
  },
};