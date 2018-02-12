const Wallet = require('./index');
const Blockchain = require('../blockchain');
const Transaction = require('./transaction');
const TransactionPool = require('./transaction-pool');

describe('Wallet', () => {
  let wallet;
  let bc;
  let tp;

  beforeEach(() => {
    wallet = new Wallet();
    bc = new Blockchain();
    tp = new TransactionPool();
  });

  describe('creating a transaction', () => {
    let transaction;
    let sendAmount;
    let recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = 'r4nd0m-4ddr3s';
      transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
    });

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        const transaction2 = wallet.createTransaction(recipient, sendAmount, bc, tp);
      });

      it('doubles the `sendAmount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
          .toEqual(wallet.balance - sendAmount*2);
      });


      it('copies the `sendAmount` output for the recipient', () => {
        expect(
          transaction.outputs.filter(output => output.address === recipient)
          .map(output => output.amount)
        ).toEqual([sendAmount, sendAmount]);
      });
    });
  });

  it('calculates the balance for blockchain transactions matching this wallet', () => {
    const senderWallet = new Wallet();
    const addBalance = 100;
    const repeatAdd = 3;
    const blockData = [];

    for (let i=0; i<repeatAdd; i++) {
      blockData.push(Transaction.normalTransaction(senderWallet, wallet.publicKey, addBalance));
    }

    bc.addBlock(blockData);
    expect(wallet.calculateBalance(bc)).toEqual(addBalance * repeatAdd);
  });
});