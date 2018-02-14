/*
  WALLET: Wallets store the private key and public key address.

  PRIVATE KEY Store the key by writing it to a file? Or just save it in the class.
  Writing to a file seems good if you want the user to explicitly see the key. But it may be unnecessary. Also very unsafe.
  PUBLIC KEY: The public key can then be derived from the private key.
  BALANCE: When own coins, what you have is a list of unspent transactions. Get the sum of that amount.
  TRANSACTIONS: If A wants to send 40 of his/her 50 coins to B, then 40 is sent to A and 10 is sent to B.

  Two outputs are created for the receiver, and one for the leftover amount of the sender.
  The sender should only have to provide the address of the receiver, and the amount to send.

  Want to support the ability to send coins from one address the other

  Balances are recalculated at the start of every transaction.
  A balance can always be calculated with the calculateBalance functino.
 */
const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex'); // address
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  /**
   * Add to the pool of unconfirmed transactions to be later verified in mining
   */
  createTransaction(recipient, amount, blockchain, transactionPool) {
    this.balance = this.calculateBalance(blockchain);

    if (amount > this.balance) {
      console.log(`Amount: ${amount}, exceeds current balance: ${this.balance}`);
      return;
    }

    // if a transaction in the pool already has this input, then add this transaction to its outputs
    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.normalTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  /**
   * The balance is the sum total of output amounts matching their public key
   * !!!after!!! their most recent transaction amount (where they have an input)
   * If they don't have a recent transaction, add the sum total outputs to their current balance
   */
  calculateBalance(blockchain) {
    let balance = this.balance;

    let transactions = [];
    blockchain.chain.forEach(block => block.data.forEach(transaction => {
      transactions = [...transactions, transaction];
    }));

    const walletInputTs = transactions
      .filter(transaction => transaction.input.address === this.publicKey);

    // add all currency they have received after their recent transaction,
    // or the default 0
    let startTime = 0;
    // set the balance to the amount of the most recent sender's transaction
    if (walletInputTs.length > 0) {
      const recentInputT = walletInputTs.reduce(
        (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
      );
      startTime = recentInputT.input.timestamp;
      balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
    }

    transactions.forEach(transaction => {
      if (transaction.input.timestamp > startTime) {
        transaction.outputs.forEach(output => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });

    return balance;
  }

  toString() {
    return `Wallet -
      publicKey : ${this.publicKey.toString()}
      balance   : ${this.balance}`
  }
}

module.exports = Wallet;
