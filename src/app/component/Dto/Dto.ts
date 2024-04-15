
export type ChatData = {
    id : number,
    convId: number,
    userName: string,
    image: string,
    lastMessage: string,
    isOnline: Boolean,
    isRead: Boolean,
    isRoom: Boolean,
    createdAt: Date
}

export type ConvoData = {
    id : number,
    userName: string,
    image: string,
    messages?: Array <Object> 
}