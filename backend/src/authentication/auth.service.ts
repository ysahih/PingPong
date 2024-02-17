import { Injectable } from "@nestjs/common";
// import { User, GameData } from "@prisma/client";
import { prismaService } from "src/prisma/prisma.service";
import { LoginData, SingupData, gameData } from "./dto/form";
import * as argon from 'argon2';
import { use } from "passport";
// import { JwtService } from "@nestjs/jwt";

@Injectable({})
export class authService {
    constructor(private prism: prismaService,){};
    
    async singup(req: SingupData){
        console.log(req.password);
        try{
            const hash = await argon.hash(req.password);
            const data = await this.prism.user.create({
                data:{
                    email : req.email,
                    lastName : req.lastName,
                    firstName : req.firstName,
                    hash : hash,
                    userName : req.userName,
                }
            })
            if (data)
                delete data.hash;
            console.log(hash);
            return {'user': data};
        }
        catch (error){
            return {'error': error.message};
        }
    }

    
    
    async findUser(id :number)
    {
        const user = await this.prism.user.findUnique({
            where: {
                id
            }
        })
        if (user)
        {
            this.ValidateToken(user.email, true);
            delete user.hash;
        }
        if (user && !user.token)
            return null;
        return user || null;
    }



    async ValidateToken(email:string, bool: boolean)
    {
        await this.prism.user.update({
            where:{
                email,
            },
            data:{
                token : bool,
                online: bool,
            }
        })
    }

    async ValideteUser(email: string, userName: string, image: string)
    {
        const user = await this.prism.user.findUnique({
            where:{
                email
            },
        });
        if (user)
        {
            this.ValidateToken(email, true)
            return user;
        }

        else{
            const hash = await argon.hash('req.password');
            const data = await this.prism.user.create({
                data:{
                    email  : email,
                    hash : hash,
                    userName : userName,
                    firstName: 'hhhhh',
                    image: image,
                    token: true,
                },
            })
            return data;
        }
    }


    async  googlesingup() {

        return 'hello i\'m signin with google'
    };

    async googlesingin(){
        return 'hello';
    }

    async singin(req: LoginData){
        const user = await this.prism.user.findFirst({
            where: {
              OR: [
                { email: req.email },
                { userName: req.userName},
              ],
            },
          });
        console.log(req.email , "     ", req.userName)
        if (user && await argon.verify(user.hash, req.password))
        {
            delete user.hash;
            return {'user': user};
        }
        else
            return {'error' : 'password icorrect !!'};
    }
}