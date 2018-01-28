/*
  WALLET: Wallets store the private key and public key address.

  PRIVATE KEY Store the key by writing it to a file? Or just save it in the class.
  Writing to a file seems good if you want the user to explicitly see the key. But it may be unnecessary. Also very unsafe.

  PUBLIC KEY: The public key can then be derived from the private key.

  BALANCE: When own coins, what you have is a list of unspent transactions. Get the sum of that amount.
  TODO: consider the "unspent transaction" terminology. Possible design without it? Why not just amounts?

  TRANSACTIONS: If A wants to send 40 of his/her 50 coins to B, then 40 is sent to A and 10 is sent to B.
  ...

  Two transactions are created for the receiver, and one for the leftover amount of the sender.

  The sender should only have to provide the address of the receiver, and the amount to send.

  Still, nodes do not exchange information yet about transactions that are not included in the blockchain.
  The only way to include a desired transaction in the blockchain is to mine it yourself.

  Have a check balance function to show the balance after the transaction.

  Have a wallet, with the private key, public key, balance, and ?transactions?

  Want to support the ability to send coins from one address the other

 */

const CryptoJS = require('crypto-js');
const { ec } = require('elliptic');
const Transaction = require('./transaction');

// what does this do/mean?
const EC = new ec('secp256k1');

// balance starting at 50 for now, because why not?

class Wallet {
  constructor() {
    this.privateKey = null;
    this.publicKey = null; // address
    this.balance = 5000;

    this.generateKeys();
  }

  generateKeys() {
    const privateKey = EC.genKeyPair().getPrivate();
    // why 16?
    // return privateKey.toString(16);
    const publicKey = EC.keyFromPrivate(privateKey, 'hex');

    this.privateKey = privateKey.toString(16);
    // TODO: verify/study these chained calls.
    this.publicKey = publicKey.getPublic().encode('hex');
  }


  signature() {
    console.log('TODO: figure out how to generate the signature');
    return 999;
  }

  /**
   * Add to the pool of unconfirmed transactions to be later verified in mining
   */
  createTransaction(recipient, amount) {
    console.log(`Create transaction from ${this.publicKey} to ${recipient} of ${amount}`);

    // const transaction =
    Transaction.newTransaction(this, recipient, amount);
  }

  /**
   * Get the total transaction attributed to this key.
   * It should be the amount of outputs attributed to this publicKey address
   */
  // getBalance() {}
}

module.exports = Wallet;