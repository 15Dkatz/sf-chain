const Blockchain = require('./blockchain');
const Wallet = require('./wallet');
const TransactionPool = require('./transaction-pool');
const Miner = require('./miner');
const P2pChainServer = require('./p2p-chain-server');

const blockchain = new Blockchain();
const tp = new TransactionPool();
const wallet = new Wallet();
const p2p = new P2pChainServer();

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
/*
POSTMAN TEST
First run one node
$ HTTP_PORT=3001 P2P_PORT=5001 npm run dev
Run a second node
$ HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
$ curl http://localhost:3002/public-key
grab value from ^^
$ x2-3 curl -d '{"address":"0429d6c26410c83f725609426ed63b0b6f8cdfe2a7414deab02bfefa53fa2b30d458bd6901fee6272ff373f1adec6f4f28e57b25c0f1487d39890ab073f80bf5e8", "amount":"50"}' -H "Content-Type: application/json" -X POST http://localhost:3001/transact
// TODO: Why does mine-transactions show an invalid value?
$ curl http://localhost:3001/transactions
$ curl http://localhost:3002/transactions
$ curl http://localhost:3001/mine-transactions
$ curl http://localhost:3001/balance
$ curl http://localhost:3002/blocks
$ curl http://localhost:3001/transactions
$ curl http://localhost:3002/transactions
*/