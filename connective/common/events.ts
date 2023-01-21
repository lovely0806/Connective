export const Events: { [key: string]: string | ((id: string) => string) } = {
  SEND_MESSAGE: "send_message",
  NEW_MESSAGE_TO_ID: (id) => `NEW_MESSAGE_TO_${id}`,
  DISCONNECT: "disconnect",
};
