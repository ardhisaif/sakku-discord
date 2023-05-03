require('dotenv').config()
const {REST, Routes} = require('discord.js')

const commands = [
    {
        name: 'hey',
        description: 'Replies with hey',
    },
    {
        name: 'ping',
        description: 'pong!',
    },
];

const rest = new REST({version:'10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('registering slash command');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID),{body: commands}
        );

        console.log('slash commands were registered successfully');
    } catch (error) {
        console.log(`there was error: ${error}`);
    }
})();