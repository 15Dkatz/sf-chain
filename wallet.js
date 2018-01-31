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

const CryptoJS = require('crypto-js');
const CryptoUtil = require('./crypto-util');
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('./config');

class Wallet {
  constructor() {
    this.keyPair = null;
    this.publicKey = null; // address
    this.balance = INITIAL_BALANCE;

    this.generateKeys();
  }

  generateKeys() {
    const keyPair = CryptoUtil.genKeyPair();
    this.keyPair = keyPair;

    this.publicKey = keyPair.getPublic().encode('hex');
  }

  sign(messageHash) {
    return this.keyPair.sign(messageHash);
  }

  /**
   * Add to the pool of unconfirmed transactions to be later verified in mining
   */
  createTransaction(recipient, amount, blockchain, transactionPool) {
    this.balance = this.calculateBalance(blockchain, transactionPool);

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
      transactionPool.addTransaction(transaction);
    }

    // Why is this here? TODO: check if necessary
    // this.balance = this.calculateBalance(blockchain, transactionPool);

    return transaction;
  }

  /**
   * Get the total transaction attributed to this key.
   * It should be the amount of outputs attributed to this publicKey address in the given chain
   */
  calculateBalance(blockchain) {
    // filter down to the outputs contained in the chain
    let outputs = [];
    blockchain.chain.forEach(block => block.data.forEach(transaction => {
      outputs = [...outputs, ...transaction.outputs];
    }));

    let balance = outputs.length > 0 ? outputs.reduce((total, output) => {
      if (output.address === this.publicKey) {
        return total + output.amount;
      } else {
        return total + 0;
      }
    }, 0) : this.balance;

    return balance;
  }

  toString() {
    return `Wallet -
      publicKey : ${this.publicKey.toString().substring(0, 32)}
      balance   : ${this.balance.toString().substring(0, 32)}`
  }
}

module.exports = Wallet;
