const RandomOrg = require('random-org');
const { fromPromise } = require('crocks/Async');

const randomService = () => {
  const random = new RandomOrg({
    apiKey: process.env.RANDOM_TOKEN,
  });

  return {
    getRandomIntegers: (max, amount, min = 1) => {
      const generateIntegers = fromPromise(() => random.generateIntegers({
        min,
        max,
        n: amount,
      }));
      return generateIntegers().map((result) => result.random.data);
    },
  };
};

// // eslint-disable-next-line fp/no-unused-expression
// randomService().getRandomIntegers(10, 20)
//   .fork(log, log);

module.exports = randomService;
