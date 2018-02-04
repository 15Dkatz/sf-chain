const Blockchain = require('../blockchain');
const Wallet = require('./index');
const TransactionPool = require('../app/transaction-pool');
const Miner = require('../app/miner');
const P2pServer = require('../app/p2p-chain-server');

const blockchain = new Blockchain();
const tp = new TransactionPool();
const wallet = new Wallet();
const p2p = new P2pServer();

const miner = new Miner(blockchain, tp, wallet, p2p);

console.log('wallet', wallet.toString());
wallet.createTransaction('r4nd0m-4ddr3ss', 50, blockchain, tp);
wallet.createTransaction('r4nd0m-4ddr3ss', 50, blockchain, tp);

const wallet2 = new Wallet();
wallet2.createTransaction(wallet.publicKey, 100, blockchain, tp);
wallet2.createTransaction(wallet.publicKey, 50, blockchain, tp);
wallet2.createTransaction(wallet.publicKey, 30, blockchain, tp);

// console.log('wallet', wallet.toString());

miner.mine();
console.log(blockchain.toString());

wallet.createTransaction('r4nd0m-4ddr3ss', 200, blockchain, tp);

console.log('wallet', wallet.toString());
