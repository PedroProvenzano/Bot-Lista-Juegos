const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
//require('./connection');
const tmi = require('tmi.js');
require('dotenv/config');
const connectionMong = require('./connection');
const Client = require('./client.js');
const connection = new Client(io);

connectionMong();



// Middleware
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});