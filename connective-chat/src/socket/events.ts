export const Events: { [key: string]: string | ((id: string) => string) } = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    SEND_MESSAGE: 'send_message',
    NEW_MESSAGE_TO_ID: (id: string) => `NEW_MESSAGE_TO_${id}`,
};
