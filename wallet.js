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

// in this implementation, give each wallet 500 coins to start with
// why not? Gets the economy going
// Use this implementation unless research discloses a more traditional starting mechanism

class Wallet {
  constructor() {
    this.keyPair = null;
    this.publicKey = null; // address
    this.balance = 500;

    this.generateKeys();
  }

  generateKeys() {
    const keyPair = EC.genKeyPair();
    this.keyPair = keyPair;
    // const privateKey = EC.genKeyPair().getPrivate();
    // why 16?
    // return privateKey.toString(16);
    const publicKey = EC.keyFromPrivate(keyPair.getPrivate(), 'hex');

    // this.privateKey = privateKey.toString(16);
    // TODO: verify/study these chained calls.
    this.publicKey = publicKey.getPublic().encode('hex');
  }


  sign(data) {
    // sign with the secret key
    // return this.keyPair.sign(this.toHexa(data));
    // const signature =  this.keyPair.sign(JSON.stringify(data));
    // console.log('signature: ', signature);
    // console.log('verify it: ', this.verify(JSON.stringify(data), ))

    // console.log('verify it:', EC.keyFromPublic(this.publicKey, 'hex').verify(JSON.stringify(data), signature));
    // console.log('verify it:', EC.keyFromPublic(this.publicKey, 'hex').verify(JSON.stringify(data), signature));
    return this.keyPair.sign(JSON.stringify(data));
  }

  // toHexa(data) {
  //   // const string = JSON.stringify(data);
  //   return JSON.stringify(data).split('').map(letter => Number(letter).toString(16)).join('')
  // }

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
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.addTransaction(transaction);
    }

    this.balance = this.calculateBalance(blockchain, transactionPool);

    return transaction;
  }

  /**
   * Get the total transaction attributed to this key.
   * It should be the amount of outputs attributed to this publicKey address
   */
  calculateBalance(blockchain) {
    // transactionPool may not be necessary
    // TODO: the balance is the total of all the transactions stored in the actual blockchain
    // look at the included transactions of each block in the chain and look at all the unspent outputs belonging to this address

    return this.balance;


    // // every block has a number of transactions.
    // // and count the amount stored in the blocks?

    // // does it also have to account for incoming inputs?
    // // also when is the balance actually updated?

    // // go through the pool as well.
    // return transactionPool.balanceByAddress(this.publicKey);
  }

  toString() {
    return `Wallet -
      publicKey : ${this.publicKey.toString().substring(0, 32)}
      balance   : ${this.balance.toString().substring(0, 32)}`
  }

  // TODO: use to verify transactions from other nodes
  static verify(publicKey, data, signature) {
    return EC.keyFromPublic(publicKey, 'hex').verify(JSON.stringify(data), signature);
  }
}

module.exports = Wallet;

// EC Docs:
// var EC = require('elliptic').ec;

// // Create and initialize EC context
// // (better do it once and reuse it)
// var ec = new EC('secp256k1');

// // Generate keys
// var key = ec.genKeyPair();

// // Sign the message's hash (input must be an array, or a hex-string)
// var msgHash = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
// var signature = key.sign(msgHash);

// // Export DER encoded signature in Array
// var derSign = signature.toDER();

// // Verify signature
// console.log(key.verify(msgHash, derSign));

// // CHECK WITH NO PRIVATE KEY

// var pubPoint = key.getPublic();
// var x = pubPoint.getX();
// var y = pubPoint.getY();

// // Public Key MUST be either:
// // 1) '04' + hex string of x + hex string of y; or
// // 2) object with two hex string properties (x and y); or
// // 3) object with two buffer properties (x and y)
// var pub = pubPoint.encode('hex');                                 // case 1
// var pub = { x: x.toString('hex'), y: y.toString('hex') };         // case 2
// var pub = { x: x.toBuffer(), y: y.toBuffer() };                   // case 3
// var pub = { x: x.toArrayLike(Buffer), y: y.toArrayLike(Buffer) }; // case 3

// // Import public key
// var key = ec.keyFromPublic(pub, 'hex');

// // Signature MUST be either:
// // 1) DER-encoded signature as hex-string; or
// // 2) DER-encoded signature as buffer; or
// // 3) object with two hex-string properties (r and s); or
// // 4) object with two buffer properties (r and s)

// var signature = '3046022100...'; // case 1
// var signature = new Buffer('...'); // case 2
// var signature = { r: 'b1fc...', s: '9c42...' }; // case 3

// // Verify signature
// console.log(key.verify(msgHash, signature));