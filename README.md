# Bot-Lista-Juegos

Bot de Twitch para armar listas de juegos

## Como usar la pagina

Ingresar a este link:
https://bot-twitch-lista-juegos.herokuapp.com/

## Ahora cuenta con sistema de login!

La primera vez que ingresamos hay que crear una cuenta, el nombre de usuario tiene que coincidir con el nombre de tu canal.

### AVISO, LA CONTRASEÑA NO TIENE QUE SER LA DE TU CANAL, crea una contraseña alternativa, solo sirve para esta pagina

( de todos modos las contraseñas son encriptadas y no pueden ser vistas por nadie, eso incluye al programador )

## Comandos del bot:

todos los comandos tienen que empezar con - para que el bot los lea

## Comandos de Admin/Streamer:

### -agregar nombreDelUsuario

Este comando es para agregar gente a la lista, lo ideal es que el usuario use el comando -sumarse, asi el bot despues puede chequear si el usuario ya esta en la lista y no sumarlo nuevamente.

### -clear

Elimina la lista

### -abrir

Abre la lista si esta cerrada

### -cerrar

Cierra la lista si esta abierta

### -info

Manda un corto mensaje explicando como unirse a la lista siendo un usuario (no Admin)

### -siguiente

Este comando sirve para preguntarle al bot que jugador sigue en la lista, se le puede agregar un numero 2 o 3 despues del comando para que te tire 2 jugadores o 3 jugadores en vez de uno.

Ejemplo: -siguiente 2
El bot responde: Los próximos jugadores son Fulanito y Menganito, éxitos en la partida!

Este comando elimina los jugadores de la lista que menciona ya que los toma como que ya jugaron, recomendado usarlo al momento de invitar jugadores.

## Comandos para Usuarios:

### -sumarse

Este comando tienen que usarlo los usuarios para agregarse a la lista, lo ideal es usar este en vez de -agregar, asi los admins/streamer no tienen que estar agregando gente constantemente y solo se preocupan por usar el comando -siguiente para ver quien sigue.

### -lista

Con este comando el bot muestra la lista de jugadores

## Plan a futuro cercano:

```diff
+ Completado
```

- Agregar un sistema para, desde el cliente, eliminar a los usuarios de la lista o alertarles que ya les toca

```diff
+ Completado
```

- Crear sistema de login con contraseña para que solo el streamer pueda entrar al cliente de su lista

```diff
+ Completado
```

- Vincular con base de datos para que no se reinicie el array cuando el bot se reinicia.

```diff
+ Completado
```

- Hacer que la lista se muestre de forma mas prolija

```diff
+ Completado
```

- Subirlo a un host para no depender de mi pc para que funcione

```diff
+ Completado
```

- Compatible con varios servidores a la vez

```diff
+ Completado
```

- Lista Personalizable, con perfiles guardados

```diff
+ Completado
```

- Agregar un front para hacer un display de la lista

```diff
+ Completado
```

- Fusionado con bot de video reacciones, ahora hay un lobby previo para elegir que funcion te interesa usar

```diff
+ Completado
```

- Vincular la palabra 'jugar' con -info para que cuando alguien dice puedo jugar? o alguna variante el bot publique directamente la informacion de como sumarse a la lista

```diff
+ Completado
```

- Agregado bot en discord para los canales que tienen los links deshabilitados en twitch

```diff
- En camino
```

- Cambiar el boton de logout de lugar

```diff
- En camino
```

- Agregar a la fila de videos el nombre del usuario que mando el video

```diff
- En camino
```

- Agregar lista cerrada/abierta para la funcion de Video Reacciones
