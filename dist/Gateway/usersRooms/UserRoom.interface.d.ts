export declare class User {
    id: number;
    username: string;
    socketId?: string[];
    rooms: Room[];
    DirectChat: Conversations[];
}
export interface Room {
    id: number;
    name: string;
    UserRole: 'OWNER' | 'ADMIN' | 'USER';
    type: 'PUBLIC' | 'PROTECTED' | 'PRIVATE';
}
export interface Conversations {
    id: number;
    toUserId: number;
}
