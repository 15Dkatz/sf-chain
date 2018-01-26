/*
  This is the main application serving up the blockchain data
  Then multiple node websocket process will run in tabs and be automatically updated
   as the blockchain itself udpates.
*/

// Why are these all on different ports?
/*
HTTP_PORT=3001 P2P_PORT=5001 npm run dev
HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev
*/
// Then sync up the peers to the most valid chain

const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const P2PChainServer = require('./p2p-chain-server');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const bc = new Blockchain();
const app = express();
const p2pChainServer = new P2PChainServer(bc);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
  res.json(bc.chain);
});

// TODO: add a proof of work algorithm
app.post('/mine', (req, res) => {
  const newBlock = bc.newBlock(req.body.data);
  p2pChainServer.syncChains();

  // broadcast the new block to all peers
  // something like p2pChainServer.broadcast

  console.log(`New block added: ${newBlock.toString()}`);

  res.redirect('/blocks');
});

app.get('/peers', (req, res) => {
  // res.json({
  //   peers: p2pChainServer.sockets.map(socket => socket._socket.address())
  // });
  res.json({ peers: p2pChainServer.sockets.length });
});

// app.post('/addPeer');

app.listen(HTTP_PORT, () => console.log(`Listening on port: ${HTTP_PORT}`));
p2pChainServer.listen();

// module.exports = bc;