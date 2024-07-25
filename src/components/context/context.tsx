import React from 'react';

export type UserData = {
    id       : number,
    createdAt: Date,
    updatedAt: Date,
    userName : string,
    email    : string,
    image    : string,
    firstName: string,
    lastName : string,
    online   : Boolean,
    twoFa    : Boolean,
    twoFaCheck: Boolean,
    setImage: (image: string) => void;
    setUserName: (userName: string) => void;
    setFirstName: (firstName: string) => void;
    setLastName: (lastName: string) => void;
    setEmail: (email: string) => void;
    level    : number,
    inGame   : Boolean,
    winCounter: number,
    lossCounter: number,
}


const UserDataContext = React.createContext<UserData | null>(null);

export default UserDataContext;