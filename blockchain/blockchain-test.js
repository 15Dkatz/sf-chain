const Block = require('./block');
const Blockchain = require('./blockchain');

let bc = new Blockchain();
bc.addBlock('foo');
bc.addBlock('bar');
bc.addBlock('zab');

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

console.log('Will a corrupt chain replace the current chain?\nCalling: bc.replaceChain(corruptChain)...');
bc.replaceChain(corruptChain);

const newValidChain = [];
for (let i=0; i<bc.chain.length; i++) {
  newValidChain[i] = Object.create(bc.chain[i]);
}
newValidChain.push(Block.mineBlock(newValidChain[newValidChain.length-1], 'goo'));

console.log('Will a new valid chain replace the block chain?\nCalling bc.replaceChain(newValidChain)...');
bc.replaceChain(newValidChain);
console.log(bc.toString());

const loops = 5;
console.log(`Demonstrating adjusting difficulty for ${loops} blocks
  Every block takes ~1 second to complete. So this loop will take ~${loops}s to complete...`);

for (let i=0; i<loops; i++) {
  bc.addBlock(`foo${i}`);
}

console.log(bc.toString());
console.log('Will the chain be replaced by a chain with lower difficulty?...');
const easierChain = [];
for (let i=0; i<bc.chain.length; i++) {
  easierChain[i] = Object.create(bc.chain[i]);
}
easierChain.splice(bc.chain.length-3, 3);
bc.replaceChain(easierChain);