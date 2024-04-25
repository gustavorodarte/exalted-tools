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
  return verifyKey(req.body, signature, timestamp, process.env.DISCORD_PUBLIC_KEY);
};

export default function handler(request, response) {
  const isPing = request.body.type === InteractionType.PING;
  const sendPONG = () => response.send(JSON.stringify({
    type: InteractionResponseType.PONG,
  }));

  const sendInvalidSignature = () => response.status(401).send('invalid request signature');

  const defaultResponse = JSON.stringify({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      tts: false,
      content: 'Congrats on sending your command!',
      embeds: [],
      allowed_mentions: { parse: [] },
    },
  });

  const defaultFlow = () => (isPing ? sendPONG() : response.send(defaultResponse));

  return isVerified(request) ? defaultFlow() : sendInvalidSignature();
}
