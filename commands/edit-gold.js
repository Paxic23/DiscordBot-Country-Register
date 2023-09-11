const fs = require('fs');
const path = require('path');

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edit-gold')
        .setDescription('Edit the gold amount of a country')
        .addStringOption(option => option.setName('name')
            .setDescription('The name of the country')
            .setRequired(true))
        .addNumberOption(option => option.setName('gold')
            .setDescription('The new gold amount of the country')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),



    async execute(interaction) {
        const name = interaction.options.getString('name');
        const newGold = interaction.options.getNumber('gold');

        // Read in the existing country data from the JSON file
        const filePath = path.join(__dirname, '..', 'data', 'countries.json');
        const countries = JSON.parse(fs.readFileSync(filePath));

        // Find the country in the list of countries
        const countryIndex = countries.findIndex(country => country.name.toLowerCase() === name.toLowerCase());
        if (countryIndex === -1) {
            return interaction.reply(`There is no occupied country with the name, ${name}.`);
        }

        // Update the gold amount of the country
        countries[countryIndex].gold = newGold;

        // Write the updated country data back to the JSON file
        fs.writeFileSync(filePath, JSON.stringify(countries));

        return interaction.reply(`Successfully updated the gold amount of ${name} to ${newGold}!`);
    },
};