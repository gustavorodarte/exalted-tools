/* eslint-disable fp/no-unused-expression */
const { REST, Routes } = require('discord.js');

// eslint-disable-next-line fp/no-nil
const createCommand = async () => {
  const commands = [
    {
      name: 'ping',
      description: 'Replies with Pong!',
    },
  ];

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  console.log('Started refreshing application (/) commands.');

  try {
    const result = await rest.put(Routes.applicationCommands('333143228490579970'), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.log('🚀 ~ createCommand ~ error:', error);
  }
};

// eslint-disable-next-line fp/no-unused-expression
createCommand();
