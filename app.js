const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const tmi = require("tmi.js");
require("dotenv/config");
const port = process.env.PORT;
const connectionMong = require("./connection");
const Client = require("./client.js");
const connection = new Client(io);

const prefix = "-";

// Prueba de discord
const Discord = require("discord.js");
const clientDiscord = new Discord.Client();

clientDiscord.once("ready", () => {
  console.log("MrklusBot Discord Ready!");
});

connectionMong();

// Middleware
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("listStatus", (msg) => {
    connection.ListenHandleIo(msg);
  });

  socket.on("restarUsuario", (msg) => {
    connection.ListenHandleIo(msg);
  });

  socket.on("newOrder", (msg) => {
    connection.ListenHandleIo(msg);
  });
});

clientDiscord.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  console.log(message.author.username);
  console.log(message.channel.name);
  console.log(message.content);
  connection.discordHandle(message);
});

clientDiscord.login(process.env.APIKEYDISCORD);

http.listen(port, () => {
  console.log("listening on *:3000");
});
