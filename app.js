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
  console.log('a user connected', socket.id);

  socket.on('listStatus', (msg, socket) => {
    connection.ListenHandleIo(msg, socket);
  });

  socket.on('restarUsuario', (msg, socket) => {
    connection.ListenHandleIo(msg, socket);
  });
});



http.listen(port, () => {
  console.log('listening on *:3000');
});