//var socket = io();

const ListaUsuarios = document.getElementById("listContainer");
const streamTitle = document.getElementById("streamTitle");

let channel = "";
if(localStorage.channel)
{
    channel = localStorage.getItem("channel");
    streamTitle.innerText = `Fila de ${channel.slice(13)}`;
}

/*
socket.on('transmition', msg => {
    if(msg.listName == channel)
    {
        ListaUsuarios.innerHTML = '';
        for(let i of msg.userGroup)
        {
            let div = document.createElement('div');
            div.setAttribute('class', 'user');
            div.innerHTML = `${i}`;
            ListaUsuarios.appendChild(div);
        }
    }
});
*/


const botonSet = document.getElementById("botonSet");
const inputSet = document.getElementById("inputSet");
botonSet.addEventListener('click', () => {
    channel = `ListaFortnite${inputSet.value.toLowerCase()}`;
    localStorage.setItem("channel", channel);
    streamTitle.innerText = `Fila de ${inputSet.value}`;
    inputSet.value = "";
});

// Estilado
const table = document.getElementById("table");
const customCont = document.getElementById("customCont");
const html = document.querySelector("html");

const colorLista = document.getElementById("colorLista");
const colorBorde = document.getElementById("colorBorde");
const colorFuente = document.getElementById("colorFuente");
const colorFondo = document.getElementById("colorFondo");
const buttonColors = document.getElementById("buttonColors");
let linked = false;
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

    if(linked)
    {
        table.style.borderColor = colorFondo.value;
        customCont.style.borderColor = colorFondo.value;
        html.style.backgroundColor = colorFondo.value;
    }
    else 
    {
        table.style.borderColor = colorBorde.value;
        customCont.style.borderColor = colorBorde.value;
        html.style.backgroundColor = colorFondo.value;    
    }
    let save = JSON.stringify(perfilGuardado)
    localStorage.setItem("save", save);
});
let clicked = true;
const buttonLink = document.getElementById("buttonLink");


buttonLink.addEventListener('click', () => {
    if(clicked)
    {
        colorBorde.disabled = true;
        linked = true;
        clicked = false;
    }   
    else
    {
        colorBorde.disabled = false;
        linked = false;
        clicked = true;
    }
});