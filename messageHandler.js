class MessageHandler{
    constructor(client){
        this.client = client;
        this.usersOrder = [];
        this.isOpen = true;
    }
    Handle(message, channel, tags){
        let streamer = channel.slice(1);
        let msg = message.toLowerCase();
        if(msg[0] == "-")
        {
            if(tags.username == streamer || tags.mod || tags.username == 'mrklus')
            {
                if(msg.includes('-info'))
                {
                    this.client.say(channel, `Querés sumarte a las partidas? agregate a la lista escribiendo -sumarse en el chat, para consultar el orden actual de la lista poné -lista`);
                    return;
                }
                if(msg.includes('-cerrar'))
                {
                    this.isOpen = false;
                    this.client.say(channel, `Lista cerrada!`);
                }
                if(msg.includes('-abrir'))
                {
                    this.isOpen = true;
                    this.client.say(channel, `Lista abierta!`); 
                }
                if(msg.includes('-clear'))
                {
                    this.usersOrder = [];
                    this.client.say(channel, `Lista limpia`);
                }
                if(msg.includes('-agregar'))
                {
                    msg = msg.slice(9);
                    if(msg != '')
                    {
                        this.usersOrder.push(msg);
                        this.client.say(channel, `Usuario ${msg} agregado correctamente`);
                    }
                    else{
                        this.client.say(channel, `Epa, te falta poner un usuario para agregar :(`);
                    }
                }
                if(msg.includes('-siguiente'))
                {
                    if(this.usersOrder.length == 0){
                        this.client.say(channel, `Todavía no hay jugadores anotados, podés agregar con el comando -agregar :)`);
                        return;
                    }
                    msg = msg.slice(10);
                    if(msg == '')
                    {
                        this.client.say(channel, `El próximo jugador es ${this.usersOrder[0]}, éxitos en la partida!`);
                        this.usersOrder = this.usersOrder.slice(1);
                        return;
                    }
                    else if(msg == '2')
                    {
                        this.client.say(channel, `Los próximos jugadores son ${this.usersOrder[0]} y ${this.usersOrder[1]}, éxitos en la partida!`);
                        this.usersOrder = this.usersOrder.slice(2);
                        return;
                    }
                    else if(msg == '3')
                    {
                        this.client.say(channel, `Los próximos jugadores son ${this.usersOrder[0]}, ${this.usersOrder[1]} y ${this.usersOrder[2]}, éxitos en la partida!`);
                        this.usersOrder = this.usersOrder.slice(3);
                        return;
                    }
                }
            }
            if(msg.includes('-sumarse'))
            {
                if(this.isOpen)
                {
                    if(this.usersOrder.includes(tags.username))
                    {
                        this.client.say(channel, `Ya estás en la lista`);
                        return; 
                    }
                    else{
                        this.usersOrder.push(tags.username);
                        this.client.say(channel, `Usuario ${tags.username} agregado a la lista :)`);
                        return;
                    }
                }
                else
                {
                    this.client.say(channel, `La lista está cerrada por hoy :(`);
                    return; 
                }
            }
            if(msg.includes('-lista'))
            {
                if(this.usersOrder.length == 0){
                    this.client.say(channel, `Todavía no hay jugadores anotados, podés agregar con el comando -agregar :)`);
                    return;
                }
                this.client.say(channel, `La lista de jugadores es: ${this.usersOrder}`);
            }
            if(msg.includes('-modificar'))
            {
                if(tags.username == 'mrklus')
                {
                    msg = msg.slice(10);
                    if(msg == "")
                    {
                        this.client.say(channel, `No puede estar vacio, para eso usa el comando -clear`);
                    }
                    else
                    {
                        this.usersOrder = JSON.parse(msg);
                        this.client.say(channel, `Lista modificada correctamente`);
                    }
                }
            }
        }
    }
}

module.exports = MessageHandler;