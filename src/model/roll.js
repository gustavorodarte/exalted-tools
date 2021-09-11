const {
  object, number, create, define,
} = require('superstruct');


const isPair = pair => pair.type() === 'Pair';

const Pair = define('Pair', isPair);

const Roll = object({
  diceSides: number(),
  diceAmount: number(),
  targetNumber: number(),
  successCounterType: Pair(),
});


const buildRollObject = data => create(data, Roll);


module.exports = {
  buildRollObject,
};
