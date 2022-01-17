const RandomOrg = require('random-org');


const random = () => {

    const random = new RandomOrg({
        apiKey: process.env.RANDOM_TOKEN,
    });

    const getRandomIntegers = Async.fromPromise(() => random.generateIntegers({
        min: 1,
        max: roll.dicesSides[0],
        n: roll.dicesAmount[0],
    }));
}