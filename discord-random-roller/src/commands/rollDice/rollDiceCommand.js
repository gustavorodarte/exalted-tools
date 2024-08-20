const isTruthy = require('crocks/predicates/isTruthy');
const diceRoller = require('./diceRoller');
const randomService = require('../../services/random');

const ERROR_MSG = 'Ops, parece que tivemos um problema. Os siderais já foram chamados, por favor aguarde e tente novamente.';

const parseRoll = (diceRoll, rollResult) => {
  const hasTargetNumber = isTruthy(rollResult.targetNumber);
  const msg = `\`${diceRoll}\` = ${rollResult.dicesValues.join(', ')} = **${rollResult.success} sucessos**`;

  const totalValue = rollResult.dicesValues.reduce((acc, curr) => acc + curr);
  const msg2 = `\`${diceRoll}\` = ${rollResult.dicesValues.join(', ')} = **${totalValue}**`;
  return hasTargetNumber ? msg : msg2;
};

const sendCommandResponse = (response, content, originalContent) => {
  const defaultMessage = {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      tts: false,
      content,
      embeds: [],
      allowed_mentions: { parse: [] },
      components: [
        {
          type: 1,
          components: [{
            type: 2,
            label: 'Reroll!',
            style: 3,
            custom_id: originalContent,
          }],
        },
      ],
    },
  };
  console.log('🚀 sending default message', defaultMessage);
  return response.status(200).send(defaultMessage);
};

const rollDiceCommand = ({
  content,
  userName,
  response,
}) => {
  const { getRandomIntegers } = randomService();
  return diceRoller.executeRoll(getRandomIntegers)(content)
    .map((result) => result.fork(
      (err) => {
        console.log('​rollDice -> err', err);
        return sendCommandResponse(ERROR_MSG);
      },
      (rollResult) => {
        const rollParsed = parseRoll(content, rollResult);
        const message = `**${userName}** rolls ${rollParsed}`;
        return sendCommandResponse(response, message, content);
      },
    ));
};


module.exports =  {
  rollDiceCommand,
};