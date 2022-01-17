const diceRoller = require('../src/diceRoller');
const RandomOrg = require('random-org');

jest.mock(RandomOrg);

describe('DiceRoller', () => {
  describe('#executeRoll', () => {
    beforeEach(() => {

    });

    test('when receives a SUCCESS_MAX_COUNT_TWO notation', () => {
      const notation = '#2010x7';
      const diceRollResult = diceRoller.executeRoll(notation)
        .map(roll => roll
          .fork(
            () => '',
            () => '',
          ));
    });
  });
});