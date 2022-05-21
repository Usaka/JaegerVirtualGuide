const app = require('express')();
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

const port = 10010
const port_socket = 10011
let log = ''

app.get('/', (req, res) => {
    res.send(`Log de mensajes enviados desde los dispositivos => <br> ${log}`)
})

io.on('connection', (socket) => {
    console.log(socket.id)
    log += 'A user connected <br>'

    socket.on('jeager', msg => {
        log += `${msg} <br>`
        io.emit('jeager', msg);
    });
});

app.listen(port, () => {
    console.log(`Corriendo servidor en el puerto ${port}`)
})

server.listen(port_socket, () => {
    console.log(`Socket corriendo en ${port_socket}`);
});