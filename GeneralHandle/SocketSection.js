const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv/config");

// Modelos
const ArrayGroup = require("../Models/ArrayGroup");
const ClientUser = require("../Models/ClientUser");
const Token = require("../Models/Token");
const QueueVideo = require("../Models/QueueVideo");

class SocketSectionGeneral {
  constructor(client, io) {
    this.io = io;
    this.client = client;
    this.usersOrder = [];
    this.isOpen = true;
  }

  async HandleDataBase(msg) {
    // New Token
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

    // Register
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
  }
}

module.exports = SocketSectionGeneral;
