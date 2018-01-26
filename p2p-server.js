// TODO: read websocket docs for best practices cleanup

// The peer to peer functionality must be developed after the api

const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2PServer {
  constructor() {
    this.sockets = [];
  }

  listen() {
    const server = new Websocket.Server({ port: P2P_PORT });
    server.on('connection', socket => this.connectSocket(socket));
    this.connectToPeers(peers);
    console.log(`Listening for peer to peer connections on: ${P2P_PORT}`);
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    this.messageHandler(socket);
    // TODO: necessary to include?
    this.errorHandler(socket);
  }

  // TODO: what will message handle exactly?
  messageHandler(socket) {
    socket.on('message', data => {
      const message = JSON.parse(data);

      console.log(`Received socket message: ${message}.`);
    });
  }

  errorHandler(socket) {
    const closeConnection = (socket) => {
      console.log(`Connection failed to peer: ${socket.url}`);
      this.sockets.splice(sockets.indexOf(socket), 1);
    };

    socket.on('close', () => closeConnection(socket));
    socket.on('error', () => closeConnection(socket));
  }

  connectToPeers(peers) {
    peers.forEach(peer => {
      const socket = new Websocket(peer);

      socket.on('open', () => this.connectSocket(socket));
      socket.on('error', () => console.log('connection failed'));
    });
  }

  // TODO: create a function that syncs up all the chains
}

module.exports = P2PServer;
// const sockets = [];

// const initP2PServer = () => {
//   const server = new Websocket.Server({ port: P2P_PORT });
//   server.on('connection', socket => connectSocket(socket));
//   console.log(`Listening for peer to peer connections on: ${P2P_PORT}`);
// }

// const connectSocket = (socket) => {
//   sockets.push(socket);
//   messageHandler(socket);
//   // TODO: necessary to include?
//   errorHandler(socket);
// }

// const messageHandler = (socket) => {
//   socket.on('message', data => {
//     const message = JSON.parse(data);

//     console.log(`Received socket message: ${message}.`);
//   });
// }

// // TODO: necessary to include?
// const errorHandler = (socket) => {
//   const closeConnection = (socket) => {
//     console.log(`Connection failed to peer: ${socket.url}`);
//     sockets.splice(sockets.indexOf(socket), 1);
//   };

//   socket.on('close', () => closeConnection(socket));
//   socket.on('error', () => closeConnection(socket));
// }

// const connectToPeers = (peers) => {
//   peers.forEach(peer => {
//     const socket = new Websocket(peer);

//     socket.on('open', () => initConnection(socket));
//     ws.on('error', () => console.log('connection failed'));
//   });
// }
