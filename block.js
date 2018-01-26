// TODO: get a better grasp of the proof and previousHash

// TODO: place the block class into its own file
// TODO docs on the class, etc.
// timestamp: the number of milliseconds since 1 January, 1970, 00:00:00
class Block {
  // TODO: is there a good way to do the proof and previousHash?
  constructor(/*proof, previousHash*/) {
    // TODO: is the index part necessary
    // this.index = length(chain) + 1;
    this.timestamp = Date.now();
    this.currentTransactions = [];
    // TODO: does this belong here?
    /*
    this.proof = proof;
    this.previousHash = previousHash;
    */
  }


  /* TODO js-strings
  sender - string address of the sender
  recipient - string address of the recipient
  amount - amount to send from the sender to recipient in the transaction
  return - the index of the block that holds this transaction?
  TODO: does this have to return anything?
  */
  newTransaction(sender, recipient, amount) {
    console.log('Add a new transaction to the list of transactions');
    // notice es6 destructuring syntax
    this.currentTransactions.push({ sender, recipient, amount });
    // return this.lastBlock('index') + 1;
  }

  toString() {
    // TODO: better name than string
    let string = `Block. Timestamp: ${this.timestamp}`;

    // TODO: print current_transactions.
    return string;
  }
}

module.exports = Block;