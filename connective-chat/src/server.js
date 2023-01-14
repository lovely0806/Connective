const express = require('express');
const { StartSocketConnection } = require('./socket');
var cors = require('cors');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    allowEIO3: true,
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
const PORT = 3001;

app.use(cors());
app.get('/ping', (req, res) => {
    res.json({});
});

if (process.env.NODE_ENV === 'development') {
    app.use(express.static(__dirname + '/public'));

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });
}

StartSocketConnection(io);

http.listen(PORT, () => {
    console.log('server is up on', PORT);
});
