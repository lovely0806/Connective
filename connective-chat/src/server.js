const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {allowEIO3: true});
const PORT = 3000

if (process.env.NODE_ENV === 'development') {
    app.use(express.static(__dirname + '/public'));
    
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });
}

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on("sending message", message => {
      io.sockets.emit("new message", { message: message });
    });
});

http.listen(PORT, () => {
    console.log('server is up on', PORT);
});