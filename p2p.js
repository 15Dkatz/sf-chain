// TODO: read websocket docs for best practices cleanup

// The peer to peer functionality must be developed after the api

const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;

const sockets = [];
const server = new Websocket.Server({ port: P2P_PORT });

const messageHandler = (socket) => {
  socket.on('message', data => {
    const message = JSON.parse(data);

    console.log(`Received socket message: ${message}.`);
  });
}

// TODO: necessary to include?
const errorHandler = (socket) => {
  const closeConnection = (socket) => {
    console.log(`Connection failed to peer: ${socket.url}`);
    sockets.splice(sockets.indexOf(socket), 1);
  };

  socket.on('close', () => closeConnection(socket));
  socket.on('error', () => closeConnection(socket));
}

server.on('connection', socket => {
  sockets.push(socket);

  messageHandler(socket);
  // TODO: necessary to include?
  errorHandler(socket);

  console.log(`Listening for peer to peer connections on: ${P2P_PORT}`);
});