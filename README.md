# Bot-Lista-Juegos
Bot de Twitch para armar listas de juegos

Comandos del bot:

todos los comandos tienen que empezar con - para que el bot los lea

Comandos de Admin/Streamer:

-agregar nombreDelUsuario
Este comando es para agregar gente a la lista, lo ideal es que el usuario use el comando -sumarse, asi el bot despues puede chequear si el usuario ya esta en la lista y no sumarlo nuevamente.

-clear
Elimina la lista 

-abrir
Abre la lista si esta cerrada

-cerrar 
Cierra la lista si esta abierta

-info
Manda un corto mensaje explicando como unirse a la lista siendo un usuario (no Admin)

-siguiente
Este comando sirve para preguntarle al bot que jugador sigue en la lista, se le puede agregar un numero 2 o 3 despues del comando para que te tire 2 jugadores o 3 jugadores en vez de uno. 

Ejemplo: -siguiente 2
El bot responde: Los próximos jugadores son Fulanito y Menganito, éxitos en la partida!

Este comando elimina los jugadores de la lista que menciona ya que los toma como que ya jugaron, recomendado usarlo al momento de invitar jugadores.

Comandos para Usuarios:

-sumarse 
Este comando tienen que usarlo los usuarios para agregarse a la lista, lo ideal es usar este en vez de -agregar, asi los admins/streamer no tienen que estar agregando gente constantemente y solo se preocupan por usar el comando -siguiente para ver quien sigue.

-lista
Con este comando el bot muestra la lista de jugadores 



Plan a futuro cercano:

- Vincular con base de datos para que no se reinicie el array cuando el bot se reinicia.

- Hacer que la lista se muestre de forma mas prolija 

- Vincular la palabra 'jugar' con -info para que cuando alguien dice puedo jugar? o alguna variante el bot publique directamente la informacion de como sumarse a la lista

- Subirlo a un host para no depender de mi pc para que funcione
