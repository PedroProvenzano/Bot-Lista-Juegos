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

let clicked = true;
let channel = "";
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

socket.on('listStatusServer', (msg) => {
    if(msg.channel == channel)
    {
        if(msg.isOpen)
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
});

socket.on('transmition', msg => {
    if(msg.listName == channel)
    {
        ListaUsuarios.innerHTML = '';
        for(let i of msg.userGroup)
        {
            let div = document.createElement('div');
            div.setAttribute('class', 'user');
            div.innerHTML = `${i}`;
            let botonSacar = document.createElement('div');
            botonSacar.innerHTML = `<p> 'x' </p>`;
            botonSacar.addEventListener('click', (i) => {
                let msg = {
                    type: "restarUsuario",
                    username: `${i}`,
                    channel: channel
                }
                socket.emit('restarUsuario', msg);
            });
            div.appendChild(botonSacar);
            ListaUsuarios.appendChild(div);
        }
    }
});



const botonSet = document.getElementById("botonSet");
const inputSet = document.getElementById("inputSet");
botonSet.addEventListener('click', () => {
    channel = `ListaFortnite${inputSet.value.toLowerCase()}`;
    localStorage.setItem("channel", channel);
    streamTitle.innerText = `Fila de ${inputSet.value}`;
    inputSet.value = "";
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
    botonSet.style.color = load.saveColor;
    botonSet.style.borderColor = load.saveBorde;
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
    botonSet.style.color = colorFuente.value;
    buttonColors.style.color = colorFuente.value;
    buttonColors.style.borderColor = colorBorde.value;
    table.style.borderColor = colorBorde.value;
    botonSet.style.borderColor = colorBorde.value;
    customCont.style.borderColor = colorBorde.value;
    html.style.backgroundColor = colorFondo.value;    
    let save = JSON.stringify(perfilGuardado)
    localStorage.setItem("save", save);
});

botonLista.addEventListener('click', () => {
    if(clicked)
    {
        botonLista.innerText = "Lista Cerrada";
        botonLista.style.backgroundColor = "#ff1919";
        clicked = false;
        let message = {
            type: "listStatus",
            channel: channel,
            isOpen: false
        }
        let isOpen = JSON.stringify(false);
        localStorage.setItem("isOpen", isOpen);
        socket.emit('listStatus', message);
    }
    else
    {
        botonLista.innerText = "Lista Abierta";
        botonLista.style.backgroundColor = "#43ff19";
        clicked = true;
        let message = {
            type: "listStatus",
            channel: channel,
            isOpen: true
        }
        let isOpen = JSON.stringify(true);
        localStorage.setItem("isOpen", isOpen);
        socket.emit('listStatus', message);
    }
});