var socket = io();

const ListaUsuarios = document.getElementById("listContainer");

let channel = "";

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

const streamTitle = document.getElementById("streamTitle");
const botonSet = document.getElementById("botonSet");
const inputSet = document.getElementById("inputSet");
botonSet.addEventListener('click', () => {
    channel = `ListaFortnite${inputSet.value.toLowerCase()}`;
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
buttonColors.addEventListener('click', () => {
    table.style.backgroundColor = colorLista.value;
    table.style.color = colorFuente.value;
    customCont.style.backgroundColor = colorLista.value;
    customCont.style.color = colorFuente.value;

    if(linked)
    {
        table.style.borderColor = colorBorde.value;
        customCont.style.borderColor = colorBorde.value;
        html.style.backgroundColor = colorFondo.value;
    }
    else 
    {
        table.style.borderColor = colorFondo.value;
        customCont.style.borderColor = colorFondo.value;
        html.style.backgroundColor = colorFondo.value;
    }
});
let clicked = true;
const buttonLink = document.getElementById("buttonLink");


buttonLink.addEventListener('click', () => {
    if(clicked)
    {
        colorBorde.disabled = true;
        clicked = false;
    }   
    else
    {
        colorBorde.disabled = false;
        clicked = true;
    }
});