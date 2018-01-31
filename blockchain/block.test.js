const Block = require('./block');
const { DIFFICULTY } = require('../config');

describe('Block', () => {
  let data;
  let block;

  beforeEach(() => {
    data = 'bar';
    block = Block.mineBlock(Block.genesis(), data);
  });

  it('sets `lastHash` to match the hash of the last block', () => {
    expect(block.lastHash).toEqual(Block.genesis().hash);
  });

  it(`creates a hash with leading 0's matching its difficulty`, () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
  });

  it('lowers the difficulty for slowly mined blocks', () => {
    const previousDifficulty = block.difficulty;

    expect(Block.adjustDifficulty(block, block.timestamp+200000)).toEqual(previousDifficulty-1);
  });

  it('raises the difficulty for quickly mined blocks', () => {
    const previousDifficulty = block.difficulty;

    expect(Block.adjustDifficulty(block, block.timestamp+1)).toEqual(previousDifficulty+1);
  });
});