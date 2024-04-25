/* eslint-disable fp/no-unused-expression */
const { REST, Routes } = require('discord.js');

// eslint-disable-next-line fp/no-nil
const createCommand = async () => {
  const commands = [
    {
      name: 'r',
      description: 'Replies with a DIce!',
      options: [
        {
          name: 'dice_number',
          description: 'The amount of dices',
          type: 4,
          required: true,
        },
        {
          name: 'dice_type',
          description: 'Type of the dice to roll',
          type: 4,
          required: true,
        },
        {
          name: 'roll_type',
          description: 'Type of the dice to roll',
          type: 3,
          required: true,
          choices: [
            {
              name: 'Normal',
              value: 'e',
            },
            {
              name: 'Damage',
              value: 'x',
            },
          ],
        },
        {
          name: 'target_number',
          description: 'target number',
          type: 4,
          required: true,
        },
      ],
    },
    {
      name: 'roll',
      description: 'classic formart',
      options: [
        {
          name: 'dice_sintax',
          description: 'Roll description',
          type: 3,
          required: true,
        },
      ],
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
