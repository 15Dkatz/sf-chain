// Object-Oriented
// TODO: what about a sender, and recipient class for that matter?

// TODO: get a better grasp of the proof and previousHash

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


class Blockchain {
  constructor() {
    this.chain = [];
    // create the first block
    // first hash is 1, first proof is 100
    this.newBlock('1', 100);
  }

  newBlock(previousHash, proof) {
    console.log('Create a new block and add it to the chain');

    const block = new Block(this.chain, proof, previousHash);

    // Reset the current list of transactions
    // this.currentTransactions = [];
    this.chain.push(block);

    return block;
  }

  // TODO: test
  lastBlock() {
    console.log('Return the last Block in the chain')
    // This should return the last block in the chain
    return this.chain[this.chain.length-1];
  }

  // print the length of the chain, and call to String on every block in the chain
  toString() {
    let string = `Length of chain: ${this.chain.length}\n`;
    this.chain.forEach(block => {
      string += `${block.toString()}\n`;
    });
    return string;
  }

  static hash(block) {
    console.log(`Hash this ${block}`)
  }
}

// TODO: what is a useful way to test this. API?
// Testing:
let bc = new Blockchain();
bc.lastBlock().newTransaction('foo', 'bar', 5);
setTimeout(() => {
  bc.newBlock();
  console.log(bc.toString());
}, 2000);


// TODO create functions to print what's going in the blockchain - printTransactions, printBlocks, etc.

