const { response } = require("express");
const { get } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv/config");
const fetch = require("node-fetch");
let urlAPI = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=";

// Modelos
const ArrayGroup = require("../Models/ArrayGroup");
const ClientUser = require("../Models/ClientUser");
const Token = require("../Models/Token");
const QueueVideo = require("../Models/QueueVideo");

class SocketSectionReaccion {
  constructor(client, io) {
    this.io = io;
    this.client = client;
    this.usersOrder = [];
    this.isOpen = true;
  }

  async HandleDataBase(msg) {
    // Refresh Queue
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

    // Delete URL
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

    // Get Title
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
  }
}

module.exports = SocketSectionReaccion;
