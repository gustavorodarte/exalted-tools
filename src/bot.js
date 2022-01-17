const Eris = require('eris');
const crocks = require('crocks');

const rollDice = () => { };
const handleMessage = bot => (msg) => {
  const shouldRollDice = msg.content.substring(0, 1) === '#';
  // const botResponse = shouldRollDice ? rollDice() : 
};

const startBot = ({
  token,
}) => {
  const bot = new Eris(token);
  bot.on('ready', () => console.log('Ready!'));
  bot.on('messageCreate', handleMessage(bot));

  return bot;
};
