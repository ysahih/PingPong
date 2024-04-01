import React from "react";

export type InvitsType = {
    id: number,
    sender: {
        id: number,
        userName: string,
        image: string
    },
};

export type FriendsType = {
    id: number,
    userName: string,
    image: string,
    online: boolean,
};

export type ProfileData = {
    BlockedData: FriendsType[] | null,
    InvitsData: InvitsType[] | null,
    FriendsData: FriendsType[] | null,
};

const ProfileDataContext = React.createContext<ProfileData | null>(null);

export default ProfileDataContext;