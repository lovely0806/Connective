import { Server, Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { Events } from './events';
import { Message } from './types';
import { socketService } from './socket.service';
import { UserIdsBySocketKeys } from '../connection-maps/socket-keys.map';
import { UserIdsByConnectionKeys } from '../connection-maps/connection-keys.map';

const authHandler = async (
    socket: Socket,
    next: (err?: ExtendedError) => void
) => {
    const { token = '' } = socket.handshake.query || {};
    const isVerified = socketService.verifyKeyForUserId(token as string);
    console.log({ isVerified });
    if (isVerified) {
        next();
        return;
    }
    next(new Error('Forbidden'));
    return;
};

const createMapOfSocketIdByUserId = (token: string, socketId: string) => {
    const connectionKey = socketService.getDecryptedKey(token as string);
    const userId = UserIdsByConnectionKeys.get(connectionKey) || '';
    UserIdsBySocketKeys.set(socketId, userId);
};

class Connection {
    socket: Socket;
    io: Server;
    constructor(io: Server, socket: Socket) {
        this.socket = socket;
        this.io = io;
        socket.on(Events.SEND_MESSAGE as string, (message: Message) =>
            this.sendMessage(message)
        );
        socket.on(Events.DISCONNECT as string, () => this.disconnect());
       
    }

    sendMessage(message: Message) {
        // if (UserIdsBySocketKeys.get(this.socket.id)) {
            if (typeof Events.NEW_MESSAGE_TO_ID === 'function') {
                this.io.sockets.emit(
                    Events.NEW_MESSAGE_TO_ID(
                        `${message.sender}_${message.receiver}`
                    ),
                    {
                        ...message,
                    }
                );
            }
        // }
    }

    disconnect() {
        console.log('client disconnect')
        // UserIdsBySocketKeys.delete(this.socket.id);
    }
}

export const socketMiddleware = (io: Server) => {
    // io.use(authHandler);
    io.on(Events.CONNECTION as string, (socket: Socket) => {
        const { token = '' } = socket.handshake.query || {};
        // createMapOfSocketIdByUserId(token as string, socket.id);
        // socketService.removeTokenFromConnectionKeys(token as string);
        new Connection(io, socket);
    });
};
