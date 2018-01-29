// store the unconfirmed transactions

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  addTransaction(transaction) {
    console.log('add transaction', transaction);

    this.transactions.push(transaction);
  }

  balanceByAddress(address) {
    // return this.transactions.reduce((total, transaction) => total + transaction.balanceByAddress(address));
    return this.transactions.reduce((total, transaction) => total + transaction.balanceByAddress(address), 0);
  }
}

module.exports = TransactionPool;
/*
Transactions not included in the blockchain yet are "unconfirmed transactions."

Typically, when someone wants to include a transaction to the blockchain, s/he broadcasts the transaction
to the network and hopefully some node will mine the transaction the blockchain.

This means you don't need to mine a block yourself to incldue a transaction to the blockchain.

Now, nodes on the network will share two types of data:
1) the state of the blockchain
2) unconfirmed transactions

The transaction pool is a structure that contains all the "unconfirmed transactions."

Now add transactions to local transaction pools.

These unconfirmed transacations will be spread throughout the network and eventually *some node will mine
the transaction to the blockchain.
  - When a ndoe recived an unconfirmed transaction it has not seen before,
    it will broadcast its full transaction pool to all peers.
  - When a node first connects to another node, it will uery the transaction pool of that node.

Validating received unconfirmed transactions:

As the peers can send any kind of transaction, there must be validation before they're added to the transaction pools.
There is an additional rule, beyond correct format, inputs, outputs and signatures:
  - a transaction cannot be added to the pool if any of the transaction inputs are already found in the existing transaction pool.
    - what does this enforce...? One transaction per address per block...? Does it prevent some kind of bad behavior?

Now add the transactions to the block. When a node starts to mine a block, it will include the transactions from the
transaction pool to the new block candidate. The transactions are already validates, so no further validation is needed.

As new blocks with transactions are mined to the blockchain, the transaction pool must be revalidated.

Still, there needs to be an incentive for nudes to include a received transaction to the block. This will be a transaction fee.

Create a pool of pending transactions shared amongst nodes.
When a block is mined, that node uses its validated list of pending transactions and includes it in the block.
*/