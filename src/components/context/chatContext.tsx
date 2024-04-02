import React, { SetStateAction } from 'react';

export class chatContext {
    chat: number = 0 ;
    setChat: React.Dispatch<SetStateAction<number>> = () => {};
}

const ChatContext = React.createContext<chatContext | null>(null);

export default ChatContext;