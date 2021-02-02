const { response } = require("express");
const { get } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv/config");
const fetch = require("node-fetch");
let urlAPI = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=";
const ArrayGroup = require("./Models/ArrayGroup");
const ClientUser = require("./Models/ClientUser");
const Token = require("./Models/Token");
const QueueVideo = require("./Models/QueueVideo");

// Rutas
const socketSectionReaccion = require("./VideoReaccionHandle/SocketSection");
const socketSectionLista = require("./ListaHandle/SocketSection");
const socketSectionGeneral = require("./GeneralHandle/SocketSection");

class MessageHandlerSocket {
  constructor(client, io) {
    this.io = io;
    this.client = client;
    this.usersOrder = [];
    this.isOpen = true;
    this.SocketSectionGeneral = new socketSectionGeneral(this.client, this.io);
    this.SocketSectionReaccion = new socketSectionReaccion(
      this.client,
      this.io
    );
    this.SocketSectionLista = new socketSectionLista(this.client, this.io);
  }

  async HandleDataBase(msg) {
    switch (msg.secc) {
      // Seccion Lista
      case "lista":
        this.SocketSectionLista.HandleDataBase(msg);
        break;
      // Seccion General
      case "general":
        this.SocketSectionGeneral.HandleDataBase(msg);
        break;
      // Seccion Video
      case "reaccion":
        this.SocketSectionReaccion.HandleDataBase(msg);
        break;
      default:
        console.log("ignored socket secction " + msg.secc);
        break;
    }
  }
}

module.exports = MessageHandlerSocket;
