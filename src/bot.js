/* eslint-disable fp/no-unused-expression */
const pipe = require('crocks/helpers/pipe');
const isTruthy = require('crocks/predicates/isTruthy');
const Eris = require('eris');
const diceRoller = require('./diceRoller');
const randomService = require('./services/random');

const ERROR_MSG = 'Ops, parece que tivemos um problema. Os siderais já foram chamados, por favor agaurde e tente novamente.';

const parseRoll = (diceRoll, rollResult) => {
  const hasTargetNumber = isTruthy(rollResult.targetNumber);
  const msg = `\`${diceRoll}\` = ${rollResult.dicesValues.join(', ')} = **${rollResult.success} sucessos**`;

  const totalValue = rollResult.dicesValues.reduce((acc, curr) => acc + curr);
  const msg2 = `\`${diceRoll}\` = ${rollResult.dicesValues.join(', ')} = **${totalValue}**`;
  return hasTargetNumber ? msg : msg2;
};

const makeBotResponse = (bot, msg, rollParsed) => {
  const message = `**${msg.member.nick}** rolls ${rollParsed}`;
  return bot.createMessage(msg.channel.id, message);
};

const rollDice = (bot, msg) => {
  const { getRandomIntegers } = randomService();
  return diceRoller.executeRoll(getRandomIntegers)(msg.content)
    .map((result) => result.fork(
      (err) => {
        console.log('​rollDice -> err', err);
        return bot.createMessage(msg.channel.id, ERROR_MSG);
      },
      (rollResult) => {
        const rollParsed = parseRoll(msg.content, rollResult);
        return makeBotResponse(bot, msg, rollParsed);
      },
    ));
};

// eslint-disable-next-line fp/no-nil
const handleMessage = (bot) => (msg) => {
  try {
    const shouldRollDice = msg.content.substring(0, 1) === '#';
    const botResponse = shouldRollDice ? rollDice(bot, msg) : '';
    return botResponse;
  } catch (error) {
    console.error(error);
    return bot.createMessage(msg.channel.id, ERROR_MSG);
  }
};

const startBot = ({
  token,
}) => {
  const bot = new Eris(token);
  bot.on('ready', () => console.log('Ready!'));
  bot.on('messageCreate', handleMessage(bot));
  return bot.connect();
};

module.exports = {
  startBot,
};
