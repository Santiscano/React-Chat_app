import express from 'express';
import morgan from 'morgan';
import {Server as SocketServer} from 'socket.io'; 
import http from 'http';
import cors from 'cors';
import {PORT} from './config.js'

// con express creamos la app
const app = express();
// con http creamos un servidor en el que pondremos la app
const server = http.createServer(app)
// y ponemos el servidor dentro del servidor de  socket.io y esto lo guardamos dentro de la variable io
const io = new SocketServer(server, {
    cors: {
        // /  * para indicar que cualquiera se puede conectar
        // https://localhost:.... si quiero uno en particular
        origin: '*'
    }
});

// los cors son lo que evita que se bloque las conexiones entre los localhost y otro externo
app.use(cors());
app.use(morgan('dev'))

// el evento on es para cuando algo sucede el escucha, en este caso escucha el evento connection
io.on('connection', (socket)=>{
    console.log(`el usuario con ID: ${socket.id} se conecto`)
    socket.on('message',(message)=>{
        console.log(message);
        // el broadcast es decir envia a los otros clientes
        // socket.broadcast.emit('message',message)  //cambio esta linea porque le pedire que me de un objeto
        socket.broadcast.emit('message',{
            body: message,
            from: socket.id,
            connection: `el usuario con ID: ${socket.id} se conecto`
        })
    })
})

// cambio app.listen por server.liste ya que app se puso arriba dentro del server http
server.listen(PORT, ()=> console.log(`escuchando en el puerto ${PORT}`));

app.on('error', (err) => {
    console.error('errores atajados',err);
})