const { get } = require('mongoose');
const ArrayGroup = require('./Models/ArrayGroup');

class MessageHandler{
    constructor(client, io){
        this.io = io;
        this.client = client;
        this.usersOrder = [];
        this.isOpen = true;
    }
    
    async HandleDataBase(msg)
    {
        const getList = await ArrayGroup.findOne({ listName: msg.channel }).exec();
        ArrayGroup.findOneAndUpdate({ listName: msg.channel }, { userGroup: getList.userGroup, listName: msg.channel, isOpen: msg.isOpen }, (err, result) => {
            if(err)
            {
                console.log(err);
            }else{
                if(msg.isOpen)
                {
                    this.client.say(msg.channel.slice(13), `Lista Abierta!`);
                    this.io.emit("listStatusServer", msg);
                    return;  
                }else
                {
                    this.client.say(msg.channel.slice(13), `Lista Cerrada!`);
                    this.io.emit("listStatusServer", msg);
                    return;
                }
            }
        }); 
    }
    
    async Handle(message, channel, tags){
        let streamer = channel.slice(1);
        let msg = message.toLowerCase();
        const getList = await ArrayGroup.findOne({ listName: `ListaFortnite${streamer}` }).exec();
        if(getList==null)
        {
            const list = new ArrayGroup({
                userGroup: [],
                listName: `ListaFortnite${streamer}`,
                isOpen: true
            });
            list.save();
        }
        let getListEmited = await ArrayGroup.findOne({ listName: `ListaFortnite${streamer}` }).exec();
        this.io.emit("transmition", getListEmited);
        if(msg[0] == "-")
        {
            if(tags.username == streamer || tags.mod || tags.username == 'mrklus')
            {
                if(msg.includes('-refresh'))
                {
                    let getListEmited = await ArrayGroup.findOne({ listName: `ListaFortnite${streamer}` }).exec();
                    this.io.emit("transmition", getListEmited);
                    return;
                }
                if(msg.includes('-info')) // Funciona
                {
                    this.client.say(channel, `Querés sumarte a las partidas? agregate a la lista escribiendo -sumarse en el chat, para consultar el orden actual de la lista poné -lista`);
                    return;
                }
                if(msg.includes('-cerrar')) // Funciona
                {
                    ArrayGroup.findOneAndUpdate({ listName: `ListaFortnite${streamer}` }, { userGroup: getList.userGroup, listName: `ListaFortnite${streamer}`, isOpen: false }, (err, result) => {
                        if(err)
                        {
                            console.log(err);
                        }else{
                            this.client.say(channel, `Lista cerrada!`);
                            let msg = {
                                channel: `ListaFortnite${streamer}`,
                                isOpen: false
                            }
                            this.io.emit("listStatusServer", msg);
                            return;
                        }
                    });      
                }
                if(msg.includes('-abrir')) // Funciona
                {
                    ArrayGroup.findOneAndUpdate({ listName: `ListaFortnite${streamer}` }, { userGroup: getList.userGroup, listName: `ListaFortnite${streamer}`, isOpen: true }, (err, result) => {
                        if(err)
                        {
                            console.log(err);
                        }else{
                            this.client.say(channel, `Lista abierta!`); 
                            let msg = {
                                channel: `ListaFortnite${streamer}`,
                                isOpen: true
                            }
                            this.io.emit("listStatusServer", msg);
                            return;
                        }
                    });
                }
                if(msg.includes('-clear')) // Funciona
                {
                    ArrayGroup.findOneAndUpdate({ listName: `ListaFortnite${streamer}` }, { userGroup: [], listName: `ListaFortnite${streamer}` }, (err, result) => {
                        if(err)
                        {
                            console.log(err);
                        }else{
                            this.client.say(channel, `Lista limpia`);
                            return;
                        }
                    }).then(async () => {
                        let getListEmited = await ArrayGroup.findOne({ listName: `ListaFortnite${streamer}` }).exec();
                        this.io.emit("transmition", getListEmited);
                        return;
                    }); 
                }
                if(msg.includes('-agregar')) // Resolver
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
                if(msg.includes('-siguiente')) // Resolver
                {
                    if(getList.length == 0){
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
            if(msg.includes('-sumarse')) // Funciona
            {
                if(getList.isOpen)
                {
                    if(getList.userGroup.includes(tags.username))
                    {
                        this.client.say(channel, `Ya estás en la lista`);
                        return; 
                    }
                    else{
                        getList.userGroup.push(tags.username);
                        ArrayGroup.findOneAndUpdate({ listName: `ListaFortnite${streamer}` }, { userGroup: getList.userGroup, listName: `ListaFortnite${streamer}` }, (err, result) => {
                            if(err)
                            {
                                console.log(err);
                            }else{
                                this.client.say(channel, `Usuario ${tags.username} agregado a la lista :)`);
                            }
                        }).then(async () => {
                            let getListEmited = await ArrayGroup.findOne({ listName: `ListaFortnite${streamer}` }).exec();
                            this.io.emit("transmition", getListEmited);
                            return;
                        }); 
                    }
                }
                else
                {
                    this.client.say(channel, `La lista está cerrada por hoy :(`);
                    return; 
                }
            }
            if(msg.includes('-lista')) // Funciona
            {
                if(getList.userGroup.length == 0){
                    this.client.say(channel, `Todavía no hay jugadores anotados, podés sumarte con el comando -sumarse :)`);
                    return;
                }
                let ListString = '';
                for(let i = 0; i < getList.userGroup.length; i++)
                {
                    if(i != getList.userGroup.length - 1)
                    {
                        ListString+= ` ${getList.userGroup[i]},`;
                    }
                    else
                    {
                        ListString+= ` ${getList.userGroup[i]}.`;
                    }
                }
                this.client.say(channel, `La lista de jugadores es:${ListString}`);
            }
        }
    }
}

module.exports = MessageHandler;