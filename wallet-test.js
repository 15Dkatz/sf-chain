const Blockchain = require('./blockchain');
const Wallet = require('./wallet');
const TransactionPool = require('./transaction-pool');
const Miner = require('./miner');

const blockchain = new Blockchain();
const tp = new TransactionPool();
const wallet = new Wallet();

const miner = new Miner(blockchain, tp, wallet);

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

// wallet2.createTransaction(wallet.publicKey, 53, null, tp);

// wallet.createTransaction('r4nd0m-4ddr3ss', 200, null, tp);
// wallet.createTransaction('r4nd0m-4ddr3ss', 50, null, tp);

// console.log('tp.transactions', tp.transactions[0].outputs);

// console.log('wallet', wallet.toString());

// wallet.createTransaction('r4nd0m-4ddr3ss', 1000, null, tp);

// Test the transactionPool updates

/* First run one node
$ HTTP_PORT=3001 P2P_PORT=5001 npm run dev
Run a second node
$ HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
$ curl http://localhost:3002/public-key
grab value from ^^
$ curl -d '{"address":"04a284cc32a8264b3216db8daa85c78f84cdc6c92395c120f94749190728ce657a83de6b00798703e6f1b9c57cd7f804514f360148bf79f999ddd1856de75bd660", "amount":"50"}' -H "Content-Type: application/json" -X POST http://localhost:3001/transact
$ curl http://localhost:3001/transactions
$ curl http://localhost:3002/transactions
*/