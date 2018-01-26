const Block = require('./block');
const Blockchain = require('./blockchain');
// TODO: what is a useful way to test this. API?
// Testing:
let bc = new Blockchain();
bc.newBlock('foo');
setTimeout(() => {
  bc.newBlock('bar');
  // TODO: prove the isValidChain functionality somehow.
  // TODO: test the genesis case
  console.log(bc.toString());
  console.log(`Original bc (blockchain) is a valid chain: ${bc.isValidChain(bc.chain)}`);

  // create a clone of the chain:
  let corruptChain = [];
  for (let i=0; i<bc.chain.length; i++) {
    corruptChain[i] = Object.create(bc.chain[i]);
  }
  // corrupting the chain
  corruptChain[0].hash = 'bad data';

  // In presentation, let this print false first, and then make it valid after
  // successfully deep cloning the chain. Then re-corrupt it.
  console.log(`Will a corrupt chain be valid: ${bc.isValidChain(corruptChain)}`);
  console.log('Will a corrupt chain replace the current chain: bc.replaceChain(corruptChain)');
  bc.replaceChain(corruptChain);

  let newValidChain = [];
  for (let i=0; i<bc.chain.length; i++) {
    newValidChain[i] = Object.create(bc.chain[i]);
  }
  newValidChain.push(Block.newBlock(newValidChain[newValidChain.length-1], 'goo'));

  console.log('Will a new valid chain replace the block chain?');
  bc.replaceChain(newValidChain);

  console.log(bc.toString());
}, 50);