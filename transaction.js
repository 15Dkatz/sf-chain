const CryptoUtil = require('./crypto-util');
const { MINER_REWARD } = require('./config');

class Transaction {
  constructor() {
    this.index = CryptoUtil.timeId();
    this.input = null;
    this.outputs = [];
    // this.type [regular|fee|reward]
  }

  balanceByAddress(address) {
    return this.outputs.reduce((total, output) => {
      // TODO: a way to condense this?
      if (output.address === address) {
        return total + output.amount;
      } else { return total + 0 }
    }, 0);
  }

  // unique to this implementation...
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
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(CryptoUtil.hash(transaction.outputs))
    };
  }

  static verifyTransaction(transaction) {
    const verified = CryptoUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      CryptoUtil.hash(transaction.outputs)
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
      amount: MINER_REWARD, address: minerWallet.publicKey
    }]);
  }
}

module.exports = Transaction;

/*
  // TODO: make a presentation video out of this.
  The idea is to create a list of pending transactions.

  Then once a block is mined, store those transactions in the block, and add it to the chain.

  The first new pending transaction after a mined block is the reward for the miner.

  There should also be a secret key and public key for signatures.

  The public key is the address where you receive coins.
  The public key can be derived from the secret key, but the secret key cannot be derived from the public key.

  Any messages can be signed using the private key to create a *signature

  A digital signature is a technique to bind a person/entity to data.
  This binding can be independently verified by the receiver as well as any third party.
  https://www.tutorialspoint.com/cryptography/cryptography_digital_signatures.htm

  - Each person in the scheme has a public-private key pair.
  - The private key is the signature key, and the public key is the verification key.
  - The hash value of the data, and the private signature key are fed to a signature algorithm which produces
    the digital signature on the given hash. The signature is appended t the data, and then both are sent to the verifier.
  - Verifier feeds the digital signature and the verification key into the verification algorithm. The verifier
    also runs some hash function on received data to generate and confirm hash value.

  Extra details: signing a hash is more efficient than signing the entre data, since signing large data through modular exponentiation is computationally expensive.

  With this signature and the corresponding public key, anyone can verify that the signature is produced by the
  private key that matches the public key.

  What will be our signature algorithm? Can use a library called elliptic for the public-key cryptography
   - https://github.com/indutny/elliptic
   - https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm

  Elliptic Curve Digital Signature Algorithm.
    - the bit size of the public key is believed to be about twice the size of the security level, in bits.

    Transactions consist of two components: inputs and outputs
      - outputs specify where the coins are sent.
      - inputs give a proof that the sent coins are owned by the "sender". Inputs refer to an existing (unspent) output.

  Transaction outputs consist of an address and an amount of coins. The address is a public key.
  Transaction inputs provide the information "where" the coins are coming from.  It refers to an earlier output transaction, and contains the private signature for proof.
    - note that this signature is the signature created by the signature algorithm, and not the private key itself.

  Inputs unlock the coins. Outputs lock the coins to new addresses.

  Each transaction itself, which contains the transaction outputs and inputs, has an id of the hash of its contents.
  Note that teh signature is not included in this hash, as it will be later added to the transaction (for public verification).

  When signing the transaction inputs, only the transaction id will be signed. If any content in the transaction is modified, the transaction id must change, rendering the transaction and signature invalid.

  A transaction refers to unspent transactions. The concept of owning coins is a owning a list of unspent transaction outputs whose public keys match the private key that you own.
  ...
  What makes a valid transaction?
    - correct structure [not necessary to code perhaps]
    - valid transaction id
    - valid inputs - the referenced outputs must have not been spent.
    - valid output values. The sum of the values specified in the outputs must be equal to the sums of the values specified in the inputs [TODO].

  There is also the miner reward - which has no input, and only an output. It puts new coins into circulation, rewarding the miner.

  The basic idea is this: refer to unspent transaction outputs in transaction inputs, and use signatures to show the the unlocking part is valid.
  Then use outputs to "relock" them to the receiver address.

  In this model, creating transactions is still quite difficult - since the inputs and outputs of the transactions must be manually created.
  Plus they must be signed using the private keys. This can change with the introduction of wallets.
  Also, there is no transaction relaying yet: to include a transaction to the blockchain, you must mine it yourself.
  This can be fixed with the introduction of a transaction fee.

*/