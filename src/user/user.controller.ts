import { Body, Controller, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FriendsService } from "./user.service";
import { JwtAuthGuard } from "src/authentication/jwtStrategy/jwtguards";
import { Request } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { Prisma, ROLE, ROOMTYPE } from "@prisma/client";
import { cloudinaryService } from "src/authentication/cloudinary.service";
import * as argon from 'argon2'

@Controller("user")
export class UserController {
  constructor(private FriendsService: FriendsService, private cloud :cloudinaryService) {}

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

    // console.log('--------------------------')

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

  @Post('createRoom')
  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(JwtAuthGuard)
  async CreateRoom( @UploadedFile() file: Express.Multer.File, @Req() req :Request) :Promise<{status :number, message :string}> {

    const { name, type, password } : {name :string, type :ROOMTYPE, password :string} = req.body;

    console.log("Name:", name);
    console.log("Type:", type);
    console.log("Password:", password);

    console.log("File:", file);

    if (!name || (type === ROOMTYPE.PROTECTED && !password))
      return {status: 0, message: 'Invalid data !'};

  // try {
  //   const hashedPassword = (password && type === ROOMTYPE.PROTECTED) ? await argon.hash(password) : null;
  //   if (password && !hashedPassword)
  //     return {status: 0, message: 'Room did not create !'}

  //   const imgUrl = await this.cloud.uploadImage(file);

  //   await this.FriendsService.createRoom(parseInt(req.user["userId"]), name, type, hashedPassword, imgUrl);
  //   return {status: 1, message: 'Room Created !'};

  //   } catch (e) {
  //     if (e instanceof Prisma.PrismaClientKnownRequestError) {
  //       if (e.code === "P2002")
  //         return {status: 0, message: 'Room name already exists !'};
  //     }
  //     else
  //       return {status: 0, message: 'Room did not create !'}
  //   }
    return {status: 0, message: 'huh'};
  }

  @Post('userStatus')
  @UseGuards(JwtAuthGuard)
  async userStatus(@Body('role') role :ROLE, @Body('isMuted') isMuted :boolean, @Body('roomId') roomId :number, @Body('userId') userId :number, @Req() request :Request) {

    try {
      await this.FriendsService.userState(request.user['userId'], roomId, role, isMuted, userId);
      return ({status : true});
    } catch (e) {
      return ({status : false});

    }
  }

  @Get('roomUsers/:roomName')
  @UseGuards(JwtAuthGuard)
  async RoomUser(@Param('roomName') roomName :string, @Req() request :Request) {

    return await this.FriendsService.roomUsers(request.user['userId'], roomName);
  }

  @Get('getRooms')
  @UseGuards(JwtAuthGuard)
  async getRooms(@Req() request :Request) {

    return await this.FriendsService.getRooms(request.user['userId']);
  }

  @Post('joinRoom')
  @UseGuards(JwtAuthGuard)
  async joinRoom(@Body('id') id: number, @Req() request :Request , @Body('password') password ?:string) {

    return await this.FriendsService.joinRoom(request.user['userId'], id, password);
  }

  @Post('kickBanRoom')
  @UseGuards(JwtAuthGuard)
  async handleKickUser(@Req() request :Request, @Body('userId') userId :number, @Body('roomId') roomId :number, @Body('ban') ban :boolean) {

    return await this.FriendsService.kickUserFromRoom(request.user['userId'], userId, roomId, ban);
  }

  @Post('updateRoom')
  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(JwtAuthGuard)
  async handleUpdateRoom(@UploadedFile() file: Express.Multer.File, @Req() request :Request) {

    const { name, newName, type, password} : {name :string, newName :string, type :ROOMTYPE, password :string} = request.body;

    if (!name || (type === ROOMTYPE.PROTECTED && !password))
      return {status: 0, message: 'Invalid data !'};

      if (password)
        var hashedPass = await argon.hash(password);
    // const hashedPass = (password && type === ROOMTYPE.PROTECTED) ? await argon.hash(password) : null;

    if (password && !hashedPass)
      return {status: 0, message: 'Something wrong !'};

    if (file)
      var imgUrl :string = await this.cloud.uploadImage(file);

    return this.FriendsService.updateRoom(request.user['userId'], name, newName, type, imgUrl, hashedPass);
  }

  @Get('getRoom/:name')
  @UseGuards(JwtAuthGuard)
  async hadnleRoom(@Param('name') name :string) {
    try {
      return await this.FriendsService.getRoom(name);
    } catch (e) {
      return null;
    }
  }
}
