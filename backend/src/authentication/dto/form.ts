import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, ValidateIf } from "class-validator";


export class LoginData{

    @ValidateIf(o => !o.userName)
    @IsEmail()
    @IsNotEmpty()
    email? : string;

    
    @IsNotEmpty()
    @IsString()
    password: string;

    @ValidateIf(o => !o.email)
    @IsNotEmpty()
    @IsString()
    userName?: string;
}

export class SingupData{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])/gm, {
        message: 'Password must contain at least one uppercase letter and one number and one lowercase letter',
    })
    @MinLength(6, {
        message: 'Password must be at least 5 characters long',
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    userName: string;
    
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;
}

export type user = {
    email: string,
    userName: string,
    password: string,
    image: string,
    token: boolean,
}

export type gameData = {   
    id: string,
    userId :number,
    gameName: String,
}