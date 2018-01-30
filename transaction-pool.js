// store the unconfirmed transactions

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  // TODO: there needs to be some form of validation as transactions are added to the pool from other nodes
  addTransaction(transaction) {
    console.log('add transaction', transaction);

    this.transactions.push(transaction);
  }

  // check if a transaction has already been performed by this address
  existingTransaction(address) {
    return this.transactions.find(transaction => transaction.input = address);
  }



  // TODO: remove
//   balanceByAddress(address) {
//     // in this case, I don't mind the extra variable allocation, since there's quite a bit of logic floating around.

//     // the balance is the **last transaction output matching the address
//     // use the spread operator so that the original array isn't modified, but rather a copy is modified.
//     const recentSendingTransaction = [...this.transactions].reverse().find(transaction => transaction.inputs[0].address === address);
//     const afterSendAmount = recentSendingTransaction.outputs.find(output => output.address === address).amount;

//     // calculate any outputs also being paid to this wallet
//     // so any transaction whose input does not match this wallet, but that has an output *sending to this wallet

//     // console.log('address', address);

//     // TODO: resolve. This is inaccurate. The addition gets counted twice with multiple transactions. Check wallet-test.
//     // Possibly: look at bitcoin.pdf for "double spending solution"
//     let receivedAmount = 0;
//     const receivingTransactions = this.transactions.filter(transaction => transaction.inputs[0].address !== address);
//     const receivingOutputs = receivingTransactions.map(transaction => transaction.outputs);
//     receivingOutputs.forEach(output => {
//       output.forEach(amountAddressPair => {
//         if (amountAddressPair.address === address) {
//           receivedAmount += amountAddressPair.amount;
//         }
//       })
//     });

//     return afterSendAmount + receivedAmount;
//   }
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