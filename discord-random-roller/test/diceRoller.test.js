const Async = require('crocks/Async');
const diceRoller = require('../src/diceRoller');

describe('DiceRoller', () => {
  describe('#executeRoll', () => {
    beforeEach(() => {

    });

    test('when receives a SUCCESS_MAX_COUNT_TWO notation', (done) => {
      const notation = '#20d10x7';
      const getRandomIntegersMock = () => Async.of([
        8, 1, 9, 3, 3, 4, 6, 6, 3, 7, 2, 10,
      ]);

      diceRoller.executeRoll(getRandomIntegersMock)(notation)
        .map((roll) => roll
          .fork(
            () => done(),
            (result) => {
              expect(result.success).toStrictEqual(5);
              done();
            },
          ));
    });

    test('when receives a SUCCESS_DEFAULT notation', (done) => {
      const notation = '#20d10e7';
      const getRandomIntegersMock = () => Async.of([
        8, 1, 9, 3, 3, 4, 6, 6, 3, 7, 2, 10,
      ]);

      diceRoller.executeRoll(getRandomIntegersMock)(notation)
        .map((roll) => roll
          .fork(
            () => done(),
            (result) => {
              expect(result.success).toStrictEqual(4);
              done();
            },
          ));
    });

    test('when receives a SUCCESS_MINUS_FAILURE notation', (done) => {
      const notation = '#20d10f7';
      const getRandomIntegersMock = () => Async.of([
        8, 1, 9, 3, 3, 4, 6, 6, 3, 7, 2, 10,
      ]);

      diceRoller.executeRoll(getRandomIntegersMock)(notation)
        .map((roll) => roll
          .fork(
            () => done(),
            (result) => {
              expect(result.success).toStrictEqual(3);
              done();
            },
          ));
    });

    test('when receives a notation without target number', (done) => {
      const notation = '#1d20';
      const getRandomIntegersMock = () => Async.of([
        20,
      ]);

      diceRoller.executeRoll(getRandomIntegersMock)(notation)
        .map((roll) => roll
          .fork(
            () => done(),
            (result) => {
              expect(result.success).toStrictEqual(undefined);
              expect(result.dicesValues).toStrictEqual([20]);
              done();
            },
          ));
    });
  });
});
