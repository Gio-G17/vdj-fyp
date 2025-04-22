const { ExpressPeerServer } = require('peer');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/',
});

app.use('/peerjs', peerServer);

server.listen(9000, '0.0.0.0', () => {
  console.log('🎥 PeerJS server running on http://192.168.1.17:9000/peerjs');
});
