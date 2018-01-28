// TODO: figure out how to support es6 imports
// There are multiple conventions for instantiation.
// But the `static` approach is nice since you don't have to explitcly call `new`.
const SHA256 = require('crypto-js/sha256');
const DIFFICULTY = 4;

class Block {
  constructor(index, timestamp, lastHash, hash, data, nonce, difficulty) {
    // TODO: is the index part necessary?
    // yes the index is necessary to check additions of new blocks from multiple decentralized peers
    this.index = index;
    this.timestamp = timestamp;
    // the hash enforces the chain
    // each hash for each block is generated based off the lastHash.
    // So if you change one block, you must change all following blocks as well
    // A bad actor mess with one block individually, and pretend like everything will be fine
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block -
      Index     : ${this.index}
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Data      : ${this.data}
      Difficulty: ${this.difficulty}`;
  }

  // Why static? Why not declare outside of the class?
  // Nice to be able to share functionality under the Block namespace.
  static genesis() {
    return new this(0, 'Genesis time', '-----', 'f1rSt-h4sh', 'genesis block', 0);
  }

  static mineBlock(lastBlock, data) {
    const index = lastBlock.index+1;
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let hash, timestamp;
    let nonce = 0;

    do {
      // nonce - a way to control how quickly blocks are mined
      // nonce++ must be first, otherwise the hash will be different
      nonce++;
      hash = Block.hash(index, timestamp, lastHash, data, nonce);
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);s
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(index, timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, currentTime) {
    /*
      each block should be mined every 1 second(s)
      if lastBlock.timeStamp + 1000 milliseconds is greater than currentTime, then increase the difficulty by .1
      if the timestamp of the lastBlock is less than 1000 milliseconds, then decrease the difficulty by .1

      this should keep it stable around 1000 milliseconds levels of blocks generated

      test by creating a for loop up to 100 and watching the difficulty
    */
    let { difficulty } = lastBlock;

    difficulty = lastBlock.timestamp + 1000 > currentTime ? difficulty + 1 : difficulty - 1;

    return difficulty;
  }

  static hash(index, timestamp, lastHash, data, nonce, difficulty) {
    return SHA256(`${index}${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
  }

  static blockHash(block) {
    const { index, timestamp, lastHash, data, nonce } = block;
    return Block.hash(index, timestamp, lastHash, data, nonce);
  }
}

module.exports = Block;

/*
  it's conventional to check `DIFFICULTY` 0's at the beginning.
  but it's based on the randomness. So it can check for 'ab' at the begginning.
  or not even in the beginning, it can check for '00' or 'ab' in the middle or end

  demonstrate by chaning '0'.repeat to 'a'.repeat for example

  with more computing power, this will be found more and more quickly
  so we need some way to adjust the difficulty.

  Based on the difference of timestamps, adjust the difficulty. The faster
  blocks are discovered, the more difficult the proof of work should get.

  TODO: proof of computational work? is that why it's name proof of work?
*/