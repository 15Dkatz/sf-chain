// HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev

// the same code serves two purposes - one starts the original server
// it also has code that allows it to connect to a websocket server if peers are designated for it

// you want every connected socket server to have the full array of sockets.
// That way, they all have the capability to send messages to the full list of connections.

const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transactions: 'CLEAR_TRANSACTIONS'
};

class P2pServer {
  constructor(blockchain, transactionPool, wallet) {
    this.sockets = [];
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
  }

  listen() {
    const server = new Websocket.Server({ port: P2P_PORT });
    // ** when other sockets connect to this P2P_PORT, this event listener will fire
    // this creates a socket object representing the new socket connection that the original socket will push to its array of sockets.

    server.on('connection', socket => this.connectSocket(socket));
    this.connectToPeers();
    console.log(`Listening for peer to peer connections on: ${P2P_PORT}`);
  }

  connectToPeers() {
    // peers are declared when the server is started through an environment variable.
    peers.forEach(peer => {
      const socket = new Websocket(peer);
      socket.on('open', () => this.connectSocket(socket));
      // socket.on('error', () => console.log('connection failed'));
    });
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    this.messageHandler(socket);
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
          this.transactionPool.updateOrAddTransaction(data.transaction);
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

module.exports = P2pServer;
