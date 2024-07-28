import React, { SetStateAction } from 'react';

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