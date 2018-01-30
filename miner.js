// Every miner class will have a blockchain and a transactionPool
// It's primary job is to add blocks to the chain consisting of the transactions in the transaction pool
// then it empties the transactionPool
const Transaction = require('./transaction');

class Miner {
  constructor(blockchain, transactionPool, wallet) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
  }

  // This really brings everything together
  // It connects the transactionPool, the blockchain, and soon the p2pServer
  mine() {
    /* TODO: should the mining part be extracted here? Through a spawned thread, so transactions can be added to the pool in the background?
      Or should it remain in the actual Block class? <-- this definitely simplifies things in terms of generating the correct hash.
    */

    const validTransactions = this.transactionPool.grabValidTransactions();
    validTransactions.unshift(Transaction.rewardTransaction(this.wallet));

    this.blockchain.addBlock(validTransactions);
    // once the block is added, clear the transactionPool allowing everyone to reset

    // TODO: broadcast this clear to all the nodes
    // after all, shouldn't everyone get an updated transaction pool list?
    this.transactionPool.clear();
  }
}

module.exports = Miner;