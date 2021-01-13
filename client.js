const tmi = require('tmi.js');
require('dotenv/config');
const MessageHandler = require('./messageHandler.js');

class Connection {
    constructor(){
        this.client = new tmi.Client({
            options: { debug: true },
            connection: {
                secure: true,
                reconnect: true
            },
            identity: {
                username: process.env.NICK,
                password: process.env.IRC_TOKEN
            },
            channels: [ process.env.INITIAL_CHANNEL1, process.env.INITIAL_CHANNEL2 ]
        });
        this.client.connect();
        this.messageHandler = new MessageHandler(this.client);
        this.client.on('message', (channel, tags, message, self) => {
            if(self) return;
            this.messageHandler.Handle(message, channel, tags);
        });
    }
}

module.exports = Connection;