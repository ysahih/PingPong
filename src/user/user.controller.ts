import {
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { FriendsService } from "./user.service";
import { JwtAuthGuard } from "src/authentication/jwtStrategy/jwtguards";
import { Request } from "express";

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

  @Get('getSentInvits')
  @UseGuards(JwtAuthGuard)
  async getSentInvits(@Req() req : Request){
    return await this.FriendsService.getSentInvits(req.user['userId']);
  }
  
}
