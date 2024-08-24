

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

export type SentInvitsType = {
    id: number,
    receiver: {
        id: number,
        userName: string,
        image: string
        level: number,
    },
};

