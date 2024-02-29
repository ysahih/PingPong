import React from 'react';

export type UserData = {
    id       : number,
    createdAt: Date,
    updatedAt: Date,
    userName : String,
    email    : String,
    image    : String,
    firstName: String,
    lastName : String,
    online   : Boolean,
}

const UserDataContext = React.createContext<UserData | null>(null);

export default UserDataContext;