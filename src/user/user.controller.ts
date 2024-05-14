import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { FriendsService } from "./user.service";
import { JwtAuthGuard } from "src/authentication/jwtStrategy/jwtguards";
import { Request } from "express";
import { IsString } from "class-validator";
import { validate } from 'class-validator';
import { upadateInfo } from "src/authentication/dto/form";

@Controller("user")
export class UserController {
  constructor(private FriendsService: FriendsService) {}

  @Post("sendinvit")
  @UseGuards(JwtAuthGuard)
  async RequestFriend(@Query() id: string, @Req() req: Request) {
    console.log(id["id"]);
    const user = await this.FriendsService.sendFriendRequest(
      req.user["userId"],
      parseInt(id["id"])
    );
    return user;
  }

  @Get("invits")
  @UseGuards(JwtAuthGuard)
  async getFriendRequest(@Req() req: Request) {
    return await this.FriendsService.getfriendsRequest(req.user["userId"]);
  }

  @Get("friends")
  @UseGuards(JwtAuthGuard)
  async sendFriendRequest(@Req() req: Request) {
    return await this.FriendsService.Friends(req.user["userId"]);
  }

  @Post("accept")
  @UseGuards(JwtAuthGuard)
  async acceptFriendRequest(@Query() id: string, @Req() req: Request) {
    return await this.FriendsService.acceptFriendRequest(
      req.user["userId"],
      parseInt(id["id"])
    );
  }

  @Get("blocked")
  @UseGuards(JwtAuthGuard)
  async getBlocked(@Req() req: Request) {
    return await this.FriendsService.blockedFriens(req.user["userId"]);
  }

  @Patch("block")
  @UseGuards(JwtAuthGuard)
  async blockFriend(@Query() id: string, @Req() req: Request) {
    return await this.FriendsService.blockFriendRequest(
      req.user["userId"],
      parseInt(id["id"])
    );
  }

  @Patch("unblock")
  @UseGuards(JwtAuthGuard)
  async unblockFriend(@Query() id: string, @Req() req: Request) {
    return await this.FriendsService.unblockFriendRequest(
      req.user["userId"],
      parseInt(id["id"])
    );
  }

  @Get("search")
  @UseGuards(JwtAuthGuard)
  async searchUser(@Query() userName: string, @Req() req: Request){
    return await this.FriendsService.searchUser(userName["userName"], req.user['userId']);
  }

  @Get("userProfile")
  @UseGuards(JwtAuthGuard)
  async searchUserById(@Query() id: string, @Req() req: Request){
    return await this.FriendsService.searchUserById(parseInt(id['id']), req.user['userId']);
  }

  @Get('conversation')
  @UseGuards(JwtAuthGuard)
  async GetConversation(@Req() req : Request){
      return await this.FriendsService.Getconversation(req.user['userId']);
  }

  @Get('messages')
  @UseGuards(JwtAuthGuard)
  async GetMessages(@Req() req :Request) {

    return await this.FriendsService.message(req.user['userId'], Number(req.query['id']));
  }

  @Get('getSentInvits')
  @UseGuards(JwtAuthGuard)
  async getSentInvits(@Req() req : Request){
    return await this.FriendsService.getSentInvits(req.user['userId']);
  }
  
  @Get('Notifications')
  @UseGuards(JwtAuthGuard)
  async getNotifications(@Req() req : Request){
    return await this.FriendsService.getNotifications(req.user['userId']);
  }

  @Get('NotificationsSeen')
  @UseGuards(JwtAuthGuard)
  async NotificationsSeen(@Req() req : Request){
    return await this.FriendsService.NotificationsSeen(req.user['userId']);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Req() req : Request){
    return await this.FriendsService.getHistory(req.user['userId']);
  }

  @Get('rankingHistory')
  @UseGuards(JwtAuthGuard)
  async getRanking(@Req() req: Request){
    return await this.FriendsService.getRankingHistory(req.user['userId']);
  }

  @Post('/updateInfo')
  @UseGuards(JwtAuthGuard)
  async updateInfo(@Req() req : Request, @Body() user :  {
    userName: string,
    firstName:  string,
    lastName: string,
    password: string,
  }){
    // console.log('user ::', user);

    try {
      const userr = new upadateInfo();
      userr.userName = user.userName;
      userr.fullName = user.firstName + ' ' + user.lastName;
      userr.password = user.password;
      const errors = await validate(userr);
      // console.log('userr ::', errors);
    } catch (e) {
      console.log('error ::', e);
    }

    const userName = user.userName;
    // this.FriendsService.updateInfo(req.user['userId'], id['id'])
    return { "g": "success" };
  }
}
