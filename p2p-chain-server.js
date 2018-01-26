// TODO: read websocket docs for best practices cleanup
// The peer to peer functionality must be developed after the api

//!!! TODO: replace the "socket" terminology with ws to stay in accordance with https://github.com/websockets/ws

const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2PChainServer {
  constructor(blockchain) {
    this.sockets = [];
    this.blockchain = blockchain;
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
    this.errorHandler(socket);
    // is there a socket sendJson method?
    this.sendChain(socket);
  }

  sendChain(socket) {
    /*
      If there are more message types in the future, then use a redux-style action approach
      where the sent object has a type field, like:
      {
        type: chain,
        data: this.blockchain.chain
      }
    */
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  messageHandler(socket) {
    socket.on('message', message => {

      const receivedChain = JSON.parse(message);
      // attempt to replace the original chain with the received chain
      // the built-in functionality will actually replace the chain securely
      this.blockchain.replaceChain(receivedChain);
    });
  }

  errorHandler(socket) {
    const closeConnection = (socket) => {
      console.log(`Connection failed to peer: ${socket.url}`);
      this.sockets.splice(this.sockets.indexOf(socket), 1);
    };

    socket.on('close', () => closeConnection(socket));
    socket.on('error', () => closeConnection(socket));
  }

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
}

module.exports = P2PChainServer;
