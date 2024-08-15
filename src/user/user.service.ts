import { Injectable } from "@nestjs/common";
import { use } from "passport";
import { ChatData, ConvData, History, RoomUsers } from "src/Gateway/gateway.interface";
import { ROLE, Room, ROOMTYPE } from "@prisma/client";
import { prismaService } from "src/prisma/prisma.service";
import * as argon from "argon2"

@Injectable()
export class FriendsService {
  constructor(private prisma: prismaService) {}

  async SearchCantShow(UserId: number) {
    try {
      const blockedfriends = await this.prisma.friendRequest.findMany({
        where: {
          OR: [
            {
              receiverId: UserId,
              blocked: true,
            },
            {
              senderId: UserId,
              blocked: true,
            },
          ],
        },
        select: {
          id: true,
          senderId: true,
          sender: {
            select: {
              userName: true,
              image: true,
              id: true,
            },
          },
          receiver: {
            select: {
              id: true,
            },
          },
        }
      });
      const Blockedfriends = blockedfriends.map((request) => {
        const isSender = request.senderId === UserId;
        const friendData = isSender ? request.receiver : request.sender;
        return {
          id: friendData.id,
        };
      });
      return Blockedfriends;
    } catch (e) {
      return null;
    }
  }

  async getUserProfile(name: string, id: number) {
    try {
      const blocked = await this.SearchCantShow(id);
      const user = await this.prisma.user.findUnique({
        where: {
          userName: name,
        },
        select: {
          userName: true,
          image: true,
          id: true,
          lastName: true,
          firstName: true,
          level: true,
          winCounter: true,
          lossCounter: true,
          online: true,
          inGame: true,
        },
      });
      if (!user) return null;
      if (blocked.some((b) => b.id === user.id)) return null;
      return user;
    } catch (e) {
      return null;
    }
  }
  
  async searchUser(userName: string, id: number) {
    try {
      const user = await this.prisma.user.findMany({
        where: {
          userName: {
            contains: userName,
          },
        },
        select: {
          userName: true,
          image: true,
          id: true,
          level: true,
        },
      });
      if (user.length > 0)
      {
        const blocked = await this.SearchCantShow(id);
        const friends = await this.Friends(id);
        const sentInvits = await this.getSentInvits(id);
        friends.forEach((friend) => blocked.push({ id: friend.id }));
        blocked.push({ id: id });
        const filtered = user.filter((u) => !blocked.some((b) => b.id === u.id) && !sentInvits.some((s) => s.receiver.id === u.id));
        return { users: filtered, sentInvits: sentInvits};
      }
      return null;

    } catch (e) {
      return null;
    }
  }

  async searchUserById(id: number, UserId: number) {
    try {
      const blocked = await this.SearchCantShow(UserId);
      if (blocked.some((b) => b.id === id)) return null;
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          userName: true,
          image: true,
          id: true,
          online: true,
          level: true,
        },
      });
      if (!user) return null;
      return user;
    } catch (e) {
      return null;
    }
  }


  async sendFriendRequest(UserId: number, TargetId: number) {
    if (UserId === TargetId) {
      return null;
    }

    try {
      const check = await this.prisma.friendRequest.findFirst({
        where: {
          OR: [
            {
              AND: {
                receiverId: UserId,
                senderId: TargetId,
              },
            },
            {
              AND: {
                receiverId: TargetId,
                senderId: UserId,
              },
            },
          ],
        },
      });
      if (check) {
        return null;
      }
      const friend = await this.prisma.user.findUnique({
        where: {
          id: TargetId,
        },
      });
      if (!friend) {
        return null;
      }
      const friends = await this.prisma.friendRequest.create({
        data: {
          senderId: UserId,
          receiverId: TargetId,
        },
        select: {
          id: true,
          sender: {
            select: {
              userName: true,
              image: true,
              id: true,
              level: true,
            },
          },
          receiver: {
            select: {
              userName: true,
              image: true,
              id: true,
              level: true,
            },
          },
        },
      });

      return friends;
    } catch (e) {
      return null;
    }
  }

  async getfriendsRequest(UserId: number) {
    try {
      const friends = await this.prisma.friendRequest.findMany({
        where: {
          AND: {
            receiverId: UserId,
            blocked: false,
            accepted: false,
          },
        },
        select: {
          id: true,
          sender: {
            select: {
              userName: true,
              image: true,
              id: true,
              level: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return friends;
    } catch (e) {
      return null;
    }
  }

  async getSentInvits(UserId: number) {
    try {
      const friends = await this.prisma.friendRequest.findMany({
        where: {
          AND: {
            senderId: UserId,
            blocked: false,
            accepted: false,
          },
        },
        select: {
          id: true,
          receiver: {
            select: {
              userName: true,
              image: true,
              id: true,
              level: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return friends;
    } catch (e) {
      return null;
    }
  }

  async Friends(UserId: number) {
    try {
      const friends = await this.prisma.friendRequest.findMany({
        where: {
          OR: [
            {
              receiverId: UserId,
              accepted: true,
              blocked: false,
            },
            {
              senderId: UserId,
              accepted: true,
              blocked: false,
            },
          ],
        },
        select: {
          id: true,
          senderId: true,
          sender: {
            select: {
              userName: true,
              image: true,
              id: true,
              online: true,
              inGame: true,
              level: true,
            },
          },
          receiver: {
            select: {
              userName: true,
              image: true,
              id: true,
              online: true,
              inGame: true,
              level: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      const Friends = friends.map((request) => {
        // Determine if the user is the sender or receiver
        const isSender = request.senderId === UserId;
        const friendData = isSender ? request.receiver : request.sender;
        return {
          id: friendData.id,
          userName: friendData.userName,
          image: friendData.image,
          online: friendData.online,
          inGame: friendData.inGame,
          level: friendData.level,
        };
      });
      return Friends;
    } catch (e) {
      return null;
    }
  }

  async checkFriendRequest(UserId: number, TargetId: number) {
    try {
      const friends = await this.prisma.friendRequest.findFirst({
        where: {
          OR: [
            {
              AND: {
                receiverId: UserId,
                senderId: TargetId,
              },
            },
            {
              AND: {
                receiverId: TargetId,
                senderId: UserId,
              },
            },
          ],
        },
        select: {
          id: true,
          accepted: true,
          blocked: true,
        },
      });
      return friends;
    } catch (e) {
      return null;
    }
  }

  async getNotifications(UserId: number) {
    try {
      const Notifications = await this.prisma.user.findUnique({
        where: {
          id: UserId,
        },
        select: {
          notifications: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              image: true,
              userName: true,
              seen: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
      return Notifications;
    } catch (e) {
      return null;
    }
  }

  async newNotification(UserId: number,  userName: string, image: string, content: string) {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId: UserId,
          content: content,
          image: image,
          userName: userName,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          image: true,
          userName: true,
          seen: true,
        },
      });
      return notification;
    } catch (e) {
      return null;
    }
  }

  async NotificationsSeen(UserId: number) {
    try {
      const notifications = await this.prisma.notification.updateMany({
        where: {
          userId: UserId,
        },
        data: {
          seen: true,
        },
      });
      return notifications;
    } catch (e) {
      return null;
    }
  }

  async acceptFriendRequest(UserId: number, TargetId: number): Promise<any> {
    try {
      const check = await this.checkFriendRequest(UserId, TargetId);
      if (check && check.accepted) 
        return null;
      
      const friends = await this.prisma.friendRequest.updateMany({
        where: {
          AND: {
            receiverId: UserId,
            senderId: TargetId,
          },
        },
        data: {
          accepted: true,
        },
      });
      if (friends.count > 0) {
        const friend = await this.prisma.user.findUnique({
          where: {
            id: TargetId,
          },
          select: {
            userName: true,
            image: true,
            id: true,
            online: true,
            level: true,
          },
        });

        const user = await this.prisma.user.findUnique({
          where: {
            id: UserId,
          },
          select: {
            userName: true,
            image: true,
            id: true,
            online: true,
            level: true,
          },
        });
        return { reciever: friend, sender: user };
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async blockedFriens(UserId: number) {
    try {
      const blockedfriends = await this.prisma.friendRequest.findMany({
        where: {
          OR: [
            {
              receiverId: UserId,
              blocked: true,
              blockedById: UserId,
            },
            {
              senderId: UserId,
              blocked: true,
              blockedById: UserId,
            },
          ],
        },
        select: {
          id: true,
          senderId: true,
          sender: {
            select: {
              userName: true,
              image: true,
              id: true,
              level: true,
            },
          },
          receiver: {
            select: {
              userName: true,
              image: true,
              id: true,
              level: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const Blockedfriends = blockedfriends.map((request) => {
        const isSender = request.senderId === UserId;
        const friendData = isSender ? request.receiver : request.sender;
        return {
          id: friendData.id,
          userName: friendData.userName,
          image: friendData.image,
        };
      });
      return Blockedfriends;
    } catch (e) {
      return null;
    }
  }

  async Online(id: number, status: boolean) {
    try{
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          online: status,
        },
      });
      return user;
    }
    catch(e){
      return null;
    }
  }
  
  async blockFriendRequest(UserId: number, TargetId: number) {
    try {
      const check = await this.checkFriendRequest(UserId, TargetId);
      if (check && check.blocked) 
        return null;
      // check if the user is already blocked
      const friends = await this.prisma.friendRequest.updateMany({
        where: {
          OR: [
            {
              AND: {
                receiverId: UserId,
                senderId: TargetId,
              },
            },
            {
              AND: {
                receiverId: TargetId,
                senderId: UserId,
              },
            },
          ],
        },
        data: {
          accepted: false,
          blocked: true,
          blockedById: UserId,
        },
        
      });
      if (friends.count > 0) {
        const user = await this.prisma.user.findUnique({
          where: {
            id: TargetId,
          },
          select: {
            userName: true,
            image: true,
            id: true,
            level: true,
          },
        });
        return user;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async deleteFriendRequest(UserId: number, TargetId: number) {
    try {
      const check = await this.checkFriendRequest(UserId, TargetId);
      if (!check || check.accepted || check.blocked) 
        return null;
      const friends = await this.prisma.friendRequest.deleteMany({
        where: {
          OR: [
            {
              AND: {
                receiverId: UserId,
                senderId: TargetId,
              },
            },
            {
              AND: {
                receiverId: TargetId,
                senderId: UserId,
              },
            },
          ],
        },
      });
      if (friends.count > 0)
      {
        const user = await this.prisma.user.findUnique({
          where: {
            id: TargetId,
          },
          select: {
            userName: true,
            image: true,
            id: true,
            level: true,
          },
        });
        if (!user) return null;
        return user;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async setGameStatus(userId: number[], status: boolean) : Promise<boolean> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId[0],
        },
        data: {
          inGame: status,
        },


      });
      if (userId[1] != -1)
      {
        const user2 = await this.prisma.user.update({
          where: {
            id: userId[1],
          },
          data: {
            inGame: status,
          },
        });
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  async unblockFriendRequest(UserId: number, TargetId: number) {
    try {
      const friends = await this.prisma.friendRequest.updateMany({
        where: {
          OR: [
            {
              AND: {
                blockedById: UserId,
                receiverId: UserId,
                senderId: TargetId,
              },
            },
            {
              AND: {
                blockedById: UserId,
                receiverId: TargetId,
                senderId: UserId,
              },
            },
          ],
        },
        data: {
          blocked: false,
          accepted: false,
          blockedById: null,
        },
      });
      if (friends) await this.deleteFriendRequest(UserId, TargetId);
      else return null;
      return friends;
    } catch (e) {
      return null;
    }
  }

  async updatePassword(id: number, password: string) {
    try {
      const hash = await argon.hash(password);
      const user = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          hash: hash,
        },
      });
      return user;
    } catch (e) {
      return null;
    }
  }

  async getUserInfo(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          userName: true,
          id: true,
          lastName: true,
          firstName: true,
          hash: true,
        },
      });
      return user;
    } catch (e) {
      return null;
    }
  }

  async updateInfo(id: number, userName: string, firstName: string, lastName: string) {
    try {
      const oldinfo = await this.prisma.user.findUnique({
        where: {
          userName: userName,
        },
        select: {
          userName: true,
          lastName: true,
          firstName: true,
        },
      });
      if (oldinfo) {
        console.log("User already exists");
        return null;
      }
      const user = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          userName: userName,
          lastName: lastName,
          firstName: firstName,
        },
        select: {
          userName: true,
          id: true,
          email: true,
        },
      });
      return user;
    } catch (e) {
      return null;
    }
  }

  async Getconversation(id :number){

    try{
      const lastMessajes = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          conv: {
            // orderBy: {
            //   messages: {
            //     _count: "asc",
            //   },
            // },
            // select: {
            //   id: true,
            // },
            include: {
              users: {
                where: {
                  id: {
                    not: id,
                  },
                },
                select: {
                  id: true,
                  userName: true,
                  image: true,
                  online: true,
                  // inGame: true,
                },
              },
              messages: {
                orderBy: {
                  createdAt: "desc",
                },
                take: 1,
                select: {
                  // TODO: Take one message
                  content: true,
                  createdAt: true,
                  userId: true,
                  // readBy: {
                  //   select: {
                  //     users: {
                  //       select: {
                  //         id: true,
                  //       },
                  //     },
                  //   },
                  // },
                },
              },
            },
          },
          rooms: {
            select: {
              // isMuted: true,
              room: {
                include: {
                  messages: {
                    orderBy: {
                      id: 'desc',
                    },
                    take: 1,
                    select: {
                      // id: true,
                      content: true,
                      userId: true,
                      createdAt: true,
                    }
                  }
                }
              }
            }
          }
        },
      });

      // console.log("Menssages:", JSON.stringify(lastMessajes, null, 2));
  
      let sortedData = new Array<ChatData>();
  
      if (lastMessajes?.conv.length) {

        lastMessajes.conv.forEach((conv) => {
          let orgConv = new ChatData();
  
          if (conv?.users[0]) {
            orgConv.id = conv.users[0].id;
            orgConv.userName = conv.users[0].userName;
            orgConv.image = conv.users[0].image;
            orgConv.isOnline = conv.users[0].online;
            // FIXME: Check this
            // orgConv.hasNoAccess = !!blockedUsers.find(id => id.id === conv.users[0].id);
            orgConv.isRoom = false;
          }
          if (conv?.messages) {
            orgConv.lastMessage = conv.messages[0].content;
            orgConv.createdAt = conv.messages[0].createdAt;
          }
          if (orgConv)
            sortedData.push(orgConv);
        });
      }

      if (lastMessajes?.rooms.length) {
        lastMessajes.rooms.forEach((room) => {
          let orgRoom = new ChatData();
  
          // if (room?.) {
            orgRoom.id = room.room.id;
            orgRoom.userName = room.room.name;
            orgRoom.image = room.room.image;
            orgRoom.isOnline = false;
          // }
          // if (room?.room?.messages.length) {
            orgRoom.lastMessage = room.room.messages[0]?.content || '';
            orgRoom.createdAt = room.room.messages[0]?.createdAt || new Date(1970, 0, 1, 0, 0, 0, 0);
            orgRoom.isRoom = true;
            // orgRoom.hasNoAccess = room.isMuted;
          // }
          if (orgRoom)
            sortedData.push(orgRoom);
        });
      }

      // console.log(sortedData);

      sortedData.sort((user1, user2) => {
        return (user1.createdAt.getTime() - user2.createdAt.getTime());
      })

      // console.log(sortedData);

      return sortedData;
    }
    catch(e) {
      console.log(e);
      return null;
    }
  }

  async message(userId: number, withUserId: number, isRoom :number) {

    // console.log(userId);
    // console.log(withUserId);
    // console.log(isRoom);

    let convData = new ConvData();

    try {
      if (!isRoom)
      {
        const user = await this.prisma.user.findUnique({
          where: {
            id: withUserId,
          },
          select: {
            id: true,
            userName: true,
            image: true,
            online: true,
            inGame: true,
            conv: {
              where: {
                AND: [
                  {users: {some: {id: userId}}},
                  {users: {some: {id: withUserId}}},
                ],
              },
              select:{
                // users: {
                //   where: {
                //     id: {
                //       not: userId,
                //     },
                //   },
                //   select: {
                //     online: true,
                //     inGame: true,
                //   }
                // },
                messages: {
                  orderBy: {
                    id: 'asc',
                  },
                  select: {
                    content: true,
                    userId: true,
                    createdAt: true,
                  }
                }
              }
            },
          },
        });

        // console.log(JSON.stringify(user, null, 2));

        const blockedUsers = await this.SearchCantShow(userId);

        if (user){
          convData.id = user.id;
          convData.userName = user.userName;
          convData.image = user.image;
          convData.inGame = user.inGame;
          convData.online = user.online;
          convData.messages = user.conv[0]?.messages || [];
          convData.hasNoAccess = !!blockedUsers.find(id => id.id === withUserId);
        }
      }
      else {
        const room = await this.prisma.room.findUnique({
          where: {
            id: withUserId,
          },
          include: {
            users: {
              where: {
                userId: userId,
              },
              select: {
                id: true,
                isMuted: true,
              },
            },
            messages: {
              orderBy: {
                id: 'asc',
              },
              select: {
                content: true,
                userId: true,
                createdAt: true,
                user: {
                  select: {
                    userName: true,
                  }
                }
              }
            }
          }
        });

        // console.log(room);

        if (room.users.length) {
          // const data = await this.prisma.room.findUnique({
          //   where: {
          //     id: withUserId,
          //   },
          //   include: {
          //     messages: {
          //       orderBy: {
          //         id: 'asc',
          //       },
          //       select: {
          //         content: true,
          //         userId: true,
          //         createdAt: true,
          //         user: {
          //           select: {
          //             userName: true,
          //           }
          //         }
          //       }
          //     }
          //   }
          // });

          convData.id = room.id;
          convData.userName = room.name;
          convData.image = room.image;
          convData.inGame = false;
          convData.online = false;
          convData.hasNoAccess = room.users[0].isMuted;
          convData.messages = room.messages.map(msj => {
            return {
              content: msj.content,
              createdAt: msj.createdAt,
              userId: msj.userId,
              userName: msj.user.userName,
            }
          });
        }
      }
      console.log(convData);
      // console.log(user);
      // console.log('--------------------------')
      return (convData);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async updateResult(userId :number, opponentId: number, result :string, level ?:number) {

    try {
      if (result)
      {
        if (result == "L")
          { await this.prisma.user.update({
          where:{
            id: userId,
          },
          data:{
            lossCounter:{
              increment: 1,
            }
          }
        })
      }else{
        await this.prisma.user.update({
          where:{
            id: userId,
          },
          data:{
            winCounter:{
              increment: 1,
            }
          }
        })
      }
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            history: {
              create: {
                result: result,
                opponentId: opponentId,
              },
            },
          },
        });
      }

      if (level) {
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            level: level,
          },
        });
      }
      


    } catch (e) {
      return null;
    }
  }


  async updateAchievement(userId :number, achievement :number) {
    try{
      
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { achievement: true,
         },
      });
      if (!user)
        throw new Error('User not found');
      console.log( "data",  userId ,  achievement);
      
      const newAchievement = [...user.achievement, achievement];
      await this.prisma.user.update({
        where: { id: userId },
        data: { achievement: newAchievement },
      });    
    }
    catch(e){
      return null;
    }
  }


  async getRankingHistory(id: number){
    try {
      const users = await this.prisma.user.findMany({
        take: 10,
        orderBy: {
            level: 'desc' // This will order the users by level in descending order
        },
        select:{
          userName: true,
          image: true,
          level: true,
          winCounter: true,
          lossCounter: true,
        }
    });

      const User = await this.prisma.user.findUnique({
        where:{
          id: id
        },
        select:{
          userName: true,
          image: true,
          level: true,
          winCounter: true,
          lossCounter: true,
        }
      })
      if (!User) return null;
      const rank = await this.prisma.user.count({
        where: {
          level: {
            gt: User.level // Count users with level greater than the user's level
          }
        }
      });

      users.forEach((user, index) => {
        if (user.userName === User.userName)
          user['rank'] = index + 1;
      });
      if (rank + 1 > 10)
        users.push(User);
      users.forEach((user, index) => {
        if (user.userName === User.userName)
          user['rank'] = rank + 1;
        else 
          user['rank'] = index + 1;
      }
      );

      console.log( ">>>>>>>>>>>" ,users);

      return users;
  }
    catch(e){
      return null
    }
  }

  async getAchievements(userName: string){
    try{
      const user = await this.prisma.user.findUnique({
        where:{
          userName: userName
        },
        select:{
          achievement: true,
        }
      })
      return user.achievement;
    }
    catch(e){
      return null;
    }
  }


  async getHistory(userId :number) {

    try {
      const result = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          history: {
            orderBy: {
              id: 'desc',
            },
            select: {
              result: true,
              opponentId: true,
            },
          },
        },

      });

      // console.log("Result:", result);
      if (result?.history?.length)
      {
        const newResultPromise = result.history.map(async (res) : Promise<History> => {
          const user = await this.prisma.user.findUnique({
            where: {
              id: res.opponentId,
            },
            select: {
              userName: true,
              image: true,
              level: true,
            },
          });

          return {
            userName: user.userName,
            image: user.image,
            result: res.result,
            level: user.level,
          }
        });

        const newResult = await Promise.all(newResultPromise);
        // console.log("NewResult:", newResult);
        return newResult;    
      }

      return result;
    } catch (e) {
      return null;
    }
  }

  async createRoom(userId: number, name: string, type: ROOMTYPE, password: string, fileURL: string) {
    const newRoom = await this.prisma.room.create({
      data: {
        name: name,
        type: type,
        password: password && type === ROOMTYPE.PROTECTED ? password : null,
        image: fileURL || null,
        users: {
          create: {
            userRole: "OWNER",
            userId: userId,
          },
        },
      },
    });

    return newRoom;
  }

  async roomUsers(userId :number, id :number) {
    
    try {
      const user = await this.prisma.room.findUnique({
        where: {
          id: id,
        },
        include: {
          users: {
            where: {
              userId: userId,
            },
            select: {
              userId: true,
            }
          },
        }
      });

      if (!user.users.length)
        throw new Error('This user is not in the room');

      const users = await this.prisma.room.findMany({
        where: {
          id: id,
        },
        select: {
          id: true,
          type: true,
          image: true,
          users: {
            select: {
              userRole: true,
              isMuted: true,
              user: {
                select: {
                  id: true,
                  userName: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      // console.log(JSON.stringify(users[0], null, 2));

      if (users.length)
      {
        const orgUsers :RoomUsers[] = users[0].users.map(user => <RoomUsers>{
          roomId: users[0].id,
          userId: user.user.id,
          userName: user.user.userName,
          image: user.user.image,
          isMuted: user.isMuted,
          role: user.userRole,
        });

        orgUsers.sort((user1, user2) => {
          const role = {'OWNER': 0, 'ADMIN': 1, 'USER': 2};

          return role[user1.role] - role[user2.role];
        });

        const readyData = {
          id: users[0].id,
          type: users[0].type,
          image: users[0].image,
          users: orgUsers,
        }
        return (readyData);
      }
      return null;
    }
    catch (e) {
      console.log(e.message);
      return (null);
    }
  }

  async userState(curUser :number, roomId :number, role: ROLE, isMuted :boolean, userId :number) {

    const checkCurUser = await this.prisma.userRoom.findUnique({
      where: {
        userId_roomId: {
          userId: curUser,
          roomId: roomId,
        }
      },
      select: {
        userRole: true,
      }
    });

    const checkUser = await this.prisma.userRoom.findUnique({
      where: {
        userId_roomId: {
          userId: userId,
          roomId: roomId,
        }
      },
      select: {
        userRole: true,
      }
    });

    console.log(checkCurUser);

    // if (!(checkCurUser && (checkCurUser.userRole === 'OWNER' || checkCurUser.userRole === 'ADMIN')))
    //   throw new Error('This user has no privileges !');

    // If both users aren't there
    // If curUser is User
    // If curUser ADMIN and User is Owner

    if (!curUser || !checkUser || checkCurUser.userRole === 'USER' || checkUser.userRole === 'OWNER')
      throw new Error('This user can not set privileges !');

    await this.prisma.userRoom.update({
      where: {
        userId_roomId: {
          userId: userId,
          roomId: roomId,
        },
      },
      data: {
        userRole: role,
        isMuted: isMuted,
      }
    });
  }

  async getRooms(id: number, name :string) {

    try {
      let rooms = await this.prisma.room.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
          NOT: {
            OR: [
              {users: {some: {userId: id}}},
              {type: 'PRIVATE'},
              {banned: {some: {id: id}}},
            ]
          }
        },
        select: {
          id: true,
          name: true,
          type: true,
          image: true,
          users: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!name)
        rooms = rooms.sort((room1, room2) => {
          return -(room1.users.length - room2.users.length);
        });

      // console.log('Users:', sortedRooms);

      return rooms.map((room) => {
        return {
          id: room.id,
          name: room.name,
          image: room.image,
          type: room.type
        };
      });

    } catch (e) {
      return null;
    }
  }

  async joinRoom(id :number, roomId :number, password ?:string) {
    
    try {
      const room = await this.prisma.room.findUnique({
        where: {
          id: roomId,
        },
        include: {
          users: {
            where: {
              userId: id,
            },
            select: {
              user: {
                select: {
                  id: true,
                }
              }
            },
          },
          banned: {
            where: {
              id: id,
            },
            select: {
              id: true,
            }
          },
          invites: {
            where: {
              id: id,
            },
            select: {
              id: true,
            }
          }
        },
      });

      // console.log(JSON.stringify(room, null, 2));

      if (room?.users?.length)
        return {status: 0, message: 'This user already in the room !'};
      if (room?.banned?.length)
        return {status: 0, message: 'This user is banned !'};
      if (room?.type === 'PRIVATE' && !room?.invites.length)
        return {status: 0, message: 'This room is private, You need invitation !'};

      var isPassword :boolean = true;

      if (room.type === 'PROTECTED')
        isPassword = await argon.verify(room.password, password);

      if (isPassword)
      {
        await this.prisma.userRoom.create({
          data: {
            userId: id,
            roomId: roomId,
          }
        });

        if (room.type === 'PRIVATE')
          await this.prisma.user.update({
            where: {
              id: id,
            },
            data: {
              roomInvites: {
                disconnect: {
                  id: roomId,
                },
              }
            }
          });

        return {status: 1, message: 'User joined successfully !'};
      }
      return {status: 0, message: 'Incorect password !'};

    } catch (e) {
      console.log(e);
      return {status: 0, message: 'Something wrong !'};
    }
  }

  async kickUserFromRoom(adminId :number, userId :number, roomId :number, ban :boolean) {

    try {
      const adminInRoom = await this.prisma.userRoom.findUnique({
        where: {
          userId_roomId: {
            userId: adminId,
            roomId: roomId,
          }
        },
        select: {
          userRole: true,
        }
      });

      const userInRoom = await this.prisma.userRoom.findUnique({
        where: {
          userId_roomId: {
            userId: userId,
            roomId: roomId,
          }
        },
        select: {
          userRole: true,
        }
      });

      // Who want to make change has to be Owner or Admin
      // If he want to be admin then the other user should be USER
      if (adminInRoom && userInRoom && (adminInRoom.userRole === 'OWNER' || (adminInRoom.userRole === 'ADMIN' && userInRoom.userRole === 'USER'))) {

        await this.prisma.userRoom.delete({
          where: {
            userId_roomId: {
              userId: userId,
              roomId: roomId,
            },
          },
        });

        if (ban) {
          await this.prisma.room.update({
            where: {
              id: roomId,
            },
            data: {
              banned: {
                connect: [
                  {id: userId},
                ],
              },
            },
          });
          // await this.prisma.room.update({
          //   where: {
          //     id: roomId,
          //   },
          //   data: {
          //     banned: {
          //       create: [
          //         {id: userId},
          //       ]
          //     }
          //   }
          // });
        }

        return {status: 1, message: 'user kicked !'};
      }
      
      return {status: 0, message: `You don't have privileges !`};
    } catch (e) {
      return {status: 0, message: `User didn't get kicked !`};
    }
  }

  async updateRoom(userId :number, roomId: number, newName ?:string, type ?:ROOMTYPE, url ?:string, password ?:string) {

    // TODO: I have to delete the OLD picture

    try {
      const room = await this.prisma.room.findUnique({
        where: {
          id: roomId,
        },
        include: {
          users: {
            where: {
              userId: userId,
            },
            select: {
              userRole: true,
              user: {
                select: {
                  userName: true,
                },
              },
            },
          },
        },
      });

      console.log("Room:", JSON.stringify(room, null, 2));

      if (room && room?.users[0]?.userRole === 'OWNER') {

        const obj :{name ?:string, type ?:ROOMTYPE, password ?:string, image ?:string} = {};

        if (newName)
          obj.name = newName;
        if (type)
          obj.type = type;
        if (type === ROOMTYPE.PROTECTED && password)
          obj.password = password;
        else
          obj.password = null;
        if (url)
          obj.image = url;

          const data = await this.prisma.room.update({
            where: {
              id: roomId,
            },
            data: {
              ...obj,
              // name: name,
              // type: type,
              // password: password || null,
              // image: url || null,
            },
          });

          return {status: 1, message: 'Room updated successfully!', data: data};
      }
      return {status: 0, message: "This user does not have privileges !"};
    } catch (e) {
      return {status: 0, message: 'Something wrong !'};
    }
  }

  async getRoom(userId: number, name :string) {

    const data = await this.prisma.room.findUnique({
      where: {
        name: name,
      },
      select: {
        type: true,
        id: true,
        users: {
          where: {
            userId: userId,
          },
          select: {
            id: true,
          }
        }
      }
    });

    if (data.users?.length)
        return ({
          id: data.id,
          type: data.type,
        });
    return null;
  }

  async leaveRoom(userId: number, roomId :number) {

    console.log(roomId);
    console.log(userId);
    try {
      const user = await this.prisma.room.findUnique({
        where: {
          id: roomId,
        },
        include: {
          users: {
            where: {
              userId: userId,
            },
            select: {
              userRole: true,
              user: {
                select: {
                  userName: true,
                  id: true,
                },
              },
            },
          },
        }
      });

      if (user.users.length) {
        const userLeaved = await this.prisma.userRoom.delete({
          where: {
            userId_roomId: {
              userId: userId,
              roomId: roomId,
            },
          },
        });

        
        if (user.users[0].userRole === 'OWNER') {
          const data = await this.prisma.room.findMany({
            select: {
              users: {
                orderBy: {
                  joinedAt: 'asc',
                },
                // skip: 1,
                take: 1,
                select: {
                  user: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          });

          if (data[0]?.users?.length) {
            await this.prisma.userRoom.update({
              where: {
                userId_roomId: {
                  userId: data[0].users[0].user.id,
                  roomId: roomId,
                },
              },
              data: {
                userRole: 'OWNER',
              },
            });
          }
          if (!data[0]?.users?.length) {
            await this.prisma.room.delete({
              where: {
                id: roomId,
              },
            });
            return {status: 1, message: "User leaved the room, Room will be deleted !", deleted: 1};
          }
          // console.log(data);
          return {status: 1, message: "User leaved the room", ownerId: data[0]?.users[0]?.user.id};
        }

        return {status: 1, message: "User leaved the room"};
      }
      return {status: 0, message: 'User is not in the room'};

    } catch (e) {
      console.log(e);
      return {status: 0, message: 'Something wrong'};
    }
  }

  async roomInvites(id :number) {
    const invites = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        roomInvites: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    console.log('Invites:', JSON.stringify(invites, null, 2));

    return invites.roomInvites.length ? invites.roomInvites : [];
  }

  async getUsersToInvite(userId :number, roomId: number) {

    try {
      let nbUsers = 0;
      let usersInvited :{id: number, roomId: number, userName: string, pic :string}[] = []

      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
            sentRequests: {
              where: {
                AND: [
                  {accepted: true},
                  {
                    receiver: {
                      NOT: {
                        OR: [
                          {
                          bannedFrom: {
                            some: {
                              id: roomId,
                            },
                          },
                        },
                        {
                          rooms: {
                            some: {
                              roomId: roomId,
                            },
                          },
                        },
                        {
                          roomInvites: {
                            some: {
                              id: roomId,
                            },
                          },
                        },
                      ],
                      },
                    },
                  },
                ],
              },
              take: 5,
              select: {
                receiver: {
                  select: {
                    id: true,
                    userName: true,
                    image: true,
                    bannedFrom: true,
                  },
                },
              },
            },
            friendRequests: {
              where: {
                AND: [
                  {accepted: true},
                  {
                    sender: {
                      NOT: {
                        OR: [
                          {
                          bannedFrom: {
                            some: {
                              id: roomId,
                            },
                          },
                        },
                        {
                          rooms: {
                            some: {
                              roomId: roomId,
                            },
                          },
                        },
                        {
                          roomInvites: {
                            some: {
                              id: roomId,
                            },
                          },
                        },
                      ]
                      },
                    },
                  },
                ],
              },
              take: 5,
              select: {
                sender: {
                  select: {
                    id: true,
                    userName: true,
                    image: true,
                    bannedFrom: true,
                  },
                },
              },
            }
          },
      });

      // console.log(JSON.stringify(user, null, 2));

      // for (let person of user?.friendRequests) {
      //   console.log(person);
      // }
      // console.log('\n');
      // for (let person of user?.sentRequests) {
      //   console.log(person);
      // }

      if (user?.sentRequests.length) {
        nbUsers = user?.sentRequests.length > 5 ? 5 : user?.sentRequests.length;
        usersInvited = user?.sentRequests.map(user => {
          return {
            id: user.receiver.id,
            roomId: roomId,
            userName: user.receiver.userName,
            pic: user.receiver.image
          }
        });
      }

      if (nbUsers < 5) {
          for (let person of user?.friendRequests) {
            if (nbUsers >= 5)
                break ;
            // usersInvited = [...usersInvited, {id: person.sender.id, roomId: roomId, userName: person.sender.userName, pic: person.sender.image}];
            usersInvited.push({id: person.sender.id, roomId: roomId, userName: person.sender.userName, pic: person.sender.image});
            nbUsers++;
          }
      }

      if (nbUsers < 5) {

        const exclude :number[] = usersInvited.map(User => {
          const {id} = User;
          return id;
        });

        const newUsers = await this.prisma.user.findMany({
          where: {
            NOT: [
              {
                id: {
                  in: exclude,
                },
              },
              {bannedFrom: {
                some: {
                  id: roomId,
                }
              }},
              {roomInvites: {
                some: {
                  id: roomId,
                }
              }},
              {rooms: {
                some: {
                  roomId: roomId,
                },
              }},
            ],
          },
          take: 5 - nbUsers,
          orderBy: {
            id: 'desc',
          },
          select: {
            id: true,
            userName: true,
            image: true,
          },
        })
        // console.log("NewUser:", newUsers);
        for (let person of newUsers) {
          if (nbUsers >= 5)
              break ;
            console.log(person);
            // usersInvited = [...usersInvited, {id: person.sender.id, roomId: roomId, userName: person.sender.userName, pic: person.sender.image}];
          usersInvited.push({id: person.id, roomId: roomId, userName: person.userName, pic: person.image});
          nbUsers++;
        }
      }

      // console.log(usersInvited);

      return usersInvited;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async handleInviteUser(ownerId: number, userId: number, roomId: number) {

    console.log(userId);

    try {
      const checkOwer = await this.prisma.room.findUnique({
        where: {
          id: roomId,
        },
        include: {
          users: {
            where: {
              OR: [
              {userId: ownerId},
              {userId: userId},
              ],
            },
            select: {
              user: {
                select: {
                  id:true,
                  userName: true,
                }
              }
            }
          },
          banned: {
            where: {
              id: userId,
            },
            select: {
              id: true,
            }
          },
          invites: {
            where: {
              id: userId,
            },
            select: {
              id: true,
            }
          }
        },
      });

      console.log('Room:', JSON.stringify(checkOwer, null, 2));
      const owner = checkOwer.users[0]?.user.id === ownerId ? checkOwer.users[0]?.user : checkOwer.users[1]?.user;
      const user = checkOwer.users[0]?.user.id === userId ? checkOwer.users[0]?.user : checkOwer.users[1]?.user;

      if (!owner)
        return {status: 0, message: 'sender has no privileges !'};
      if (user)
        return {status: 0, message: 'User already in the room !'};
      else if (checkOwer?.banned.length)
        return {status: 0, message: 'User is banned !'};
      else if (checkOwer?.invites.length)
        return {status: 0, message: 'User is already invited !'};

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          roomInvites: {
            connect: {
              id: roomId,
            }
          }
        }
      });

      return {status: 1, message: 'User invited Successfully !'};
    } catch (e) {
      console.log(e);
      return {status: 0, message: 'Something Wrong !'};
    }
  }

  async inviteAccept(userId: number, roomId :number, accept :boolean) {
    try {
      const checkInvite = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          roomInvites: {
            where: {
              id: roomId,
            },
            select: {
              id: true,
            }
          }
        }
      });

      if (checkInvite?.roomInvites?.length) {

        if (accept)
          return this.joinRoom(userId, roomId);

        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            roomInvites: {
              disconnect: {
                id: roomId,
              },
            }
          }
        });

        return {status: 1, message: 'User denied the invite successfully !'};
      }

      return {status: 0, message: 'User has not privileges !'};

    } catch (e) {
      console.log(e);
      return {status: 0, message: 'Something wrong !'};
    }
  }

  async findUser(userId: number, roomId: number, name :string) {
    try {
      const mainUser = await this.prisma.user.findMany({
        where: {
            userName: {
            contains: name,
            mode: 'insensitive',
          },
          NOT: {
            id: userId,
          }
        },
        include: {
          bannedFrom: {
            where: {
              id: roomId,
            }
          },
          roomInvites: {
            where: {
              id: roomId,
            },
            select: {
              id: true,
            }
          },
          rooms: {
            where: {
              roomId: roomId,
            },
            select: {
              id: true,
            }
          }
        }
      });

      // console.log(mainUser);
      // console.log('\n');
      const newData = mainUser.filter(user => !user.bannedFrom.length && !user.roomInvites.length && !user.rooms.length).map(user => {
        return {
          id: user.id,
          roomId: roomId,
          userName: user.userName,
          pic: user.image,
        }
      })

      // console.log(newData);

      return newData;

    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async getBannedUsers(roomId :number, userId: number) {

    try {
      const checkOwner = await this.prisma.userRoom.findUnique({
        where: {
          userId_roomId: {
            roomId: roomId,
            userId: userId,
          },
        },
        select: {
          userRole: true,
        },
      });

      if (checkOwner.userRole === 'OWNER') {
        const users =  await this.prisma.room.findUnique({
          where: {
            id: roomId,
          },
          select: {
            banned: {
              select: {
                id: true,
                userName: true,
                image: true,
              },
            },
          },
        });

        return users.banned;
      }
      return [];
    } catch (e) {
      console.log(e);
      return []
    }
  }

  async unban(roomId :number, ownerId :number, userId :number) {

    console.log(roomId, ownerId, userId);

    try {
        const checkOwner = await this.prisma.userRoom.findUnique({
          where: {
            userId_roomId: {
              roomId: roomId,
              userId: ownerId,
            },
          },
          select: {
            userRole: true,
          },
        });

        if (checkOwner?.userRole === 'OWNER') {
          // this.prisma.user.update({
          //   where: {
          //     id: userId,
          //   },
          //   data: {
          //     bannedFrom: {
          //       delete: {
          //         id: roomId,
          //       },
          //     },
          //   },
          // });
          await this.prisma.room.update({
            where: {
              id: roomId,
            },
            data: {
              banned: {
                disconnect: [
                  {id: userId},
                ],
              }
            }
          });

          return {status: 1, message: 'Unban successfully !'}
        }
        return {status: 0, message: 'This user has no privileges !'}
    } catch (e) {
      console.log(e);
      return {status: 0, message: 'Something went wrong !'};
    }
  }

  async deleteRoom(ownerId :number, roomId :number) {
    try {
      const checkOwner = await this.prisma.userRoom.findUnique({
        where: {
          userId_roomId: {
            roomId: roomId,
            userId: ownerId,
          },
        },
        select: {
          userRole: true,
        }
      });

      if (checkOwner.userRole === 'OWNER') {
        const users = await this.prisma.room.findUnique({
          where: {
            id: roomId,
          },
          select: {
            invites: {
              select: {
                id: true,
              },
            },
            banned: {
              select: {
                id: true,
              }
            }
          }
        });

        console.log('Users:', JSON.stringify(users, null, 2));

        const banned = users.banned.map(user => ({id: user.id}));
        const invites = users.invites.map(user => ({id: user.id}));

        console.log('Banned:', banned);
        console.log('invites:', invites);

        const deleteUsers = await this.prisma.room.update({
          where: {
            id: roomId,
          },
          data: {
            users: {
              deleteMany: {}
            },
            banned: {
              disconnect: banned,
            },
            invites: {
              disconnect: invites,
            },
            messages: {
              deleteMany: {},
            }
          },
        });

        console.log('Delete', JSON.stringify(deleteUsers, null, 2));

        const data = await this.prisma.room.delete({
          where: {
            id: roomId,
          },
        });

        console.log('Delete', JSON.stringify(data, null, 2));
        return {status: 1, message: 'Room deleted successfully !'};
      }

      return {status: 0, message: 'User has no privileges !'};

    } catch (e) {
      console.log(e);
      return {status: 0, message: 'Something worng !'};
    }
  }
}
