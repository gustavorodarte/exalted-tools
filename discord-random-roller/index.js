/* eslint-disable fp/no-unused-expression */
const bot = require('./src/bot');

bot.startBot({
  token: process.env.DISCORD_TOKEN,
});
