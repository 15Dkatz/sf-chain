const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', () => {
  let bc;

  beforeEach(() => {
    bc = new Blockchain();
  });

  it('starts with the genesis block', () => {
    expect(bc.chain[0]).toEqual(Block.genesis());
  });

  it('returns the last block', () => {
    const data = 'foo';
    bc.addBlock(data);

    expect(bc.lastBlock().data).toEqual(data);
  });

  it('validates a valid chain', () => {
    bc.addBlock('foo');
    bc.addBlock('zoo');

    expect(bc.isValidChain(bc.chain)).toBe(true);
  });

  it('invalidates a chain with a corrupt genesis block', () => {
    bc.chain[0].data = 'Bad data';

    expect(bc.isValidChain(bc.chain)).toBe(false);
  });

  it('invalidates a corrupt chain', () => {
    bc.addBlock('foo');
    bc.addBlock('zoo');

    bc.chain[1].data = 'not foo';

    expect(bc.isValidChain(bc.chain)).toBe(false);
  });

  it('replaces the chain with a valid chain', () => {
    const bc2 = new Blockchain();
    bc2.addBlock('goo');

    bc.replaceChain(bc2.chain);

    expect(bc.chain).toEqual(bc2.chain);
  });
});