const app = require('express')();
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

const port = 10018
const port_socket = 10019
let log = ''

app.get('/Log', (req, res) => {
    res.send(`Log de mensajes enviados desde los dispositivos => <br> ${log}`)
})

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname })
})

io.on('connection', (socket) => {
    console.log(socket.id)
    log += 'A user connected <br>'

    socket.on('jeager', msg => {
        log += `${new Date().toString()}:${msg} <br>`
        io.emit('jeager', msg);
    });

    socket.on('jeager-video', msg => {
        io.emit('jeager-video', msg);
    });
});

app.listen(port, () => {
    console.log(`Corriendo servidor en el puerto ${port}`)
})

server.listen(port_socket, () => {
    console.log(`Socket corriendo en ${port_socket}`);
});