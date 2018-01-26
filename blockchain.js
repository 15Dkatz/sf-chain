// Object-Oriented
// TODO: what about a sender, and recipient class for that matter?

const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [];
    // create the first block
    // first hash is 1, first proof is 100
    this.newBlock('1', 100);
  }

  newBlock(previousHash, proof) {
    console.log('Create a new block and add it to the chain');

    const block = new Block(this.chain, proof, previousHash);

    // Reset the current list of transactions
    // this.currentTransactions = [];
    this.chain.push(block);

    return block;
  }

  // TODO: test
  lastBlock() {
    console.log('Return the last Block in the chain')
    // This should return the last block in the chain
    return this.chain[this.chain.length-1];
  }

  // print the length of the chain, and call to String on every block in the chain
  toString() {
    let string = `Length of chain: ${this.chain.length}\n`;
    this.chain.forEach(block => {
      string += `${block.toString()}\n`;
    });
    return string;
  }

  static hash(block) {
    console.log(`Hash this ${block}`)
  }
}

// TODO: what is a useful way to test this. API?
// Testing:
let bc = new Blockchain();
bc.lastBlock().newTransaction('foo', 'bar', 5);
setTimeout(() => {
  bc.newBlock();
  console.log(bc.toString());
}, 2000);
