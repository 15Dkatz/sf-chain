// Object-Oriented
// TODO: what about a sender, and recipient class for that matter?

// Explain skeleton-based coding philosophy - fill things out bit by bit

const Block = require('./block');

class Blockchain {
  constructor() {
    // an array of Blocks | TODO, consider a Linked List?
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    const block = Block.mineBlock(this.lastBlock(), data);

    this.chain.push(block);

    return block;
  }

  lastBlock() {
    // This should return the last block in the chain
    return this.chain[this.chain.length-1];
  }

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

    // Seems like bitcoin actually prefers the longest chain
    // // pick the chain with the highest difficulty. Ok. But why though?
    // if (this.accumulatedDifficulty(this.chain) > this.accumulatedDifficulty(newChain)) {
    //   console.log('The received chain has a lower difficulty than this chain.');
    //   return;
    // }

    console.log('Replacing blockchain with the new chain.');
    this.chain = newChain;
  }


  // // TODO: consider removing
  // accumulatedDifficulty(chain) {
  //   return chain.reduce((total, block) => total + block.difficulty);
  // }


  /*
    Why this is necessary:
    When other nodes attempt to contribute to the blockchain, we must make sure
    that their blocks match our chain. If the proposed block's hash doesn't
    match our calculation, then it rejects too.

    chain is an array of blocks
  */
  isValidChain(chain) {
    // then validate every following block
    for (let i=1; i<chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i-1];

      if (
        block.lastHash !== lastBlock.hash ||
        // // this part ensures that a connecting node to the blockchain doesn't
        // // have an improper hash function calculator
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
