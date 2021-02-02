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
  /*
  async HandleDataBase(msg) {
    if (msg.type == "refreshReac") {
      const getQueue = await QueueVideo.findOne({
        listName: msg.channel,
      }).exec();
      let msgRefReac = {
        channel: msg.channel,
        queue: getQueue.queue,
      };
      this.io.emit("refreshQueueList", msgRefReac);
      return;
    }
    if (msg.type == "deleteUrl") {
      const getQueue = await QueueVideo.findOne({
        listName: msg.channel,
      }).exec();
      let newQueueDel = [];
      for (let i of getQueue.queue) {
        if (i.title != msg.title) {
          newQueueDel.push(i);
        }
      }

      QueueVideo.findOneAndUpdate(
        { listName: msg.channel },
        { queue: newQueueDel, listName: msg.channel, isOpen: msg.isOpenQueue },
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            let msgDel = {
              channel: msg.channel,
              queue: newQueueDel,
              isOpenDel: msg.isOpenDel,
            };
            this.io.emit("deleted", msgDel);
            return;
          }
        }
      );
    }
    if (msg.type == "getTitle") {
      let newUrl;
      if (msg.url.includes("watch?v=")) {
        console.log("tenia watch");
        newUrl = msg.url.split("=");
        newUrl = newUrl[1].split("&");
        newUrl = newUrl[0];
      } else if (msg.url.includes("youtu.be")) {
        console.log("tenia youtu.be");
        if (msg.url.length == 28) {
          newUrl = msg.url.slice(17);
        } else if (msg.url.length == 20) {
          newUrl = msg.url.slice(9);
        }
      }
      console.log(newUrl);
      fetch(urlAPI + newUrl + "&key=" + process.env.APIKEY)
        .then((res) => res.json())
        .then(async (res) => {
          let newMsg = {
            channel: msg.channel,
            title: res.items[0].snippet.title,
            url: newUrl,
          };
          const getQueue = await QueueVideo.findOne({
            listName: msg.channel,
          }).exec();
          let newQueue = getQueue.queue;
          newQueue.push(newMsg);
          QueueVideo.findOneAndUpdate(
            { listName: msg.channel },
            { queue: newQueue, listName: msg.channel, isOpen: true },
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                let msgQ = {
                  channel: msg.channel,
                  queue: newQueue,
                };
                this.io.emit("newQueue", msgQ);
                return;
              }
            }
          );
          //this.io.emit('newQueue', newMsg);
        });
    }
    if (msg.type == "newToken") {
      // Token Checks
      const refreshToken = msg.token;
      if (refreshToken == null) {
        let response = {
          msg: `No token found`,
          sts: false,
          username: msg.username,
        };
        this.io.emit("newTokenResponse", response);
      }
      const token = await Token.findOne({ token: refreshToken }).exec();
      if (token == null) {
        let response = {
          msg: `No token found`,
          sts: false,
          username: msg.username,
        };
        this.io.emit("newTokenResponse", response);
      }
      jwt.verify(
        refreshToken,
        process.env.REFRESH_PASSWORD_JWT,
        (err, user) => {
          if (err) {
            let response = {
              msg: err,
              sts: false,
              username: msg.username,
            };
            this.io.emit("newTokenResponse", response);
          }
          let userForToken = {
            username: msg.username,
          };
          const accessToken = jwt.sign(
            userForToken,
            process.env.SECRET_PASSWORD_JWT,
            { expiresIn: "15s" }
          );
          console.log("Dando nueva token a usuario " + msg.username);
          let response = {
            msg: `Nueva token enviada`,
            sts: true,
            username: msg.username,
            token: accessToken,
            event: msg.event,
            userDel: msg.userDel,
            clientID: msg.clientID,
          };
          this.io.emit("newTokenResponse", response);
        }
      );
    }
    // Registrarse
    if (msg.type == "register") {
      // Buscar usuarios en la base de datos
      const userCheck = await ClientUser.find({
        username: msg.username,
      }).exec();
      console.log(`Usuario encontrado: ${userCheck}`);
      // PlaceHolder
      if (!userCheck[0]) {
        userCheck[0] = [{ username: "boop boop", password: "baap baap" }];
        console.log("User placeholder");
      }

      // Check si ya existe el usuario
      if (msg.username == userCheck[0].username) {
        // Respuesta
        let response = {
          msg: `Usuario ${msg.username} ya existe`,
          username: msg.username,
          sts: false,
          clientID: msg.clientID,
        };
        this.io.emit("registerResponse", response);
        console.log(`Enviado error de usuario ${msg.username} existente`);
        return;
      }
      // Encriptado
      const hashedPassword = await bcrypt.hash(msg.password, 10);
      const clienteUser = new ClientUser({
        username: msg.username,
        password: hashedPassword,
      });
      // Enviar
      clienteUser
        .save()
        .then((data) => {
          let response = {
            msg: `Usuario ${msg.username} creado correctamente`,
            username: msg.username,
            sts: true,
            clientID: msg.clientID,
          };
          console.log(
            "Enviando que usuario " + msg.username + " se creo correctamente"
          );
          this.io.emit("registerResponse", response);
        })
        .catch((err) => {
          let response = {
            msg: err,
            username: msg.username,
            sts: false,
            clientID: msg.clientID,
          };
          console.log("enviando error final");
          this.io.emit("registerResponse", response);
        });
    }
    // Login
    if (msg.type == "login") {
      const user = await ClientUser.findOne({ username: msg.username }).exec();
      if (!user) {
        let response = {
          msg: `Usuario ${msg.username} no existe`,
          username: msg.username,
          sts: false,
          clientID: msg.clientID,
        };
        this.io.emit("loginResponse", response);
        return;
      }
      if (await bcrypt.compare(msg.password, user.password)) {
        let userForToken = {
          username: user.username,
        };
        const accessToken = jwt.sign(
          userForToken,
          process.env.SECRET_PASSWORD_JWT,
          { expiresIn: "15s" }
        );
        const refreshedAccessToken = await jwt.sign(
          userForToken,
          process.env.REFRESH_PASSWORD_JWT
        );

        const tokenDB = await Token.findOne({
          token: refreshedAccessToken,
        }).exec();
        if (tokenDB == null) {
          let refreshedToken = new Token({
            token: refreshedAccessToken,
          });
          refreshedToken.save().catch((err) => console.log(err));
        } else {
          console.log("Ya existe esta refToken");
        }
        let response = {
          msg: `Login exitoso`,
          username: msg.username,
          accessToken: accessToken,
          refreshedToken: refreshedAccessToken,
          sts: true,
          clientID: msg.clientID,
        };
        this.io.emit("loginResponse", response);
      } else {
        let response = {
          msg: `Contraseña incorrecta`,
          username: msg.username,
          sts: false,
          clientID: msg.clientID,
        };
        this.io.emit("loginResponse", response);
      }
    }
    // Logout
    if (msg.type == "logout") {
      Token.deleteOne({ token: msg.authToken }, (err) => {
        console.log(err);
      });
      let response = {
        username: msg.username,
        sts: true,
        clientID: msg.clientID,
      };
      this.io.emit("logoutResponse", response);
    }
    const getList = await ArrayGroup.findOne({ listName: msg.channel }).exec();
    // Alertar Usuario
    if (msg.type == "alertarUsuario") {
      jwt.verify(msg.token, process.env.SECRET_PASSWORD_JWT, (err, user) => {
        if (err) {
          let response = {
            sts: false,
            msg: `err`,
            username: msg.channel,
            event: msg.event,
            userDel: msg.userDel,
            accessToken: msg.token,
          };
          this.io.emit("getNewToken", response);
          return;
        } else {
          this.client.say(
            msg.channel.slice(13),
            `${msg.userDel} te toca, manifiestate! OhMyDog `
          );
          return;
        }
      });
    }
    // Restar Usuario
    if (msg.type == "restarUsuario") {
      jwt.verify(msg.token, process.env.SECRET_PASSWORD_JWT, (err, user) => {
        if (err) {
          let response = {
            sts: false,
            msg: `err`,
            username: msg.channel,
            event: msg.event,
            userDel: msg.userDel,
            accessToken: msg.token,
          };
          this.io.emit("getNewToken", response);
          return;
        } else {
          let nuevaLista = [];
          for (let i of getList.userGroup) {
            if (i != msg.userDel) {
              nuevaLista.push(i);
            }
          }
          ArrayGroup.findOneAndUpdate(
            { listName: msg.channel },
            { userGroup: nuevaLista, listName: msg.channel },
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                console.log(`Usuario ${msg.userDel} eliminado`);
              }
            }
          ).then(async () => {
            let getListEmited = await ArrayGroup.findOne({
              listName: msg.channel,
            }).exec();
            this.io.emit("transmition", getListEmited);
            return;
          });
        }
      });
    }
    // Actualizar lista
    if (msg.type == "update") {
      let getListEmited = await ArrayGroup.findOne({
        listName: msg.channel,
      }).exec();
      this.io.emit("transmition", getListEmited);
      return;
    }
    // Estado de lista
    if (msg.type == "listStatus") {
      jwt.verify(msg.token, process.env.SECRET_PASSWORD_JWT, (err, user) => {
        if (err) {
          let response = {
            sts: false,
            msg: `err`,
            username: msg.channel,
            event: msg.event,
            usernameDel: 0,
            accessToken: msg.token,
          };
          this.io.emit("getNewToken", response);
          return;
        } else {
          ArrayGroup.findOneAndUpdate(
            { listName: msg.channel },
            {
              userGroup: getList.userGroup,
              listName: msg.channel,
              isOpen: msg.isOpen,
            },
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                if (msg.isOpen) {
                  this.client.say(msg.channel.slice(13), `Lista Abierta!`);
                  this.io.emit("listStatusServer", msg);
                  return;
                } else {
                  this.client.say(msg.channel.slice(13), `Lista Cerrada!`);
                  this.io.emit("listStatusServer", msg);
                  return;
                }
              }
            }
          );
        }
      });
    }
  }
*/
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
      console.log(getQueueEmited);
      if (getQueueEmited.isOpen) {
        if (channel == "《💬》-general") {
          console.log("enviando mensaje de discord");
          let mensajeDisc = message.slice(4);
          let msg = {
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
        console.log("pase por sumarse");
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
          url: link,
          channel: `ListaFortnite${streamer}`,
        };
        this.io.emit("newVideo", msg);
        console.log("emmited new video to client " + msg.channel);
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
