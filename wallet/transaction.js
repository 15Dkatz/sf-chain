const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

class Transaction {
  constructor() {
    this.index = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  // unique to this implementation:
  update(senderWallet, recipient, amount) {
    // update the sender's output amount based off the new receiving output
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds balance.`);
    }

    senderOutput.amount = senderOutput.amount - amount;

    this.outputs.push({ amount, address: recipient });

    // resign the updated transaction, will only work from the original sender
    Transaction.signTransaction(this, senderWallet);
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    };
  }

  static verifyTransaction(transaction) {
    const verified = ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    )

    return verified;
  }

  static newTransaction(senderWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);

    return transaction;
  }

  // sender is an entire wallet class
  // recipient is the public key of the recipient
  static normalTransaction(senderWallet, recipient, amount) {
    // subtract the balance from the sender
    const senderAmount = senderWallet.balance - amount;

    // TODO: add transaction fee
    return Transaction.newTransaction(senderWallet, [
      { amount: senderAmount, address: senderWallet.publicKey },
      { amount, address: recipient }
    ]);
  }

  static rewardTransaction(minerWallet) {
    return Transaction.newTransaction(minerWallet, [{
      amount: MINING_REWARD, address: minerWallet.publicKey
    }]);
  }
}

module.exports = Transaction;
