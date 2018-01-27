const Block = require('./block');
const Blockchain = require('./blockchain');
// TODO: what is a useful way to test this. API?
// Testing:
let bc = new Blockchain();
bc.addBlock('foo');
bc.addBlock('bar');
bc.addBlock('zab');
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
corruptChain[2].data = 'bad data';
console.log('Removing the last block...');
bc.chain.splice(bc.chain.length-1, 1);

// In presentation, let this print false first, and then make it valid after
// successfully deep cloning the chain. Then re-corrupt it.
// console.log(`Will a corrupt chain be valid: ${bc.isValidChain(corruptChain)}`);
console.log('Will a corrupt chain replace the current chain?\nCalling: bc.replaceChain(corruptChain)...');
bc.replaceChain(corruptChain);

let newValidChain = [];
for (let i=0; i<bc.chain.length; i++) {
  newValidChain[i] = Object.create(bc.chain[i]);
}
newValidChain.push(Block.mineBlock(newValidChain[newValidChain.length-1], 'goo'));

console.log('Will a new valid chain replace the block chain?\nCalling bc.replaceChain(newValidChain)...');
bc.replaceChain(newValidChain);
console.log(bc.toString());

// TODO: construct a 'proof of work', that shows it's actually taking time to do the mining