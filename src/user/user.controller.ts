import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FriendsService } from "./user.service";
import { JwtAuthGuard } from "src/authentication/jwtStrategy/jwtguards";
import e, { Request } from "express";
import { IsString } from "class-validator";
import { validate } from 'class-validator';
import { upadateInfo } from "src/authentication/dto/form";
import { FileInterceptor } from "@nestjs/platform-express";
import { Prisma, ROLE, ROOMTYPE } from "@prisma/client";
import { cloudinaryService } from "src/authentication/cloudinary.service";
import * as argon from 'argon2'
import { generateJwtToken } from "src/authentication/jwtStrategy/jwtToken";

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

  @Get("users/:name")
  @UseGuards(JwtAuthGuard)
  async getUsers(@Req() req: Request, @Param('name') name :string) {
    return await this.FriendsService.getUserProfile(name, req.user['userId']);
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

    return await this.FriendsService.message(req.user['userId'], Number(req.query['id']), Number(req.query['isRoom']));
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


  @Get('achievements/:userName')
  @UseGuards(JwtAuthGuard)
  async getAchievements(@Req() req : Request, @Param('userName') userName :string){
    return await this.FriendsService.getAchievements(userName);
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
  }, @Res() response : e.Response) {
    try {
      const userOldInfo = await this.FriendsService.getUserInfo(req.user['userId']);
    
      const userr = new upadateInfo();
      if (!user.userName) 
        userr.userName = userOldInfo.userName;
      else
        userr.userName = user.userName;
    
      if (!user.firstName)
        userr.firstName = userOldInfo.firstName;
      else
        userr.firstName = user.firstName;

      if (!user.lastName)
        userr.lastName = userOldInfo.lastName;
      else
        userr.lastName = user.lastName;

      const errors = await validate(userr);
      if (errors.length > 0) {
        response.send( {"message": errors.map(e => e.constraints) });
      }
      const update = await this.FriendsService.updateInfo(req.user['userId'], userr.userName, userr.firstName, userr.lastName);
      if (!update) {
        response.send({ "message": "userName already used!" });
      }
      if (update) {
        response.cookie("jwt", generateJwtToken(update), {
          httpOnly: true,
          secure: false,
          sameSite: "none", // Use 'none' in production with 'secure: true'
        }).send({  "g": "success"  });
        return { "g": "success" };
      }

    } catch (e) {
      console.log('error ::', e);
      response.send({ "message": "error" });
    }
  }

  @Post('UpdatePassword')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Req() req : Request, @Body() user : {CurrentPassword :string, NewPassword :string}) {
    try {
      const userOldInfo = await this.FriendsService.getUserInfo(req.user['userId']);
      const valid = await argon.verify(userOldInfo.hash, user.CurrentPassword);
      if (!valid) {
        return { "message": "Old password is wrong!" };
      }
      const update = await this.FriendsService.updatePassword(req.user['userId'], user.NewPassword);
      if (!update) {
        return { "message": "error" };
      }
      if (update) {
        return { "g": "success" };
      }
    } catch (e) {
      console.log('error ::', e);
      return { "message": "Error somthing wrong!" };
    }
  }

  @Post('createRoom')
  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(JwtAuthGuard)
  async CreateRoom( @UploadedFile() file: Express.Multer.File, @Req() req :Request) {

    const { name, type, password } : {name :string, type :ROOMTYPE, password :string} = req.body;

    if (!name || !type || (type === ROOMTYPE.PROTECTED && !password))
      return {status: 0, message: 'Invalid data !'};

  try {
    const hashedPassword = (password && type === ROOMTYPE.PROTECTED) ? await argon.hash(password) : null;
    if (password && !hashedPassword)
      return {status: 0, message: 'Room did not create !'}

    const imgUrl = await this.cloud.uploadImage(file);

    const room = await this.FriendsService.createRoom(parseInt(req.user["userId"]), name, type, hashedPassword, imgUrl);
    return {status: 1, message: 'Room Created !', roomId: room.id};

    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002")
          return {status: 0, message: `${name} room already exists !`};
      }
      else
        return {status: 0, message: 'Room did not create !'}
    }
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

  @Get('roomUsers/:id')
  @UseGuards(JwtAuthGuard)
  async RoomUser(@Param('id') id :string, @Req() request :Request) {

    return await this.FriendsService.roomUsers(request.user['userId'], parseInt(id));
  }


  @Get('getRooms')
  @UseGuards(JwtAuthGuard)
  async getRooms(@Req() request :Request, @Query("name") name :string) {

    return await this.FriendsService.getRooms(request.user['userId'], name);
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

    const { id, newName, type, password} : {id :string, newName :string, type :ROOMTYPE, password :string} = request.body;

    console.log('------------------------------------------------------------------------------\n');
    console.log("id:", id);
    console.log("newName:", newName);
    console.log("type:", type);
    console.log("password:", password);
    console.log('file:', file);

    if ( (parseInt(id) < 1) || (type === ROOMTYPE.PROTECTED && !password))
      return {status: 0, message: 'Invalid data !'};

    if (password)
        var hashedPass = await argon.hash(password);
      // const hashedPass = (password && type === ROOMTYPE.PROTECTED) ? await argon.hash(password) : null;

      if (password && !hashedPass)
        return {status: 0, message: 'Something wrong !'};
      
      if (file)
      var imgUrl :string = await this.cloud.uploadImage(file);
    
    console.log('------------------------------------------------------------------------------\n');
    
    return this.FriendsService.updateRoom(request.user['userId'], parseInt(id), newName, type, imgUrl, hashedPass);
  }

  @Get('getRoom/:name')
  @UseGuards(JwtAuthGuard)
  async hadnleRoom(@Req() request :Request, @Param('name') name :string) {
    try {
      return await this.FriendsService.getRoom(request.user['userId'], name);
    } catch (e) {
      return null;
    }
  }

  @Post('leave')
  @UseGuards(JwtAuthGuard)
  async handleLeave(@Req() request :Request, @Body('roomId') roomId :number) {

    return await this.FriendsService.leaveRoom(request.user['userId'], roomId);
  }

  @Get('roomInvites')
  @UseGuards(JwtAuthGuard)
  async getRoomInvites(@Req() request :Request) {

    return await this.FriendsService.roomInvites(request.user['userId']);
  }

  @Get('inviteUsers/:id')
  @UseGuards(JwtAuthGuard)
  async getUsersToInvites(@Req() request :Request, @Param('id') id :string) {

    return await this.FriendsService.getUsersToInvite(request.user['userId'], parseInt(id));
  }

  @Post('inviteUser')
  @UseGuards(JwtAuthGuard)
  async handleInviteUser(@Req() request :Request, @Body('roomId') roomId: number, @Body('invitedId') invitedId: number) {

    return await this.FriendsService.handleInviteUser(request.user['userId'], invitedId, roomId);
  }

  @Post('accInvite')
  @UseGuards(JwtAuthGuard)
  async invitationAccepta(@Req() request :Request, @Body('roomId') roomId :number, @Body('accept') accept :boolean) {

    return await this.FriendsService.inviteAccept(request.user['userId'], roomId, accept);
  }

  @Get('roomSearch/:roomId/:name')
  @UseGuards(JwtAuthGuard)
  async handleRoomSearch(@Req() request :Request, @Param('roomId') roomId :string, @Param('name') name :string) {

    // const {roomId} = request.body;
    console.log(roomId);
    console.log(name);

    return await this.FriendsService.findUser(request.user['userId'], parseInt(roomId) ,name);
  }

  @Get('ban/:roomId')
  @UseGuards(JwtAuthGuard)
  async getBannedUsers(@Req() request :Request, @Param('roomId') roomId :string) {
    return this.FriendsService.getBannedUsers(parseInt(roomId), request.user['userId']);
  }

  @Post('unban')
  @UseGuards(JwtAuthGuard)
  async handleUnban(@Req() request :Request, @Body('roomId') roomId :string, @Body('userId') userId :string) {
    return this.FriendsService.unban(parseInt(roomId), request.user['userId'], parseInt(userId));
  }

  @Post('deleteRoom')
  @UseGuards(JwtAuthGuard)
  async handleDeleteRoom(@Req() request :Request, @Body('roomId') roomId :string) {
    return this.FriendsService.deleteRoom(request.user['userId'], parseInt(roomId));
  }
}
