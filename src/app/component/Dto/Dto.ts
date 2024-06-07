
export interface Message {
    content: String;
    senderID: number;
    createdAt: Date;
}

export type ChatData = {
    id : number,
    userName: string,
    image: string,
    lastMessage: string,
    isOnline: Boolean,
    isRead: Boolean,
    isRoom: boolean,
    createdAt: Date
}



export type ConvoData = {
    id : number,
    inGame : Boolean,
    online : Boolean,
    userName: string,
    image: string,
    messages?: Array <Message>
}



