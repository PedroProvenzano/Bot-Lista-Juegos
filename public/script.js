var socket = io();


// DOM
const ListaUsuarios = document.getElementById("listContainer");
const streamTitle = document.getElementById("streamTitle");
// Estilado
const table = document.getElementById("table");
const customCont = document.getElementById("customCont");
const html = document.querySelector("html");

const colorLista = document.getElementById("colorLista");
const colorBorde = document.getElementById("colorBorde");
const colorFuente = document.getElementById("colorFuente");
const colorFondo = document.getElementById("colorFondo");
const buttonColors = document.getElementById("buttonColors");
// Botones
const botonLista = document.getElementById("buttonList");

// Escenas
const contenido = document.getElementById("contenido");
const intro = document.getElementById("intro");
const contenedorIntro = document.getElementById("contenedor-intro");


let clicked = true;
let channel = "";
let username = "";
let accessToken = "";
let authAccessToken = "";

if(localStorage.LoggedUser)
{
    let loadData = JSON.parse(localStorage.getItem('LoggedUser'));
    channel = loadData.channel;
    username = loadData.username;
    accessToken = loadData.accessToken;
    authAccessToken = loadData.authToken;
    intro.style.display = "none";
    contenido.style.display = "flex";
}

if(localStorage.channel)
{
    channel = localStorage.getItem("channel");
    streamTitle.innerText = `Fila de ${channel.slice(13)}`;
}
if(localStorage.isOpen)
{
    let isOpen = JSON.parse(localStorage.getItem("isOpen"));
    if(isOpen)
    {
        botonLista.innerText = "Lista Abierta";
        botonLista.style.backgroundColor = "#43ff19";
        clicked = true;
    }
    else
    {
        botonLista.innerText = "Lista Cerrada";
        botonLista.style.backgroundColor = "#ff1919";
        clicked = false;
    }
}
// Socket Events
socket.on('listStatusServer', (msg) => {
    if(msg.channel == channel)
    {
        if(msg.isOpen)
        {
            botonLista.innerText = "Lista Abierta";
            botonLista.style.backgroundColor = "#43ff19";
            clicked = true;
            let isOpen = JSON.stringify(true);
            localStorage.setItem("isOpen", isOpen);
        }
        else 
        {
            botonLista.innerText = "Lista Cerrada";
            botonLista.style.backgroundColor = "#ff1919";
            clicked = false;
            let isOpen = JSON.stringify(false);
            localStorage.setItem("isOpen", isOpen);
        }
    }
});

socket.on('transmition', msg => {
    if(msg.listName == channel)
    {
        ListaUsuarios.innerHTML = '';
        for(let i of msg.userGroup)
        {
            let contDiv = document.createElement('div');
            contDiv.setAttribute('class','contUser');
            let div = document.createElement('div');
            div.setAttribute('class', 'user');
            div.innerHTML = `${i}`;
            let usernameDel = `${i}`; 
            let botonSacar = document.createElement('div');
            botonSacar.innerText = 'x';
            botonSacar.setAttribute("class", "botonX");
            botonSacar.addEventListener('click', () => {
                let msg = {
                    type: "restarUsuario",
                    username: usernameDel,
                    channel: channel,
                    token: accessToken
                }
                socket.emit('restarUsuario', msg);
            });
            div.appendChild(botonSacar);
            contDiv.appendChild(div);
            ListaUsuarios.appendChild(contDiv);
        }
    }
});


if(localStorage.save)
{
    let load = localStorage.getItem("save");
    load = JSON.parse(load);
    table.style.backgroundColor = load.saveBackGround;
    table.style.color = load.saveColor;
    customCont.style.backgroundColor = load.saveBackGround;
    customCont.style.color = load.saveColor;
    table.style.borderColor = load.saveBorde;
    customCont.style.borderColor = load.saveBorde;
    html.style.backgroundColor = load.saveFondo; 
    buttonColors.style.color = load.saveColor;
    buttonColors.style.borderColor = load.saveBorde;
    botonLista.style.borderColor = load.saveBorde;
}
buttonColors.addEventListener('click', () => {
    let perfilGuardado = {
        saveBackGround: colorLista.value,
        saveColor: colorFuente.value,
        saveBorde: colorBorde.value,
        saveFondo: colorFondo.value
    }
    table.style.backgroundColor = colorLista.value;
    table.style.color = colorFuente.value;
    customCont.style.backgroundColor = colorLista.value;
    customCont.style.color = colorFuente.value;
    buttonColors.style.color = colorFuente.value;
    buttonColors.style.borderColor = colorBorde.value;
    table.style.borderColor = colorBorde.value;
    customCont.style.borderColor = colorBorde.value;
    html.style.backgroundColor = colorFondo.value;    
    let save = JSON.stringify(perfilGuardado)
    localStorage.setItem("save", save);
});

botonLista.addEventListener('click', () => {
    if(clicked)
    {
        let message = {
            type: "listStatus",
            channel: channel,
            isOpen: false,
            token: accessToken
        }
        socket.emit('listStatus', message);
    }
    else
    {
        let message = {
            type: "listStatus",
            channel: channel,
            isOpen: true,
            token: accessToken
        }
        socket.emit('listStatus', message);
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
const contenedorCrearCuenta = document.getElementById("contenedor-crear-cuenta");
const botonVolverCrearCuenta = document.getElementById("boton-volver-crear-cuenta");
// Login
const login = document.getElementById("login");
const contenedorLogin = document.getElementById("contenedor-login");
const botonVolverLogin = document.getElementById("boton-volver-login");

// Botones Intro    Tenes cuenta?

// Si
botonIntroSi.addEventListener('click', () => {
    cambioEscena(intro, contenedorIntro, login, contenedorLogin);
});

// No
botonIntroNo.addEventListener('click', () => {
    cambioEscena(intro, contenedorIntro, crearCuenta, contenedorCrearCuenta);
});

// Botones crear cuenta
// Volver
botonVolverCrearCuenta.addEventListener('click', () => {
    cambioEscena(crearCuenta, contenedorCrearCuenta, intro, contenedorIntro);
});
botonVolverLogin.addEventListener('click', () => {
    cambioEscena(login, contenedorLogin, intro, contenedorIntro);
});

// Funcion desaparecer
function cambioEscena(actual, contenedorActual, objetivo, contenedorObj){
    contenedorActual.style.marginTop = "-20rem";
    setTimeout(() => {
        objetivo.style.display = "flex";
    }, 500);
    setTimeout(() => {        
        actual.style.display = "none";
        contenedorObj.style.marginTop = "2rem";
    }, 600); 
}


// Botones registro
const botonRegistroCrearCuenta = document.getElementById("boton-crear-cuenta"); 
const inputCrearCuentaUser = document.getElementById("input-crear-cuenta-usuario");
const inputCrearCuentaPassword = document.getElementById("input-crear-cuenta-password");

botonRegistroCrearCuenta.addEventListener('click', () => {
    let userName = inputCrearCuentaUser.value.toLowerCase();

    // Check que la pass sea de mas de 6 caracteres
    let passWord = inputCrearCuentaPassword.value;
    if(passWord.length < 6)
    {
        consolaCrearCuenta.innerText = 'Contraseña muy corta';
        inputCrearCuentaPassword.value = '';
        return;
    }
    username = userName;
    let msg = {
        type: 'register',
        username: userName,
        password: passWord
    }
    consolaCrearCuenta.innerText = `Creando cuenta...`;
    socket.emit('listStatus', msg);
});

// Socket register
socket.on('registerResponse', response => {
    if(response.username == username)
    {
        // Check respuesta del servidor
        if(response.sts)
        {
            cambioEscena(crearCuenta, contenedorCrearCuenta, login, contenedorLogin);
            consolaLogin.innerText = response.msg;
        }
        else
        {
            consolaCrearCuenta.innerText = response.msg;
        }
    }
});


// Login
const botonRegistroLogin = document.getElementById("boton-login");
const inputLoginUsuario = document.getElementById("input-login-usuario");
const inputLoginPassword = document.getElementById("input-login-password");

botonRegistroLogin.addEventListener('click', () => {
    let userName = inputLoginUsuario.value.toLowerCase();

    // Check que la pass sea de mas de 6 caracteres
    let passWord = inputLoginPassword.value;
    if(passWord.length < 6)
    {
        consolaLogin.innerText = 'Contraseña muy corta';
        inputLoginPassword.value = '';
        return;
    }
    username = userName;
    let msg = {
        type: 'login',
        username: userName,
        password: passWord,
    }
    socket.emit('listStatus', msg);
});

// Socket login
socket.on('loginResponse', response => {
    if(response.username == username)
    {
        if(response.sts)
        {
            accessToken = response.accessToken;
            authAccessToken = response.refreshedToken;

            channel = `ListaFortnite${response.username.toLowerCase()}`;
            localStorage.setItem("channel", channel);
            streamTitle.innerText = `Fila de ${response.username}`;

            login.style.display = "none";
            contenido.style.display = "flex";

            let LoggedUser = {
                authToken: authAccessToken,
                accessToken: accessToken,
                username: username,
                channel: channel,
                loggedIn: true
            }
            let saveUser = JSON.stringify(LoggedUser);
            localStorage.setItem('LoggedUser', saveUser);
        }
        else{
            consolaLogin.innerText = response.msg;
        }
    }
});

// Funcion para conseguir nueva token
async function getNewToken()
{
    let msg = {
        type: 'newToken',
        username: username,
        token: authAccessToken
    }
    socket.emit('listStatus', msg);
}
socket.on('newTokenResponse', response => {
    if(response.username == username)
    {
        if(response.sts)
        {
            console.log('New token got...');
            accessToken = response.token; 
        }
        else
        {
            console.log(response.msg);
        }
    }
});
socket.on('getNewToken', response => {
    if(msg.username == channel)
    {
        console.log('Getting new token...');
        getNewToken();
    }
});


// Logout
const botonLogout = document.getElementById("button-logout");
botonLogout.addEventListener('click', () => {
    let msg = {
        type: "logout",
        authToken: authAccessToken,
        username: username
    }
    socket.emit('listStatus', msg);
});
// Socket Logout
socket.on('logoutResponse', response => {
    if(response.username == username)
    {
        if(response.sts)
        {
            localStorage.removeItem('LoggedUser');
            contenido.style.display = "none";
            intro.style.display = "flex";
            contenedorIntro.style.marginTop = "0";
        }
    }
});