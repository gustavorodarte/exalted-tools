/* eslint-disable no-nested-ternary */
const safe = require('crocks/Maybe/safe');
const { pipe } = require('crocks/helpers');
const prop = require('crocks/Maybe/prop');
const maybeToArray = require('crocks/Maybe/maybeToArray');
const { map } = require('crocks/pointfree');
const { reduce } = require('crocks/pointfree');
const curry = require('crocks/helpers/curry');
const Pair = require('crocks/Pair');
const isTruthy = require('crocks/predicates/isTruthy');

// add :: Number -> Number -> Number
const add = (x) => (y) => x + y;

// pickFirst :: [] -> a
const pickFirst = ({ 0: result }) => result;

const addDicesValues = (roll) => (dicesValues) => ({
  ...roll,
  dicesValues,
});

const addSuccess = (roll) => (success) => ({
  ...roll,
  success,
});

// isRoll :: String -> Boolean
const isRoll = (message) => message.substring(0, 1) === '#';

// safeStringMatch ::  Regex -> String -> [ String ]
const safeStringMatch = (regex) => pipe((string) => string.match(regex), prop(0), maybeToArray);

// getDicesSides :: String -> Maybe StriaddDicesValuesng
const getDicesSides = safeStringMatch(/(?<=d)\d*/);

// getDicesAmount :: String -> Maybe String
const getDicesAmount = safeStringMatch(/\d*(?=d)/);

// getTargetNumber :: String -> Maybe String
const getTargetNumber = safeStringMatch(/(?<=(x|e|f))\d*/);

// getDicesValues ::  Roll -> Async [ Number ]
const getDicesValues = curry(
  (getRandomIntegers, roll) => getRandomIntegers(roll.dicesSides, roll.dicesAmount)
    .map(addDicesValues(roll)),
);

const defaultSuccessCounter = (success, dice, targetNumber) => {
  const isSuccess = dice >= targetNumber;
  return isSuccess ? add(success)(1) : success;
};

const maxCountTwoSuccessCounter = (maxNumber) => (success, dice, targetNumber) => {
  const isSuccess = dice >= targetNumber;
  return isSuccess
    ? dice === maxNumber
      ? add(2)(success)
      : add(1)(success)
    : success;
};

const successMinusFailureCounter = (success, dice, targetNumber) => {
  const isSuccess = dice >= targetNumber;
  return !isSuccess
    ? dice === 1
      ? add(-1)(success)
      : success
    : add(1)(success);
};

// mapSuccessCounterType :: String -> String;
const mapSuccessCounterType = (maxNumber) => map((successCounterNotation) => {
  const successCounterType = {
    e: Pair('SUCCESS_DEFAULT', defaultSuccessCounter),
    x: Pair('SUCCESS_MAX_COUNT_TWO', maxCountTwoSuccessCounter(maxNumber)),
    f: Pair('SUCCESS_MINUS_FAILURE', successMinusFailureCounter),
  };

  return successCounterType[successCounterNotation];
});

// getSuccessCounterType :: String -> Maybe String
const getSuccessCounterType = (notation) => {
  const maxNumber = +pipe(getDicesSides, pickFirst)(notation);
  return pipe(safeStringMatch(/[xef]/), mapSuccessCounterType(maxNumber))(notation);
};

// String -> Maybe String
const hasRollNotation = safe(isRoll);

// buildRollObject :: String -> Roll
const buildRollObject = (notation) => ({
  dicesSides: pipe(getDicesSides, pickFirst)(notation),
  dicesAmount: pipe(getDicesAmount, pickFirst)(notation),
  targetNumber: pipe(getTargetNumber, pickFirst)(notation),
  successCounterType: pipe(getSuccessCounterType, pickFirst)(notation),
});

// parseNotation :: String -> Maybe Roll;
const parseNotation = (message) => hasRollNotation(message).map(buildRollObject);

const successBasedRoll = (roll) => {
  const { targetNumber, dicesValues } = roll;

  const successCounterTypeFn = roll.successCounterType.snd();

  const countReducer = reduce((success, dice) => (
    successCounterTypeFn(success, dice, targetNumber)
  ), 0);

  const totalSuccess = countReducer(dicesValues);
  return addSuccess(roll)(totalSuccess);
};

const resolveSuccessRoll = (roll) => {
  const isSuccessBasedRoll = isTruthy(roll.targetNumber);
  return isSuccessBasedRoll ? successBasedRoll(roll) : roll;
};

// executeRoll:: String -> Maybe Async
const executeRoll = (getRandomIntegers) => (message) => parseNotation(message)
  .map(
    (roll) => getDicesValues(getRandomIntegers)(roll)
      .map(resolveSuccessRoll),
  );


module.exports = {
  executeRoll,
};
