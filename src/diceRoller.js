const { get } = require('crocks/State');
const safe = require('crocks/Maybe/safe');
const { pipe, setProp, assign } = require('crocks/helpers');
const prop = require('crocks/Maybe/prop');
const log = require('./lib/log');


// isRoll :: String -> Boolean
const isRoll = message => message.substring(0, 1) === '#';


// safeStringMatch ::  Regex -> String -> Maybe String
const safeStringMatch = regex => pipe(string => string.match(regex), prop(0));

// getDiceType :: String -> Maybe String
const getDiceType = safeStringMatch(/(?<=d)\d*/);

// getDiceAmount :: String -> Maybe String
const getDiceAmount = safeStringMatch(/\d*(?=d)/);

// getTargetNumberMatch :: String -> Maybe String
const getTargetNumberMatch = safeStringMatch(/(?<=(x|e))\d*/);

// getSuccessCounterTypeMatch :: String -> Maybe String
const getSuccessCounterTypeMatch = safeStringMatch(/[xe]/);


// String -> Maybe String
const hasRollNotation = safe(isRoll);


// buildRollObject :: String -> Roll
const buildRollObject = notation => ({
  diceType: getDiceType(notation),
  diceAmount: getDiceAmount(notation),
  targetNumberMatch: getTargetNumberMatch(notation),
  successCounterTypeMatch: getSuccessCounterTypeMatch(notation),
});

// parseNotation :: String -> Maybe Roll;
const parseNotation = message => hasRollNotation(message).map(buildRollObject);


log(
  parseNotation('#12d10x7')
);
