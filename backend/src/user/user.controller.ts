import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/authentication/jwtStrategy/jwtguards';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private Userservice: UserService){}

    @Post('sendrequest')
    @UseGuards(JwtAuthGuard)
    RequestFriend(@Req() req : Request)
    {
        const json = req.body;
        return this.Userservice.sendFriendRequest(req.user['userId'], parseInt(json['id']))
    }

    @Post('get')
    @UseGuards(JwtAuthGuard)
    getFriendRequest(@Req() req : Request){
       return this.Userservice.FriendRequest(req.user['userId'])
    }

    @Post('/accept/:id')
    @UseGuards(JwtAuthGuard)
    acceptFriendRequest(@Req() req : Request){
        return this.Userservice.acceptFriendRequest(req.user['userId'], parseInt(req.params.id))
    }

}
