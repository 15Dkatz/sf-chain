// Before peer to peer functionality...
// Proof of work
// Develop the API

const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transactions: 'CLEAR_TRANSACTIONS'
};

class P2PChainServer {
  constructor(blockchain, transactionPool, wallet) {
    this.sockets = [];
    // TODO: can these values be included in the miner class?
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
  }

  listen() {
    const server = new Websocket.Server({ port: P2P_PORT });
    server.on('connection', socket => this.connectSocket(socket));
    this.connectToPeers();
    console.log(`Listening for peer to peer connections on: ${P2P_PORT}`);
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    this.messageHandler(socket);
    // TODO: necessary to include?
    // this.errorHandler(socket);
    // is there a socket sendJson method?
    this.sendChain(socket);
  }

  sendChain(socket) {
    /*
      how does the send() method actually work? https://github.com/websockets/ws/blob/master/doc/ws.md
      does it broadcat to all connected to sockets...? Or just one...?
      If so, why is there a constructed broadcast function in the README?
    */
    socket.send(JSON.stringify({ type: MESSAGE_TYPES.chain, chain: this.blockchain.chain }));
  }

  sendTransaction(socket, transaction) {
    socket.send(JSON.stringify({ type: MESSAGE_TYPES.transaction, transaction }));
  }

  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);
      // console.log('data', data);
      // console.log('data.type', data.type);

      switch(data.type) {
        case MESSAGE_TYPES.chain:
          // const receivedChain = JSON.parse(message);
          // attempt to replace the original chain with the received chain
          // the built-in functionality will actually replace the chain securely
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          console.log('New transaction', data.transaction);

          // Create a transaction with the wallet to actually update it
          // createTransaction(recipient, amount, blockchain, transactionPool) {
          // this.wallet.createTransaction(recipient, amount, this.blockchain, this.transactionPool);
          this.transactionPool.indexTransaction(data.transaction);

          break;
        case MESSAGE_TYPES.clear_transactions:
          this.transactionPool.clear();
          break;
      }
    });
  }

  // errorHandler(socket) {
  //   const closeConnection = (socket) => {
  //     console.log(`Connection failed to peer: ${socket.url}`);
  //     this.sockets.splice(this.sockets.indexOf(socket), 1);
  //   };

  //   socket.on('close', () => closeConnection(socket));
  //   socket.on('error', () => closeConnection(socket));
  // }

  connectToPeers() {
    peers.forEach(peer => {
      const socket = new Websocket(peer);

      socket.on('open', () => this.connectSocket(socket));
      socket.on('error', () => console.log('connection failed'));
    });
  }

  syncChains() {
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

  broadcastClearTransactions() {
    this.sockets.forEach(socket => socket.send(JSON.stringify({
      type: MESSAGE_TYPES.clear_transactions
    })));
  }
}

module.exports = P2PChainServer;
