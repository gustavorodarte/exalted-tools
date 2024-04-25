/* eslint-disable no-nested-ternary */
const nacl = require('tweetnacl');

// Your public key can be found on your application in the Developer Portal
const PUBLIC_KEY = 'APPLICATION_PUBLIC_KEY';

const isVerified = (req) => {
  const signature = req.get('X-Signature-Ed25519');
  const timestamp = req.get('X-Signature-Timestamp');
  const body = req.rawBody; // rawBody is expected to be a string, not raw bytes

  return nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, 'hex'),
    Buffer.from(PUBLIC_KEY, 'hex'),
  );
};

export default function handler(request, response) {
  const isPing = request.body.type === '1';
  const sendPONG = () => response.send(JSON.stringify({
    type: 1,
  }));

  const sendInvalidSignature = () => response.status(401).send('invalid request signature');

  const defaultResponse = JSON.stringify({
    type: 4,
    data: {
      tts: false,
      content: 'Congrats on sending your command!',
      embeds: [],
      allowed_mentions: { parse: [] },
    },
  });

  const defaultFlow = () => (isPing ? sendPONG() : response.send(defaultResponse));

  return isVerified(request) ? sendInvalidSignature() : defaultFlow();
}
