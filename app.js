const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const tmi = require('tmi.js');
require('dotenv/config');
const port = process.env.PORT;
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

  socket.on('listStatus', (msg) => {
    connection.ListenHandleIo(msg);
  });

  socket.on('restarUsuario', (msg) => {
    connection.ListenHandleIo(msg);
  });

  socket.on('newOrder', (msg) => {
    connection.ListenHandleIo(msg);
  });
});



http.listen(port, () => {
  console.log('listening on *:3000');
});