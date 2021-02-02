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

class SocketSectionLista {
  constructor(client, io) {
    this.io = io;
    this.client = client;
    this.usersOrder = [];
    this.isOpen = true;
  }

  async HandleDataBase(msg) {
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
}

module.exports = SocketSectionLista;
