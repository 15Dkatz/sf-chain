// Every miner class will have a blockchain and a transactionPool
// It's primary job is to add blocks to the chain consisting of the transactions in the transaction pool
// then it empties the transactionPool
const Transaction = require('../wallet/transaction');

class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  // This really brings everything together
  // It connects the transactionPool, the blockchain, and soon the p2pServer
  mine() {
    /* TODO: should the mining part be extracted here? Through a spawned thread, so transactions can be added to the pool in the background?
      Or should it remain in the actual Block class? <-- this definitely simplifies things in terms of generating the correct hash.
    */

    const validTransactions = this.transactionPool.grabValidTransactions();
    validTransactions.unshift(Transaction.rewardTransaction(this.wallet));

    const block = this.blockchain.addBlock(validTransactions);
    this.p2pServer.syncChains();
    // once the block is added, clear the transactionPool, and broadcast a clear allowing everyone to reset.
    // After all, shouldn't everyone get an updated transaction pool list?
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}

module.exports = Miner;