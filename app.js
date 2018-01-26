const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();
const bc = new Blockchain();

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
  res.json(bc.chain);
});

// TODO: add a proof of work algorithm
app.post('/mine', (req, res) => {
  const newBlock = bc.newBlock(req.body.data);

  // broadcast the new block to all peers
  // something like p2p.broadcast

  console.log(`New block added: ${newBlock.toString()}`);

  res.redirect('/blocks');
});

// app.get('/peers');

// app.post('/addPeer');

app.listen(HTTP_PORT, () => console.log(`Listening on port: ${HTTP_PORT}`));