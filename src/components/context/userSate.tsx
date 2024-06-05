import React, { SetStateAction } from 'react';

export interface UserState {
    id: number;
    state: string;
  }
  
  export const UserStateContext = React.createContext<{
    userState: UserState;
    setUserState: React.Dispatch<SetStateAction<UserState>>;
  } | null>(null);

export default UserStateContext;