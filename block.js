// TODO: figure out how to support imports
const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(timestamp, lastHash, hash, data) {
    // TODO: is the index part necessary?
    this.timestamp = timestamp;
    // the hash enforces the chain
    // each hash for each block is generated based off the lastHash.
    // So if you change one block, you must change all following blocks as well
    // A bad actor mess with one block individually, and pretend like everything will be fine
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  toString() {
    return `Block -
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Data      : ${this.data}`;
  }

  static genesis() {
    return new this(Date.now(), '-----', 'first hash', 'genesis block');
  }

  static newBlock(lastBlock, data) {
    const timestamp = Date.now();
    // TODO: does this SHA256 function need a toString() call?
    const nextHash = SHA256(`${timestamp}${lastBlock.hash}${data}`).toString();

    return new this(timestamp, lastBlock.hash, nextHash, data);
  }
}

module.exports = Block;