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