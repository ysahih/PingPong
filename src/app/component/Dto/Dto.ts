
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
    createdAt: Date
    isOnline: Boolean,
    isRoom: boolean,
    hasNoAccess: boolean,
    isRead: Boolean,
}



export type ConvoData = {
    id : number,
    inGame : Boolean,
    online : Boolean,
    userName: string,
    image: string,
    messages?: Array <Message>
}



