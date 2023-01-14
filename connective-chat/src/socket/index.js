import { Events } from './events';

export const StartSocketConnection = (socketIO) => {
    socketIO.on(Events.CONNECTION, (socket) => {
        console.log('a user connected');
        socket.on(Events.DISCONNECT, () => {
            console.log('user disconnected');
        });
        socket.on(Events.SEND_MESSAGE, (message) => {
            console.log(Events.SEND_MESSAGE, { message });
            console.log(Events.NEW_MESSAGE_TO_ID(`${message.sender}_${message.receiver}`));
            socketIO.sockets.emit(Events.NEW_MESSAGE_TO_ID(`${message.sender}_${message.receiver}`), {
                ...message
            });
        });
    });
};
