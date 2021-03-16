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

class MessageHandler {
  constructor(client, io) {
    this.io = io;
    this.client = client;
    this.usersOrder = [];
    this.isOpen = true;
  }

  async Handle(message, channel, tags) {
    if (tags == "discord") {
      let getQueue = await QueueVideo.findOne({
        listName: `ListaFortniteperlitapink`,
      }).exec();
      if (getQueue == null) {
        const Queue = new QueueVideo({
          queue: [],
          listName: `ListaFortniteperlitapink`,
          isOpen: true,
        });
        Queue.save();
      }
      let getQueueEmited = await QueueVideo.findOne({
        listName: `ListaFortniteperlitapink`,
      }).exec();
      if (getQueueEmited.isOpen) {
        if (channel == "《💬》-general") {
          console.log("enviando mensaje de discord");
          let mensajeDisc = message.slice(4);
          let msg = {
            user: message.author.username,
            url: mensajeDisc,
            channel: `ListaFortniteperlitapink`,
          };
          this.io.emit("newVideo", msg);
          console.log("emmited new video to client " + msg.channel);
          return;
        }
      }
    }

    let streamer = channel.slice(1);
    let msg = message.toLowerCase();
    const getList = await ArrayGroup.findOne({
      listName: `ListaFortnite${streamer}`,
    }).exec();
    if (getList == null) {
      const list = new ArrayGroup({
        userGroup: [],
        listName: `ListaFortnite${streamer}`,
        isOpen: true,
      });
      list.save();
    }
    let getListEmited = await ArrayGroup.findOne({
      listName: `ListaFortnite${streamer}`,
    }).exec();
    this.io.emit("transmition", getListEmited);
    if (msg[0] == "-") {
      if (tags.username == streamer || tags.mod || tags.username == "mrklus") {
        if (msg.includes("-refresh")) {
          let getListEmited = await ArrayGroup.findOne({
            listName: `ListaFortnite${streamer}`,
          }).exec();
          this.io.emit("transmition", getListEmited);
          return;
        } else if (msg.includes("-info")) {
          // Funciona
          this.client.say(
            channel,
            `Querés sumarte a las partidas? agregate a la lista escribiendo -sumarse en el chat, para consultar el orden actual de la lista poné -lista`
          );
          return;
        } else if (msg.includes("-cerrar")) {
          // Funciona
          ArrayGroup.findOneAndUpdate(
            { listName: `ListaFortnite${streamer}` },
            {
              userGroup: getList.userGroup,
              listName: `ListaFortnite${streamer}`,
              isOpen: false,
            },
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                this.client.say(channel, `Lista cerrada!`);
                let msg = {
                  channel: `ListaFortnite${streamer}`,
                  isOpen: false,
                };
                this.io.emit("listStatusServer", msg);
                return;
              }
            }
          );
        } else if (msg.includes("-abrir")) {
          // Funciona
          ArrayGroup.findOneAndUpdate(
            { listName: `ListaFortnite${streamer}` },
            {
              userGroup: getList.userGroup,
              listName: `ListaFortnite${streamer}`,
              isOpen: true,
            },
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                this.client.say(channel, `Lista abierta!`);
                let msg = {
                  channel: `ListaFortnite${streamer}`,
                  isOpen: true,
                };
                this.io.emit("listStatusServer", msg);
                return;
              }
            }
          );
        } else if (msg.includes("-clear")) {
          // Funciona
          ArrayGroup.findOneAndUpdate(
            { listName: `ListaFortnite${streamer}` },
            { userGroup: [], listName: `ListaFortnite${streamer}` },
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                this.client.say(channel, `Lista limpia`);
                return;
              }
            }
          ).then(async () => {
            let getListEmited = await ArrayGroup.findOne({
              listName: `ListaFortnite${streamer}`,
            }).exec();
            this.io.emit("transmition", getListEmited);
            return;
          });
        } else if (msg.includes("-agregar")) {
          // Resolver
          msg = msg.slice(9);
          if (msg != "") {
            this.usersOrder.push(msg);

            this.client.say(channel, `Usuario ${msg} agregado correctamente`);
          } else {
            this.client.say(
              channel,
              `Epa, te falta poner un usuario para agregar :(`
            );
          }
        } else if (msg.includes("-siguiente")) {
          // Resolver
          if (getList.length == 0) {
            this.client.say(
              channel,
              `Todavía no hay jugadores anotados, podés agregar con el comando -agregar :)`
            );
            return;
          }
          msg = msg.slice(10);
          if (msg == "") {
            this.client.say(
              channel,
              `El próximo jugador es ${this.usersOrder[0]}, éxitos en la partida!`
            );
            this.usersOrder = this.usersOrder.slice(1);
            return;
          } else if (msg == "2") {
            this.client.say(
              channel,
              `Los próximos jugadores son ${this.usersOrder[0]} y ${this.usersOrder[1]}, éxitos en la partida!`
            );
            this.usersOrder = this.usersOrder.slice(2);
            return;
          } else if (msg == "3") {
            this.client.say(
              channel,
              `Los próximos jugadores son ${this.usersOrder[0]}, ${this.usersOrder[1]} y ${this.usersOrder[2]}, éxitos en la partida!`
            );
            this.usersOrder = this.usersOrder.slice(3);
            return;
          }
        }
      }
      if (msg.includes("-currentvideo")) {
        let listaCurrentVideo = await QueueVideo.findOne({
          listName: `ListaFortnite${streamer}`,
        }).exec();
        this.client.say(
          channel,
          `El video actual es, ${listaCurrentVideo.currentVideo}`
        );
        return;
      }
      if (msg.includes("-restarse")) {
        let estaEnLista = false;
        for (let i of getList.userGroup) {
          if (i == tags.username) {
            estaEnLista = true;
          }
        }
        if (estaEnLista) {
          let nuevaLista = [];
          for (let i of getList.userGroup) {
            if (i != tags.username) {
              nuevaLista.push(i);
            }
          }
          ArrayGroup.findOneAndUpdate(
            { listName: `ListaFortnite${streamer}` },
            { userGroup: nuevaLista, listName: `ListaFortnite${streamer}` },
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                this.client.say(
                  channel,
                  `Usuario ${tags.username} restado a la lista :(`
                );
              }
            }
          ).then(async () => {
            let getListEmited = await ArrayGroup.findOne({
              listName: `ListaFortnite${streamer}`,
            }).exec();
            this.io.emit("transmition", getListEmited);
            return;
          });
        } else {
          this.client.say(channel, `No estás en la lista`);
        }
      } else if (msg.includes("-sumarse")) {
        // Funciona
        if (getList.isOpen) {
          if (getList.userGroup.includes(tags.username)) {
            this.client.say(channel, `Ya estás en la lista`);
            return;
          } else {
            getList.userGroup.push(tags.username);
            ArrayGroup.findOneAndUpdate(
              { listName: `ListaFortnite${streamer}` },
              {
                userGroup: getList.userGroup,
                listName: `ListaFortnite${streamer}`,
              },
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  this.client.say(
                    channel,
                    `Usuario ${tags.username} agregado a la lista :)`
                  );
                }
              }
            ).then(async () => {
              let getListEmited = await ArrayGroup.findOne({
                listName: `ListaFortnite${streamer}`,
              }).exec();
              this.io.emit("transmition", getListEmited);
              return;
            });
          }
        } else {
          this.client.say(channel, `La lista está cerrada por hoy :(`);
          return;
        }
      } else if (msg.includes("-lista")) {
        // Funciona
        if (getList.userGroup.length == 0) {
          this.client.say(
            channel,
            `Todavía no hay jugadores anotados, podés sumarte con el comando -sumarse :)`
          );
          return;
        }
        let ListString = "";
        for (let i = 0; i < getList.userGroup.length; i++) {
          if (i != getList.userGroup.length - 1) {
            ListString += ` ${getList.userGroup[i]},`;
          } else {
            ListString += ` ${getList.userGroup[i]}.`;
          }
        }
        this.client.say(channel, `La lista de jugadores es:${ListString}`);
      } else if (msg.includes("-sr")) {
        let getQueue = await QueueVideo.findOne({
          listName: `ListaFortnite${streamer}`,
        }).exec();
        if (getQueue == null) {
          const Queue = new QueueVideo({
            queue: [],
            listName: `ListaFortnite${streamer}`,
            isOpen: true,
          });
          Queue.save();
          getQueue = await QueueVideo.findOne({
            listName: `ListaFortnite${streamer}`,
          }).exec();
        }
        let link = message.slice(4);

        let msg = {
          user: tags.username,
          url: link,
          channel: `ListaFortnite${streamer}`,
        };
        this.io.emit("newVideo", msg);
      }
    } else if (msg.includes("jugar?")) {
      this.client.say(
        channel,
        `Querés sumarte a las partidas? agregate a la lista escribiendo -sumarse en el chat, para consultar el orden actual de la lista poné -lista`
      );
      return;
    }
  }
}

module.exports = MessageHandler;
