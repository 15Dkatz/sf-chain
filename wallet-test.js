const Wallet = require('./wallet');

const wallet = new Wallet();
console.log('wallet', wallet.toString());

wallet.createTransaction('r4nd0m-4ddr3ss', 500);