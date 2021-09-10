const { get } = require('crocks/State');
const safe = require('crocks/Maybe/safe');
const { pipe, setProp, assign } = require('crocks/helpers');
const prop = require('crocks/Maybe/prop');
const maybeToArray = require('crocks/Maybe/maybeToArray');
const { map } = require('crocks/pointfree');
const getProp = require('crocks/Maybe/getProp');
const { fromPromise } = require('crocks/Async');
const RandomOrg = require('random-org');
const getPath = require('crocks/Maybe/getPath');
const log = require('./lib/log');


// getDicesValues :: Number -> Number -> Async [ Number ]
const getDicesValues = diceType => (dicesAmount) => {
  const random = new RandomOrg({
    apiKey: process.env.RANDOM_TOKEN,
  });

  const getRandomIntegers = fromPromise(() => random.generateIntegers({
    min: 1,
    max: diceType,
    n: dicesAmount,
  }));

  return getRandomIntegers.map(getPath(['random', 'data']));
};

// isRoll :: String -> Boolean
const isRoll = message => message.substring(0, 1) === '#';

// safeStringMatch ::  Regex -> String -> [ String ]
const safeStringMatch = regex => pipe(string => string.match(regex), prop(0), maybeToArray);

// getDiceSides :: String -> Maybe String
const getDiceSides = safeStringMatch(/(?<=d)\d*/);

// getDiceAmount :: String -> Maybe String
const getDiceAmount = safeStringMatch(/\d*(?=d)/);

// getTargetNumber :: String -> Maybe String
const getTargetNumber = safeStringMatch(/(?<=(x|e))\d*/);


// mapSuccessCounterType :: String -> String;
const mapSuccessCounterType = map((successCounterNotation) => {
  const successCounterType = {
    e: 'SUCCESS_DEFAULT',
    x: 'SUCCESS_MAX_COUNT_TWO',
    f: 'SUCCESS_MINUS_FAILURE',
  };

  return successCounterType[successCounterNotation];
});

// getSuccessCounterType :: String -> Maybe String
const getSuccessCounterType = pipe(safeStringMatch(/[xef]/), mapSuccessCounterType);


// String -> Maybe String
const hasRollNotation = safe(isRoll);


// buildRollObject :: String -> Roll
const buildRollObject = notation => ({
  diceSides: getDiceSides(notation),
  diceAmount: getDiceAmount(notation),
  targetNumber: getTargetNumber(notation),
  successCounterType: getSuccessCounterType(notation),
});

// parseNotation :: String -> Maybe Roll;
const parseNotation = message => hasRollNotation(message).map(buildRollObject);


// executeRoll :: Roll -> String
// const executeRoll = () => {
//   fromPromise();
// };

log(
  parseNotation('#12d10x7'),
);
