/* eslint-disable no-console */
/* eslint-disable fp/no-unused-expression */
const { verifyKey, InteractionResponseType, InteractionType } = require('discord-interactions');
const isTruthy = require('crocks/predicates/isTruthy');
const diceRoller = require('../diceRoller');
const randomService = require('../services/random');

const isVerified = (req) => {
  const signature = req.headers['x-signature-ed25519'];
  console.log('🚀 ~ isVerified ~ signature:', signature);
  const timestamp = req.headers['x-signature-timestamp'];
  console.log('🚀 ~ isVerified ~ timestamp:', timestamp);
  console.log('🚀 ~ isVerified ~ req.headers:', req.headers);
  console.log('🚀 ~ isVerified ~ req.rawBody:', req.body);
  console.log('🚀 ~ isVerified ~ DISCORD_PUBLIC_KEY:', process.env.DISCORD_PUBLIC_KEY);
  return verifyKey(JSON.stringify(req.body), signature, timestamp, process.env.DISCORD_PUBLIC_KEY);
};

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

const rollDice = ({
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

const sendPONG = (response) => {
  console.log('🚀 sending pong message');
  return response.send({
    type: InteractionResponseType.PONG,
  });
};

const rollFlow = (request, response) => rollDice({
  content: request.body.data.options
    ? request.body.data.options[0].value : request.body.data.custom_id,
  userName: request.body.member.nick || request.body.member.user.username,
  response,
});

const sendInvalidSignature = (response) => response.status(401).send('invalid request signature');

export default function handler(request, response) {
  const isPing = request.body.type === InteractionType.PING;

  const defaultFlow = () => (isPing ? sendPONG(response) : rollFlow(request, response));

  return isVerified(request) ? defaultFlow() : sendInvalidSignature(response);
}
