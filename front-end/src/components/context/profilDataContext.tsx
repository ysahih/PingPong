import React from "react";

export type InvitsType = {
    id: number,
    sender: {
        id: number,
        userName: string,
        image: string
        level: number,
    },
};

export type FriendsType = {
    id: number,
    userName: string,
    image: string,
    online: boolean,
    inGame: boolean,
    level: number,
};

export type ProfileData = {
    BlockedData: FriendsType[] | null,
    InvitsData: InvitsType[] | null,
    FriendsData: FriendsType[] | null,
};

const ProfileDataContext = React.createContext<ProfileData | null>(null);

export default ProfileDataContext;