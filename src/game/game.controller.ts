
import { gameService } from "./game.service";
import { JwtAuthGuard } from "src/authentication/jwtStrategy/jwtguards";
import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { Request, } from 'express';

@Controller()
export class gameController{
    constructor(private gameService: gameService){}

    @Get('generategame')
    @UseGuards(JwtAuthGuard)
    async createGame(@Req() request: Request){
        // console.log(request.user['userId']);
        return await this.gameService.generateGame(request.user['userId'], 'gameName');
    }

    @Get('joingame')
    @UseGuards(JwtAuthGuard)
    async joinGame(@Req() request: Request){
        // console.log(request.query.gameid);
        const id: number = parseInt(request.query.gameid as string, 10);
        return await this.gameService.joinGame(id ,request.user['userId']);
    }

}