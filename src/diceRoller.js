const safe = require('crocks/Maybe/safe');
const { pipe } = require('crocks/helpers');
const prop = require('crocks/Maybe/prop');
const maybeToArray = require('crocks/Maybe/maybeToArray');
const { map } = require('crocks/pointfree');
const Async = require('crocks/Async');
const RandomOrg = require('random-org');
const getPath = require('crocks/Maybe/getPath');
const tap = require('crocks/helpers/tap');
const { reduce } = require('crocks/pointfree');
const ifElse = require('crocks/logic/ifElse');
const Pair = require('crocks/Pair');
const equals = require('crocks/pointfree/equals');
const log = require('./lib/log');


// add :: Number -> Number -> Number
const add = x => y => x + y;

const addDicesValues = roll => dicesValues => ({
  ...roll,
  dicesValues,
});

const addSuccess = roll => success => ({
  ...roll,
  success,
});

// isRoll :: String -> Boolean
const isRoll = message => message.substring(0, 1) === '#';

// safeStringMatch ::  Regex -> String -> [ String ]
const safeStringMatch = regex => pipe(string => string.match(regex), prop(0), maybeToArray);

// getDicesSides :: String -> Maybe StriaddDicesValuesng
const getDicesSides = safeStringMatch(/(?<=d)\d*/);

// getDicesAmount :: String -> Maybe String
const getDicesAmount = safeStringMatch(/\d*(?=d)/);

// getTargetNumber :: String -> Maybe String
const getTargetNumber = safeStringMatch(/(?<=(x|e))\d*/);

// getDicesValues ::  Roll -> Async [ Number ]
const getDicesValues = (roll) => {
  const random = new RandomOrg({
    apiKey: process.env.RANDOM_TOKEN,
  });

  const getRandomIntegers = Async.fromPromise(() => random.generateIntegers({
    min: 1,
    max: roll.dicesSides[0],
    n: roll.dicesAmount[0],
  }));

  return getRandomIntegers().map(getPath(['random', 'data'])).map(map(addDicesValues(roll))).map(tap(log));
};

// mapSuccessCounterType :: String -> String;
const mapSuccessCounterType = maxNumber => map((successCounterNotation) => {
  const successCounterType = {
    e: Pair('SUCCESS_DEFAULT', add(1)),
    x: Pair('SUCCESS_MAX_COUNT_TWO', ifElse(equals(maxNumber), add(1), add(2))),
    f: Pair('SUCCESS_MINUS_FAILURE', ifElse(equals(1), add(1), add(-1))),
  };

  return successCounterType[successCounterNotation];
});

// getSuccessCounterType :: String -> Maybe String
const getSuccessCounterType = (notation) => {
  const maxNumber = getDicesSides(notation);
  return pipe(safeStringMatch(/[xef]/), mapSuccessCounterType(maxNumber))(notation);
};


// String -> Maybe String
const hasRollNotation = safe(isRoll);

// buildRollObject :: String -> Roll
const buildRollObject = notation => ({
  dicesSides: getDicesSides(notation),
  dicesAmount: getDicesAmount(notation),
  targetNumber: getTargetNumber(notation),
  successCounterType: getSuccessCounterType(notation),
});

// parseNotation :: String -> Maybe Roll;
const parseNotation = message => hasRollNotation(message).map(buildRollObject);

const successBasedRoll = (roll) => {
  const isSuccess = dice => dice >= roll.targetNumber[0];

  const successCounterTypeFn = roll.successCounterType[0].snd();

  const countReducer = reduce((success, dice) => (isSuccess(dice)
    ? successCounterTypeFn(success)
    : success), 0);

  const totalSuccess = countReducer(roll.dicesValues);
  return addSuccess(roll)(totalSuccess);
};

// executeRoll:: String -> Maybe [ Async ]
const executeRoll = message => parseNotation(message)
  .map(roll => getDicesValues(roll).map(map(successBasedRoll)));

// // eslint-disable-next-line fp/no-unused-expression
// executeRoll('#12d10x7').map(a => a.fork(log, log));

module.exports = {
  executeRoll,
};
