var socket = io();

// Genera ID unica
let arrayID = new Uint32Array(3);
let cryptedID = window.crypto.getRandomValues(arrayID);
let clientID = cryptedID.toString("hex");

// DOM
const ListaUsuarios = document.getElementById("listContainer");
const streamTitle = document.getElementById("streamTitle");
// Estilado
const table = document.getElementById("table");
const html = document.querySelector("html");

const colorLista = document.getElementById("colorLista");
const colorBorde = document.getElementById("colorBorde");
const colorFuente = document.getElementById("colorFuente");
const colorFondo = document.getElementById("colorFondo");
// Botones
const botonLista = document.getElementById("buttonList");
const botonVolver = document.getElementById("boton-volver");
const botonVolverVideo = document.getElementById("boton-volver-video");
// Escenas
const contenido = document.getElementById("contenido");
const intro = document.getElementById("intro");
const contenedorIntro = document.getElementById("contenedor-intro");
const lobby = document.getElementById("lobby");
const videoReaccion = document.getElementById("video-reaccion");
const botonContenedorListaJuegos = document.getElementById(
  "contenedor-lista-juego"
);
const botonVideoReacciones = document.getElementById(
  "contenedor-video-reaccion"
);
const contenedorVideoReacciones = document.getElementsByClassName(
  "contenedor-reproductor-lista"
);
const marcoListaReproduccion = document.getElementById(
  "marcoListaReproduccion"
);
// Dom Inputs
const colorListaIcono = document.getElementById("colorListaIcono");
const colorListaIconoDos = document.getElementById("colorListaIconoDos");
const colorFuenteIcono = document.getElementById("colorFuenteIcono");
const colorBordeIcono = document.getElementById("colorBordeIcono");
const colorFondoIcono = document.getElementById("colorFondoIcono");
const letraUno = document.getElementById("letra-uno-fuente");
const letraDos = document.getElementById("letra-dos-fuente");
// Fondos de lobby
const lobbyTitleFondo = document.getElementById("lobby-title-fondo");
const listaJuegoFondo = document.getElementById("lista-juego-fondo");
const videoReaccionFondo = document.getElementById("video-reaccion-fondo");
const lobbyTitle = document.getElementById("lobby-title");

const manitoUno = document.getElementById("manito-uno");
const manitoDos = document.getElementById("manito-dos");
let clicked = true;
let channel = "";
let username = "";
let accessToken = "";
let authAccessToken = "";
let isOpenQueue = true;

if (localStorage.LoggedUser) {
  let loadData = JSON.parse(localStorage.getItem("LoggedUser"));
  channel = loadData.channel;
  username = loadData.username;
  accessToken = loadData.accessToken;
  authAccessToken = loadData.authToken;
  intro.style.display = "none";
  lobby.style.display = "flex";
  lobby.style.opacity = "100%";
}

if (localStorage.channel) {
  channel = localStorage.getItem("channel");
  streamTitle.innerText = `Fila de ${channel.slice(13)}`;
}
if (localStorage.isOpen) {
  let isOpen = JSON.parse(localStorage.getItem("isOpen"));
  if (isOpen) {
    botonLista.innerText = "Lista Abierta";
    botonLista.style.backgroundColor = "#43ff19";
    clicked = true;
  } else {
    botonLista.innerText = "Lista Cerrada";
    botonLista.style.backgroundColor = "#ff1919";
    clicked = false;
  }
}
// Socket Events
socket.on("listStatusServer", (msg) => {
  if (msg.channel == channel) {
    if (msg.isOpen) {
      botonLista.innerText = "Lista Abierta";
      botonLista.style.backgroundColor = "#43ff19";
      clicked = true;
      let isOpen = JSON.stringify(true);
      localStorage.setItem("isOpen", isOpen);
    } else {
      botonLista.innerText = "Lista Cerrada";
      botonLista.style.backgroundColor = "#ff1919";
      clicked = false;
      let isOpen = JSON.stringify(false);
      localStorage.setItem("isOpen", isOpen);
    }
  }
});

socket.on("transmition", (msg) => {
  if (msg.listName == channel) {
    ListaUsuarios.innerHTML = "";
    for (let i of msg.userGroup) {
      let contDiv = document.createElement("div");
      contDiv.setAttribute("class", "contUser");
      // Contenedor botones
      let buttonContainer = document.createElement("div");
      buttonContainer.setAttribute("class", "contenedor-botones-user");
      // User Container
      let div = document.createElement("div");
      div.setAttribute("class", "user");
      div.innerHTML = `${i}`;
      let usernameDel = `${i}`;
      let botonSacar = document.createElement("img");
      botonSacar.setAttribute("src", "./assets/equis.png");
      botonSacar.setAttribute("class", "botonX");
      botonSacar.addEventListener("click", () => {
        let msg = {
          secc: "lista",
          type: "restarUsuario",
          userDel: usernameDel,
          channel: channel,
          token: accessToken,
          event: "removeUser",
        };
        socket.emit("restarUsuario", msg);
      });
      buttonContainer.appendChild(botonSacar);
      let imgAlert = document.createElement("img");
      imgAlert.setAttribute("src", "./assets/alert.png");
      imgAlert.setAttribute("class", "alertCont");
      imgAlert.setAttribute("id", "button-alert");
      imgAlert.addEventListener("click", () => {
        let msg = {
          secc: "lista",
          type: "alertarUsuario",
          userDel: usernameDel,
          channel: channel,
          token: accessToken,
          event: "alertUser",
        };
        socket.emit("restarUsuario", msg);
      });
      buttonContainer.appendChild(imgAlert);
      div.appendChild(buttonContainer);
      contDiv.appendChild(div);
      ListaUsuarios.appendChild(contDiv);
    }
  }
});

if (localStorage.saveFuente) {
  let load = localStorage.getItem("saveFuente");
  load = JSON.parse(load);
  letraUno.style.color = load.saveColor;
  letraDos.style.color = load.saveColor;
  table.style.color = load.saveColor;
  lobbyTitle.style.color = load.saveColor;
  manitoUno.style.color = load.saveColor;
  manitoDos.style.color = load.saveColor;
  botonContenedorListaJuegos.style.color = load.saveColor;
  botonVideoReacciones.style.color = load.saveColor;
  marcoListaReproduccion.style.color = load.saveColor;
}
if (localStorage.saveLista) {
  let load = localStorage.getItem("saveLista");
  load = JSON.parse(load);
  table.style.backgroundColor = load.saveBackGround;
  lobbyTitleFondo.style.backgroundColor = load.saveBackGround;
  listaJuegoFondo.style.backgroundColor = load.saveBackGround;
  videoReaccionFondo.style.backgroundColor = load.saveBackGround;
  colorListaIcono.style.backgroundColor = load.saveBackGround;
  marcoListaReproduccion.style.backgroundColor = load.saveBackGround;
}
if (localStorage.saveBorde) {
  let load = localStorage.getItem("saveBorde");
  load = JSON.parse(load);
  colorBordeIcono.style.borderColor = load.saveBorde;
  table.style.borderColor = load.saveBorde;
  botonLista.style.borderColor = load.saveBorde;
}
if (localStorage.saveFondo) {
  let load = localStorage.getItem("saveFondo");
  load = JSON.parse(load);
  colorFondoIcono.style.backgroundColor = load.saveFondo;
  html.style.backgroundColor = load.saveFondo;
  colorListaIconoDos.style.color = load.saveFondo;
}
// buttonColors.addEventListener("click", () => {
//   let perfilGuardado = {
//     saveBackGround: colorLista.value,
//     saveColor: colorFuente.value,
//     saveBorde: colorBorde.value,
//     saveFondo: colorFondo.value,
//   };
//   table.style.backgroundColor = colorLista.value;
//   table.style.color = colorFuente.value;
//   buttonColors.style.borderColor = colorBorde.value;

//   marcoListaReproduccion.style.backgroundColor = colorLista.value;
//   botonContenedorListaJuegos.style.color = colorFuente.value;
//   botonVideoReacciones.style.color = colorFuente.value;
//   marcoListaReproduccion.style.color = colorFuente.value;

//   table.style.borderColor = colorBorde.value;
//   html.style.backgroundColor = colorFondo.value;
//   let save = JSON.stringify(perfilGuardado);
//   localStorage.setItem("save", save);
// });

// Nuevo sistema de input
colorLista.addEventListener("change", () => {
  let perfilGuardado = {
    saveBackGround: colorLista.value,
  };
  lobbyTitleFondo.style.backgroundColor = colorLista.value;
  listaJuegoFondo.style.backgroundColor = colorLista.value;
  videoReaccionFondo.style.backgroundColor = colorLista.value;
  colorListaIcono.style.backgroundColor = colorLista.value;
  table.style.backgroundColor = colorLista.value;
  marcoListaReproduccion.style.backgroundColor = colorLista.value;
  let save = JSON.stringify(perfilGuardado);
  localStorage.setItem("saveLista", save);
});

colorFuente.addEventListener("change", () => {
  let perfilGuardado = {
    saveColor: colorFuente.value,
  };
  letraUno.style.color = colorFuente.value;
  letraDos.style.color = colorFuente.value;
  manitoUno.style.color = colorFuente.value;
  manitoDos.style.color = colorFuente.value;
  table.style.color = colorFuente.value;
  lobbyTitle.style.color = colorFuente.value;
  botonContenedorListaJuegos.style.color = colorFuente.value;
  botonVideoReacciones.style.color = colorFuente.value;
  marcoListaReproduccion.style.color = colorFuente.value;
  let save = JSON.stringify(perfilGuardado);
  localStorage.setItem("saveFuente", save);
});

colorBorde.addEventListener("change", () => {
  let perfilGuardado = {
    saveBorde: colorBorde.value,
  };
  colorBordeIcono.style.borderColor = colorBorde.value;
  table.style.borderColor = colorBorde.value;
  let save = JSON.stringify(perfilGuardado);
  localStorage.setItem("saveBorde", save);
});

colorFondo.addEventListener("change", () => {
  let perfilGuardado = {
    saveFondo: colorFondo.value,
  };
  colorFondoIcono.style.backgroundColor = colorFondo.value;
  colorListaIconoDos.style.color = colorFondo.value;
  html.style.backgroundColor = colorFondo.value;
  let save = JSON.stringify(perfilGuardado);
  localStorage.setItem("saveFondo", save);
});

botonLista.addEventListener("click", () => {
  if (clicked) {
    let message = {
      secc: "lista",
      type: "listStatus",
      channel: channel,
      isOpen: false,
      token: accessToken,
      event: "closingList",
    };
    socket.emit("listStatus", message);
  } else {
    let message = {
      secc: "lista",
      type: "listStatus",
      channel: channel,
      isOpen: true,
      token: accessToken,
      event: "openingList",
    };
    socket.emit("listStatus", message);
  }
});

// Consola
const consolaLogin = document.getElementById("console-login");
const consolaCrearCuenta = document.getElementById("console-crear-cuenta");

// Handle de login
const botonIntroSi = document.getElementById("boton-intro-si");
const botonIntroNo = document.getElementById("boton-intro-no");
// Escenas

// Crear cuenta
const crearCuenta = document.getElementById("crear-cuenta");
const contenedorCrearCuenta = document.getElementById(
  "contenedor-crear-cuenta"
);
const botonVolverCrearCuenta = document.getElementById(
  "boton-volver-crear-cuenta"
);
// Login
const login = document.getElementById("login");
const contenedorLogin = document.getElementById("contenedor-login");
const botonVolverLogin = document.getElementById("boton-volver-login");

// Botones Intro    Tenes cuenta?

// Si
botonIntroSi.addEventListener("click", () => {
  cambioEscena(intro, contenedorIntro, login, contenedorLogin);
});

// No
botonIntroNo.addEventListener("click", () => {
  cambioEscena(intro, contenedorIntro, crearCuenta, contenedorCrearCuenta);
});

// Botones crear cuenta
// Volver
botonVolverCrearCuenta.addEventListener("click", () => {
  cambioEscena(crearCuenta, contenedorCrearCuenta, intro, contenedorIntro);
});
botonVolverLogin.addEventListener("click", () => {
  cambioEscena(login, contenedorLogin, intro, contenedorIntro);
});

// Funcion desaparecer
function cambioEscena(actual, contenedorActual, objetivo, contenedorObj) {
  actual.style.opacity = "0%";
  setTimeout(() => {
    objetivo.style.display = "flex";
    actual.style.display = "none";
  }, 500);
  setTimeout(() => {
    objetivo.style.opacity = "100%";
  }, 600);
}

// Botones registro
const botonRegistroCrearCuenta = document.getElementById("boton-crear-cuenta");
const inputCrearCuentaUser = document.getElementById(
  "input-crear-cuenta-usuario"
);
const inputCrearCuentaPassword = document.getElementById(
  "input-crear-cuenta-password"
);

botonRegistroCrearCuenta.addEventListener("click", () => {
  let userName = inputCrearCuentaUser.value.toLowerCase();

  // Check que la pass sea de mas de 6 caracteres
  let passWord = inputCrearCuentaPassword.value;
  if (passWord.length < 6) {
    consolaCrearCuenta.innerText = "Contraseña muy corta";
    inputCrearCuentaPassword.value = "";
    return;
  }
  username = userName;
  let msg = {
    secc: "general",
    type: "register",
    username: userName,
    password: passWord,
    clientID: clientID,
  };
  consolaCrearCuenta.innerText = `Creando cuenta...`;
  socket.emit("listStatus", msg);
});

// Socket register
socket.on("registerResponse", (response) => {
  if (response.clientID == clientID) {
    // Check respuesta del servidor
    if (response.sts) {
      cambioEscena(crearCuenta, contenedorCrearCuenta, login, contenedorLogin);
      inputCrearCuentaPassword.value = "";
      inputCrearCuentaUser.value = "";
      consolaLogin.innerText = response.msg;
    } else {
      consolaCrearCuenta.innerText = response.msg;
    }
  }
});

// Login
const botonRegistroLogin = document.getElementById("boton-login");
const inputLoginUsuario = document.getElementById("input-login-usuario");
const inputLoginPassword = document.getElementById("input-login-password");

botonRegistroLogin.addEventListener("click", () => {
  let userName = inputLoginUsuario.value.toLowerCase();

  // Check que la pass sea de mas de 6 caracteres
  let passWord = inputLoginPassword.value;
  if (passWord.length < 6) {
    consolaLogin.innerText = "Contraseña muy corta";
    inputLoginPassword.value = "";
    return;
  }
  username = userName;
  let msg = {
    secc: "general",
    type: "login",
    username: userName,
    password: passWord,
    clientID: clientID,
  };
  socket.emit("listStatus", msg);
});

// Socket login
socket.on("loginResponse", (response) => {
  if (response.clientID == clientID) {
    if (response.sts) {
      accessToken = response.accessToken;
      authAccessToken = response.refreshedToken;

      channel = `ListaFortnite${response.username.toLowerCase()}`;
      localStorage.setItem("channel", channel);
      streamTitle.innerText = `Fila de ${response.username}`;

      login.style.display = "none";
      lobby.style.display = "flex";
      inputLoginPassword.value = "";
      inputLoginUsuario.value = "";
      let LoggedUser = {
        authToken: authAccessToken,
        accessToken: accessToken,
        username: username,
        channel: channel,
        loggedIn: true,
        clientID: clientID,
      };
      let saveUser = JSON.stringify(LoggedUser);
      localStorage.setItem("LoggedUser", saveUser);
    } else {
      consolaLogin.innerText = response.msg;
    }
  }
});

// Funcion para conseguir nueva token
async function getNewToken(event, userDel) {
  let msg = {
    secc: "general",
    type: "newToken",
    username: username,
    token: authAccessToken,
    event: event,
    userDel: userDel,
    clientID: clientID,
  };
  socket.emit("listStatus", msg);
}
socket.on("newTokenResponse", (response) => {
  if (response.clientID == clientID) {
    if (response.sts) {
      console.log("New token got...");
      accessToken = response.token;
      switch (response.event) {
        case "closingList":
          let msgClos = {
            secc: "lista",
            type: "listStatus",
            channel: channel,
            isOpen: false,
            token: accessToken,
            event: "closingList",
          };
          socket.emit("listStatus", msgClos);
          break;
        case "openingList":
          let msgOp = {
            secc: "lista",
            type: "listStatus",
            channel: channel,
            isOpen: true,
            token: accessToken,
            event: "openingList",
          };
          socket.emit("listStatus", msgOp);
          break;
        case "removeUser":
          let msgRem = {
            secc: "lista",
            type: "restarUsuario",
            userDel: response.userDel,
            channel: channel,
            token: accessToken,
            event: "removeUser",
          };
          socket.emit("restarUsuario", msgRem);
          break;
        case "alertUser":
          let msgAlt = {
            secc: "lista",
            type: "alertarUsuario",
            userDel: response.userDel,
            channel: channel,
            token: accessToken,
            event: "alertUser",
          };
          socket.emit("restarUsuario", msgAlt);
          break;
        default:
          break;
      }
    } else {
      console.log(response.msg);
    }
  }
});
socket.on("getNewToken", (response) => {
  if (response.accessToken == accessToken) {
    console.log("Getting new token...");
    getNewToken(response.event, response.userDel);
  }
});

// Logout
const botonLogout = document.getElementById("button-logout");
botonLogout.addEventListener("click", () => {
  let msg = {
    secc: "general",
    type: "logout",
    authToken: authAccessToken,
    username: username,
    clientID: clientID,
  };
  socket.emit("listStatus", msg);
});
// Socket Logout
socket.on("logoutResponse", (response) => {
  if (response.clientID == clientID) {
    if (response.sts) {
      localStorage.removeItem("LoggedUser");
      lobby.style.display = "none";
      intro.style.display = "flex";
      contenedorIntro.style.marginTop = "2rem";
    }
  }
});

// boton de update
const buttonUpdate = document.getElementById("button-update");

buttonUpdate.addEventListener("click", () => {
  let msgUpdate = {
    secc: "lista",
    type: "update",
    channel: channel,
  };
  socket.emit("listStatus", msgUpdate);
});

// Seccion de lobby

// DOM

botonContenedorListaJuegos.addEventListener("click", () => {
  lobby.style.opacity = "0";
  setTimeout(() => {
    contenido.style.display = "flex";
    lobby.style.display = "none";
  }, 300);
  setTimeout(() => {
    contenido.style.opacity = "100%";
  }, 320);
});

botonVideoReacciones.addEventListener("click", () => {
  lobby.style.opacity = "0%";
  setTimeout(() => {
    videoReaccion.style.display = "flex";
    lobby.style.display = "none";
  }, 300);
  setTimeout(() => {
    videoReaccion.style.opacity = "100%";
  }, 320);
});

// Codigo Agregado
let arrayQueue = [];
const regex = / /gi;
// DOM

// Recibe lista nueva
socket.on("newQueue", (msg) => {
  if (msg.channel == channel) {
    arrayQueue = [];
    for (let i of msg.queue) {
      if (arrayQueue.includes(i)) {
        return;
      } else {
        arrayQueue.push(i);
      }
    }
    agregarAQueue(arrayQueue);
  }
});

socket.on("deleted", async (msg) => {
  if (msg.channel == channel) {
    arrayQueue = msg.queue;
    agregarAQueue(arrayQueue);
  }
});

socket.on("newVideo", async (msg) => {
  if (msg.channel == channel) {
    console.log(`cliente newVideo Stage ${msg.user}`);
    let newMsg = {
      secc: "reaccion",
      type: "getTitle",
      user: msg.user,
      url: msg.url,
      channel: msg.channel,
    };
    socket.emit("newOrder", newMsg);
  }
});
// Funcion de agregar a lista
function agregarAQueue(queue) {
  marcoListaReproduccion.innerHTML = "";
  for (let msg of queue) {
    let newID = msg.title.replace(regex, "-");
    let contenedorLink = document.createElement("div");
    contenedorLink.setAttribute("class", "linkReproduccion");
    contenedorLink.setAttribute("id", `cont${newID}`);
    let parrafo = document.createElement("p");
    parrafo.setAttribute("id", newID);
    parrafo.innerHTML = `${msg.user} <br> ${msg.title}`;
    parrafo.addEventListener("click", () => {
      getAndPostVideo(msg.url);
      let toDelete = document.getElementById(`cont${newID}`);
      toDelete.remove();
      let msgDel = {
        secc: "reaccion",
        type: "deleteUrl",
        channel: channel,
        title: msg.title,
        isOpen: isOpenQueue,
      };
      socket.emit("newOrder", msgDel);
    });
    //arrayQueue.push(msg.url);
    contenedorLink.appendChild(parrafo);
    let equisIMG = document.createElement("img");
    equisIMG.setAttribute("src", "./assets/equis.png");
    equisIMG.setAttribute("alt", "cruz");
    equisIMG.setAttribute("id", "boton-link-cruz");
    equisIMG.setAttribute("class", "cruz");
    equisIMG.addEventListener("click", () => {
      let toDelete = document.getElementById(`cont${newID}`);
      toDelete.remove();
      let msgDel = {
        secc: "reaccion",
        type: "deleteUrl",
        channel: channel,
        title: msg.title,
        isOpen: isOpenQueue,
      };
      socket.emit("newOrder", msgDel);
    });
    contenedorLink.appendChild(equisIMG);
    /*
        let alertIMG = document.createElement('img');
        alertIMG.setAttribute('src', './alert.png');
        alertIMG.setAttribute('alt', 'alert');
        alertIMG.setAttribute('id', 'boton-link-alerta');
        alertIMG.setAttribute('class', 'alert');
        contenedorLink.appendChild(alertIMG);
        */
    marcoListaReproduccion.appendChild(contenedorLink);
  }
}
/*
socket.on('TitleGot', async (msg) => {
  if(msg.channel == channel)
  {
    

});
*/
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "100%",
    width: "100%",
    videoId: "doOXUOlalmU",
    events: {
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    if (arrayQueue.length == 0) {
      return;
    } else {
      let nextVideo = getNextOne(arrayQueue);
      getAndPostVideo(nextVideo.url);
      let msgDel = {
        secc: "reaccion",
        type: "deleteUrl",
        channel: channel,
        title: nextVideo.title,
        isOpen: isOpenQueue,
      };
      socket.emit("newOrder", msgDel);
    }
  }
}

function getAndPostVideo(link) {
  console.log("Ejecutando video agregado", link);
  player.loadVideoById(link, 0, "default");
}

function getNextOne(array) {
  let newArray = [];
  let nextOne = array[0];
  for (let i of array) {
    if (i != nextOne) {
      newArray.push(i);
    }
  }
  arrayQueue = newArray;
  let DomList = document.getElementsByClassName("linkReproduccion");
  DomList[0].remove();
  return nextOne;
}

botonVolver.addEventListener("click", () => {
  contenido.style.opacity = "0%";
  setTimeout(() => {
    contenido.style.display = "none";
    lobby.style.display = "flex";
    lobby.style.opacity = "100%";
  }, 300);
});
botonVolverVideo.addEventListener("click", () => {
  videoReaccion.style.opacity = "0%";
  setTimeout(() => {
    videoReaccion.style.display = "none";
    lobby.style.display = "flex";
    lobby.style.opacity = "100%";
  }, 300);
});

const botonUpdateReac = document.getElementById("button-update-reaccion");
botonUpdateReac.addEventListener("click", () => {
  let msgRefresh = {
    secc: "reaccion",
    type: "refreshReac",
    channel: channel,
  };
  socket.emit("newOrder", msgRefresh);
});

socket.on("refreshQueueList", (msg) => {
  if (msg.channel == channel) {
    agregarAQueue(msg.queue);
  }
});
