
export interface Message {
    content: String;
    userId: number;
    createdAt: Date;
    userName: string;
}

export type ChatData = {
    id : number,
    userId: number,
    userName: string,
    fromName?: string,
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
    hasNoAccess: boolean,
    messages?: Array <Message>
}



