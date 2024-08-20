import { Injectable } from "@nestjs/common";
import { prismaService } from "src/prisma/prisma.service";

@Injectable()
export class gameService{
    constructor(private prism: prismaService){}
    async generateGame(UserId: number, name: string){

        const game = await this.prism.gameData.create({
            data:{
                gameName: name,
                users:{
                    connect:{
                        id: UserId,
                    }
                }
            },
            select:{
                    id: true,
            }
        })
        return game;
    }

    async joinGame(gameId: number, UserId: number){

        try{
            const gameData = await this.prism.gameData.findUnique({
                where: {
                  id: gameId,
                },
                include: {
                  users: true,
                },
              });
          
              if (gameData.users.length >= 2) {
                return { error: 'Maximum number of users reached for game with ID ' + gameId };
              }
            
            const data = await this.prism.gameData.update({
                where:{
                    id: gameId,
                },
                data:{
                    users:{
                        connect:{
                            id: UserId,
                        }
                    }
                },
                select:{
                    id: true,
                    users:{
                        select:{
                            id: true,
                            userName: true,
                        }
                    }
                }
            }) 
            // console.log(data);
            return data;
        }
        catch(e){
            return {error: gameId + ' is not a valid game id'}
        }
    }
}