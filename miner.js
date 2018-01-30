// Every miner class will have a blockchain and a transactionPool

// It's primary job is to add blocks to the chain consisting of the transactions in the transaction pool

// then it empties the transactionPool

class Miner {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
  }

  mine() {
    /* TODO: should the mining part be extracted here? Through a spawned thread, so transactions can be added to the pool in the background?
      Or should it remain in the actual Block class? <-- this definitely simplifies things in terms of generating the correct hash.
    */

    this.blockchain.addBlock(this.transactionPool.transactions);
  }
}

module.exports = Miner;