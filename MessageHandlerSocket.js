require("dotenv/config");

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
    console.log(msg);
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
