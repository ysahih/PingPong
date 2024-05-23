import React, { SetStateAction } from 'react';

export class userState {
    state: {id: number, state: string} = { id: 0, state: '' };
    setState: React.Dispatch<SetStateAction<{id: number, state: string}>> = () => {};
}

const userStateContext = React.createContext<userState | null>(null);

export default userStateContext;