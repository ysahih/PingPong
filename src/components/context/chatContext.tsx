import React, { SetStateAction } from 'react';
import { boolean, number } from 'yup';

type chatLabel = {chat: number, isRoom: boolean};

export class chatContext {
    label: chatLabel = {chat: 0, isRoom: false};
    setLabel: React.Dispatch<SetStateAction<chatLabel>> = () => {};
}

const ChatContext = React.createContext<chatContext | null>(null);

export default ChatContext;