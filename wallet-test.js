const Wallet = require('./wallet');
const TransactionPool = require('./transaction-pool');

const tp = new TransactionPool();
const wallet = new Wallet();

console.log('wallet', wallet.toString());
wallet.createTransaction('r4nd0m-4ddr3ss', 50, null, tp);

console.log('wallet', wallet.toString());

// console.log('wallet', wallet.toString());

// wallet.createTransaction('r4nd0m-4ddr3ss', 1000, null, tp);