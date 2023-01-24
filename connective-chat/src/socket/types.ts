export type UserSession = {
    user: User;
};

export type User = {
    email: string;
    id: number;
};

export type Message = {
    sender: number;
    receiver: number;
    text: string;
};
