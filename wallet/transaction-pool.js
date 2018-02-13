// store the unconfirmed transactions
const Transaction = require('../wallet/transaction');

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
  }

  updateOrAddTransaction(transaction) {
    // if a transaction at the transaction index exists, replace it. Otherwise, push it
    let transactionWithIndex = this.transactions.find(t => t.index === transaction.index);

    if (transactionWithIndex) {
      this.transactions[this.transactions.indexOf(transactionWithIndex)] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  // check if a transaction has already been performed by this address
  existingTransaction(address) {
    return this.transactions.find(transaction => transaction.input.address === address);
  }

  validTransactions() {
    // make sure the input amount of each transaction is equal to the output amounts
    const validTransactions = this.transactions.filter(transaction => {
      const outputTotal = transaction.outputs.reduce((total, output) => {
        return total + output.amount;
      }, 0);

      if (transaction.input.amount !== outputTotal) {
        console.log(`Invalid transaction from ${transaction.input.address}.`);
        return;
      }

      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.input.address}.`)
        return;
      };

      return transaction;
    });

    return validTransactions;
  }

  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool;
