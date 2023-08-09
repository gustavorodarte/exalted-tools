/* eslint-disable fp/no-unused-expression */
const isTruthy = require("crocks/predicates/isTruthy");
const diceRoller = require("./diceRoller");
const randomService = require("./services/random");
const nacl = require("tweetnacl");

// Create a new client instance

const ERROR_MSG =
  "Ops, parece que tivemos um problema. Os siderais já foram chamados, por favor aguarde e tente novamente.";

const parseRoll = (diceRoll, rollResult) => {
  const hasTargetNumber = isTruthy(rollResult.targetNumber);
  const msg = `\`${diceRoll}\` = ${rollResult.dicesValues.join(", ")} = **${
    rollResult.success
  } sucessos**`;

  const totalValue = rollResult.dicesValues.reduce((acc, curr) => acc + curr);
  const msg2 = `\`${diceRoll}\` = ${rollResult.dicesValues.join(
    ", "
  )} = **${totalValue}**`;
  return hasTargetNumber ? msg : msg2;
};

const makeBotResponse = (bot, msg, rollParsed) => {
  const username = msg.member.nick || msg.author.username;
  const message = `**${username}** rolls ${rollParsed}`;
  return bot.createMessage(msg.channel.id, message);
};

const rollDice = (body) => {
  const { getRandomIntegers } = randomService();
  return diceRoller
    .executeRoll(getRandomIntegers)(msg.content)
    .map((result) =>
      result.fork(
        (err) => {
          console.log("​rollDice -> err", err);
          return {
            type: 4,
            data: {
              content: ERROR_MSG,
            },
          };          
        },
        (rollResult) => {
          const rollParsed = parseRoll(msg.content, rollResult);
          return makeBotResponse(bot, msg, rollParsed);
        }
      )
    );
};

const commandsMap = {
  "roll": rollDice,
};

const handleMessage = (body) => {
  const isPing = body.type === 1;

  return isPing ? pongResponse() : commandsMap[body.data.name](body) ;
}


const verifySignature = (signature, timestamp, body) => {
  const PUBLIC_KEY = process.env.PUBLIC_KEY;
  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, "hex"),
    Buffer.from(PUBLIC_KEY, "hex")
  );

  return isVerified;
};

// Replying to ping (requirement 2.)

// Handle /foo Command
if (body.data.name == "foo") {
  return JSON.stringify({
    // Note the absence of statusCode
    type: 4, // This type stands for answer with invocation shown
    data: { content: "bar" },
  });
}

return {
  statusCode: 404, // If no handler implemented for Discord's request
};

const unauthorizedResponse = () => ({
  statusCode: 401,
  body: JSON.stringify("invalid request signature"),
});

const notFoundResponse = () => ({
  statusCode: 404,
});


const pongResponse = () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ type: 1 }),
  };
};

exports.handler = async (event) => {
  // Checking signature (requirement 1.)
  // Your public key can be found on your application in the Developer Portal
  const PUBLIC_KEY = process.env.PUBLIC_KEY;

  const signature = event.headers["x-signature-ed25519"];
  const timestamp = event.headers["x-signature-timestamp"];
  const strBody = event.body; // should be string, for successful sign

  const isVerified = verifySignature(signature, timestamp, strBody);

  const parsedBody = JSON.parse(strBody);

  return isVerified ? await handleMessage(bot)(msg) : unauthorizedResponse();
};
