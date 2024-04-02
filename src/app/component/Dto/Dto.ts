
export type ChatData = {
    id : number,
    convId: number,
    userName: String,
    image: String,
    lastMessage: String,
    isOnline: Boolean,
    isRead: Boolean,
    isRoom: Boolean,
    createdAt: Date
}

export type ConvoData = {
    id : number,
    userName: String,
    image: String,
    messages?: Array <Object> 
}