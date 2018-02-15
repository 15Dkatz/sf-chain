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
    const validTransactions = this.transactionPool.validTransactions();
    // include a reward transaction for the miner
    validTransactions.push(Transaction.rewardTransaction(this.wallet));
    // create a block consisting of the valid transactions
    const block = this.blockchain.addBlock(validTransactions);
    // synchronize chains in the peer-to-peer server
    this.p2pServer.syncChains();
    // clear the transaction pool
    // broadcast to every miner to clear their transaction pools
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}

module.exports = Miner;