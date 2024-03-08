import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength, ValidateIf, min, minLength } from "class-validator";


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

export class signupData{
    // @IsNotEmpty()
    // @IsString()
    // userName: string;
    
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(40,
        {message: 'lastName must be at most 16 characters long'})
    email: string;

    // @IsString()
    // @MinLength(6, {
    //     message: 'Password must be at least 6 characters long',
    // })
    // @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])/gm, {
    //     message: 'Password must contain at least one uppercase letter and one number and one lowercase letter',
    // })
    // @IsNotEmpty()
    // password: string;
    
    @MinLength(2,
        {message: 'lastName must be at least 2 characters long'})
    @MaxLength(20,
        {message: 'lastName must be at most 16 characters long'})
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @MinLength(2,
        {message: 'firstName must be at least 2 characters long'})
    @MaxLength(20,
        {message: 'firstName must be at most 16 characters long'})
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