const tmi = require("tmi.js");
require("dotenv/config");
const MessageHandler = require("./messageHandler.js");
const messageHandlerSocket = require("./MessageHandlerSocket");
const { listenerCount } = require("./Models/ArrayGroup.js");
class Connection {
  constructor(io) {
    this.io = io;
    this.client = new tmi.Client({
      options: { debug: true },
      connection: {
        secure: true,
        reconnect: true,
      },
      identity: {
        username: process.env.NICK,
        password: process.env.IRC_TOKEN,
      },
      channels: [process.env.INITIAL_CHANNEL1, process.env.INITIAL_CHANNEL2],
    });
    this.client.connect();
    this.messageHandler = new MessageHandler(this.client, this.io);
    this.MessageHandlerSocket = new messageHandlerSocket(this.client, this.io);
    this.client.on("message", (channel, tags, message, self) => {
      if (self) return;
      this.messageHandler.Handle(message, channel, tags);
    });
  }
  async ListenHandleIo(msg) {
    this.MessageHandlerSocket.HandleDataBase(msg);
  }
  async discordHandle(msg) {
    this.messageHandler.Handle(msg.content, msg.channel.name, "discord");
  }
}

module.exports = Connection;
