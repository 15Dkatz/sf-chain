const Wallet = require('./index');
const Blockchain = require('../blockchain');
const TransactionPool = require('./transaction-pool');
const { INITIAL_BALANCE } = require('../config');

describe('Wallet', () => {
  let wallet, bc, tp;

  beforeEach(() => {
    wallet = new Wallet();
    bc = new Blockchain();
    tp = new TransactionPool();
  });

  describe('creating a transaction', () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = 'r4nd0m-4ddr3s';
      transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
    });

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, bc, tp);
      });

      it('doubles the `sendAmount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
          .toEqual(wallet.balance - sendAmount*2);
      });

      it('clones the `sendAmount` output for the recipient', () => {
        expect(
          transaction.outputs.filter(output => output.address === recipient)
            .map(output => output.amount)
        ).toEqual([sendAmount, sendAmount]);
      });
    });
  });

  describe('calculating a balance', () => {
    let addBalance, repeatAdd, blockData, senderWallet;

    beforeEach(() => {
      senderWallet = new Wallet();
      addBalance = 100;
      repeatAdd = 3;

      for (let i=0; i<repeatAdd; i++) {
        senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
      }
      bc.addBlock(tp.transactions);
    });

    it('calculates the balance for blockchain transacitons matching the recipient', () => {
      expect(wallet.calculateBalance(bc))
        .toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
    });

    it('calculates the balance for blockchain transactions matching the sender', () => {
      expect(senderWallet.calculateBalance(bc))
        .toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
    });
  });
});