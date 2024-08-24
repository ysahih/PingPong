import React, { SetStateAction } from 'react';

type chatLabel = {chat: number, isRoom: boolean};

interface label {
    id: number,
    isRoom: boolean,
}

const label = {
    id: 0,
    isRoom: false,
}


export class chatContext {
    label: label = label;
    setLabel: React.Dispatch<SetStateAction<label>> = () => {};
}

const ChatContext = React.createContext<chatContext | null>(null);

export default ChatContext;