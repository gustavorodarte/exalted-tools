/* eslint-disable no-console */
/* eslint-disable fp/no-unused-expression */
const { verifyKey, InteractionResponseType, InteractionType } = require('discord-interactions');
const { rollDiceCommand } = require('../commands/rollDice/rollDiceCommand');


const isVerified = (req) => {
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  return verifyKey(JSON.stringify(req.body), signature, timestamp, process.env.DISCORD_PUBLIC_KEY);
};

const sendPONG = (response) => {
  console.log('🚀 sending pong message');
  return response.send({
    type: InteractionResponseType.PONG,
  });
};

const defineCommand = (request, response) => {
  const commands = {
    roll: () => rollDiceCommand({
      content: request.body.data.options
        ? request.body.data.options[0].value : request.body.data.custom_id,
      userName: request.body.member.nick || request.body.member.user.username,
      response,
    }),
  };

  const command = commands[request.body.data.name];

  return command();

};



const sendInvalidSignature = (response) => response.status(401).send('invalid request signature');

export default function handler(request, response) {
  const isPing = request.body.type === InteractionType.PING;

  const defaultFlow = () => (isPing ? sendPONG(response) : defineCommand(request, response));

  return isVerified(request) ? defaultFlow() : sendInvalidSignature(response);
}
