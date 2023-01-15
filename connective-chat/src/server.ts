import express, { Request, Response } from 'express';
import { StartSocketConnection } from './socket';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = new http.Server(app);
const io = new Server(server, {
    allowEIO3: true,
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
const PORT = 3001;

app.use(cors());

app.get('/ping', (req: Request, res: Response) => {
    res.json({});
});

if (process.env.NODE_ENV === 'development') {
    app.use(express.static(__dirname + '/public'));

    app.get('/', (req: Request, res: Response) => {
        res.sendFile(__dirname + '/index.html');
    });
}

StartSocketConnection(io);

server.listen(PORT, () => {
    console.log('server is up on', PORT);
});
