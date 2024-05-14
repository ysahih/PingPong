export declare class LoginData {
    email?: string;
    password: string;
    userName?: string;
}
export declare class signupData {
    email: string;
    lastName: string;
    firstName: string;
}
export type user = {
    email: string;
    userName: string;
    password: string;
    image: string;
    token: boolean;
};
export type gameData = {
    id: string;
    userId: number;
    gameName: String;
};
