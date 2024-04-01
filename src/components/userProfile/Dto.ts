

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

export type SentInvitsType = {
    id: number,
    receiver: {
        id: number,
        userName: string,
        image: string
    },
};

