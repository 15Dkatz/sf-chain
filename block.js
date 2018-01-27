// TODO: figure out how to support imports
const SHA256 = require('crypto-js/sha256');
const DIFFICULTY = 3;

class Block {
  constructor(index, timestamp, lastHash, hash, data, nonce) {
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
  }

  toString() {
    return `Block -
      Index     : ${this.index}
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Data      : ${this.data}`;
  }

  // Why static? Why not declare outside of the class?
  // Nice to be able to share functionality under the Block namespace.
  static genesis() {
    return new this(0, 'Genesis time', '-*-*-', 'first hash', 'genesis block', 0);
  }

  static mineBlock(lastBlock, data) {
    const timestamp = Date.now();
    const index = lastBlock.index+1;
    const lastHash = lastBlock.hash;

    let hash;
    let nonce = 0;

    do {
      // nonce - a way to control how quickly blocks are mined
      // nonce++ must be first, otherwise the hash will be different
      nonce++;
      hash = Block.hash(index, timestamp, lastHash, data, nonce);
    } while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

    return new this(index, timestamp, lastHash, hash, data, nonce);
  }

  static hash(index, timestamp, lastHash, data, nonce) {
    return SHA256(`${index}${timestamp}${lastHash}${data}${nonce}`).toString();
  }

  static blockHash(block) {
    const { index, timestamp, lastHash, data, nonce } = block;
    return Block.hash(index, timestamp, lastHash, data, nonce);
  }
}

module.exports = Block;