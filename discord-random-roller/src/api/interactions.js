const { verifyKey, InteractionResponseType, InteractionType } = require('discord-interactions')
// Your public key can be found on your application in the Developer Portal
const isVerified = (req) => {
  const signature = req.headers['X-Signature-Ed25519'];
  const timestamp = req.headers['X-Signature-Timestamp'];

  return verifyKey(req.rawBody, signature, timestamp, process.env.DISCORD_CLIENT_ID);
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
