const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    const block = Block.mineBlock(this.chain[this.chain.length-1], data);
    this.chain.push(block);
    return block;
  }

  // lastBlock() {
  //   return this.chain[this.chain.length-1];
  // }

  /* replace the chain with this new one if it's:
    a) valid
    b) longer than the current chain
  */
  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log('Received chain is not longer than the current chain.');
      return;
    } else

    if (!this.isValidChain(newChain)) {
      console.log('The received chain is not valid.');
      return;
    }

    console.log('Replacing blockchain with the new chain.');
    this.chain = newChain;
  }


  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
    // then validate every following block
    for (let i=1; i<chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i-1];

      if (
        block.lastHash !== lastBlock.hash
        ||
        // this part ensures that a connecting node to the blockchain doesn't
        // have an improper hash function calculator
        block.hash !== Block.blockHash(block)
      ) {
        return false;
      }
    }

    return true;
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

module.exports = Blockchain;
