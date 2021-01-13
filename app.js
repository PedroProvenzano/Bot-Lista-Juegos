//require('./connection');
const tmi = require('tmi.js');
require('dotenv/config');
const connectionMong = require('./connection');
const Client = require('./client.js');
const connection = new Client();

connectionMong();