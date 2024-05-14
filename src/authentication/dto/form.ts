import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength, ValidateIf, isNumber } from "class-validator";


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
  
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(40,
        {message: 'lastName must be at most 16 characters long'})
    email: string;

    
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


export class upadateInfo{
    @IsNotEmpty()
    // @IsString()
    @MinLength(4,
        {message: 'firstName must be at least 2 characters long'})
    @IsNumber(
        {allowNaN: false},
        {message: 'userName must be a number'}
    )
    userName: string;

    @MinLength(2,
        {message: 'lastName must be at least 2 characters long'})
    @MaxLength(20,
        {message: 'lastName must be at most 16 characters long'})
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsNotEmpty()
    @IsString()
    password: string;
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