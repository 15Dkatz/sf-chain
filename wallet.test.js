const Wallet = require('./wallet');
const Blockchain = require('./blockchain');
const Transaction = require('./transaction');

describe('Wallet', () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  it('calculates the correct balance', () => {
    const addBalance = 100;
    // const senderWallet = new Wallet();
    // const bc = new Blockchain();

    // bc.addBlock([Transaction.normalTransaction(senderWallet, wallet.publicKey, addBalance)]);

    // console.log('wallet balance', wallet.calculateBalance(bc));
  });
});