/* eslint-disable no-console */
/* eslint-disable fp/no-unused-expression */
const { verifyKey, InteractionResponseType, InteractionType } = require('discord-interactions');
// Your public key can be found on your application in the Developer Portal
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

export default function handler(request, response) {
  const isPing = request.body.type === InteractionType.PING;
  const sendPONG = () => {
    console.log('🚀 sending pong message');
    return response.send({
      type: InteractionResponseType.PONG,
    });
  };

  const sendInvalidSignature = () => response.status(401).send('invalid request signature');

  const sendDefaultResponse = () => {
    const defaultMessage = {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        tts: false,
        content: 'Congrats on sending your command!',
        embeds: [],
        allowed_mentions: { parse: [] },
      },
    };
    console.log('🚀 sending default message', defaultMessage);
    return response.status(200).send(defaultMessage);
  };

  const defaultFlow = () => (isPing ? sendPONG() : sendDefaultResponse());

  return isVerified(request) ? defaultFlow() : sendInvalidSignature();
}
