// Object-Oriented
// TODO: what about a sender, and recipient class for that matter?

const Block = require('./block');

class Blockchain {
  constructor() {
    // an array of Blocks | TODO, consider a Linked List?
    this.chain = [Block.genesis()];
  }

  newBlock(data) {
    const block = Block.newBlock(this.lastBlock(), data);

    this.chain.push(block);

    return block;
  }

  lastBlock() {
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
}

// TODO: what is a useful way to test this. API?
// Testing:
let bc = new Blockchain();
bc.newBlock('foo');
bc.newBlock('bar');
console.log(bc.toString());
