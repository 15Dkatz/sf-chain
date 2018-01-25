// a block object:

// Object-Oriented
// TODO: does it make sense to have a Block, and Transaction class too?
// TODO: what about a sender, and recipient class for that matter?
/*

block = {
  index: 1,
  timestamp: 159546205.9994
  transactions: [
    {
      sender: '1321239490as0148a',
      recipient: '12084h408hjkkk',
      amount: 5
    }
  ],
  proof: 234823805005000,
  previous_hash: '2391201480124801240'
}


*/

class Blockchain {
  constructor() {
    this.chain = [];
    this.currentTransactions = []
  }

  newBlock() {
    console.log('Create a new block and add it to the chain');
  }

  newTransaction() {
    console.log('Adda new transaction to the list of transactions');
  }

  lastBlock() {
    console.log('Return the last Block in the chain')
  }

  static hash(block) {
    console.log(`Hash this ${block}`)
  }
}

// TODO: what is a useful way to test this. Start the API? <-- yeah probably
// TODO: Make a React frontend - BUILD A BLOCKCHAIN WITH NODE AND REACT
// Testing:
bc = new Blockchain();
bc.newBlock();
bc.newTransaction();
bc.lastBlock();
Blockchain.hash({example: 'hi'});