import { Injectable } from "@nestjs/common";
import { ROLE, ROOMTYPE } from "@prisma/client";
import { ChatData, ConvData, RoomUsers } from "src/Gateway/gateway.interface";
import { prismaService } from "src/prisma/prisma.service";

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
            },
          },
          receiver: {
            select: {
              userName: true,
              image: true,
              id: true,
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
            },
          },
          receiver: {
            select: {
              userName: true,
              image: true,
              id: true,
              online: true,
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
            },
          },
          receiver: {
            select: {
              userName: true,
              image: true,
              id: true,
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

  async Getconversation(id :number){

    try{
      const lastMessajes = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          conv: {
            orderBy: {
              messages: {
                _count: "asc",
              },
            },
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
                },
              },
              messages: {
                orderBy: {
                  createdAt: "desc",
                },
                take: 1,
                select: {
                  content: true,
                  createdAt: true,
                  userId: true,
                  readBy: {
                    select: {
                      users: {
                        select: {
                          id: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
  
      let sortedData = new Array<ChatData>();
  
      if (lastMessajes?.conv) {
        lastMessajes.conv.forEach((conv) => {
          let orgConv = new ChatData();
  
          if (conv?.users[0]) {
            orgConv.id = conv.users[0].id;
            orgConv.userName = conv.users[0].userName;
            orgConv.image = conv.users[0].image;
          }
          if (conv?.messages) {
            orgConv.lastMessage = conv.messages[0].content;
            orgConv.createdAt = conv.messages[0].createdAt;
            if (conv?.messages[0].readBy) orgConv.isRead = true;
            else orgConv.isRead = false;
            orgConv.isRoom = false;
            // FIXME: This is should be handled
            orgConv.isOnline = orgConv.isRead;
          }
          if (orgConv) sortedData.push(orgConv);
        });
      }
  
      // console.log(sortedData);

      return sortedData;
    }
    catch(err)
      {
        return null
      }
  }

  async message(userId: number, withUserId: number, isRoom :boolean = false) {

    let user;
    let convData = new ConvData();

    try {
      if (!isRoom)
      {
        user = await this.prisma.user.findUnique({
          where: {
            id: withUserId,
          },
          select: {
            id: true,
            userName: true,
            image: true,
            conv: {
              where: {
                AND: [
                  {users: {some: {id: user}}},
                  {users: {some: {id: withUserId}}},
                ],
              },
            },
          },
        });

        if (user)
        {
          convData.id = user.id;
          convData.userName = user.userName;
          convData.image = user.image;
        }

        if (user?.conv)
        {
          const messages = await this.prisma.converstaion.findFirst({
            where: {
              AND: [
                {users: {some: {id: userId}}},
                {users: {some: {id: withUserId}}},
              ]
            },
            select: {
              messages: {
                orderBy: {
                  createdAt: 'asc',
                },
                select: {
                  content: true,
                  userId: true,
                },
              },
            },
          });

          convData.messages = messages ? messages.messages : [];
        }
      //   user = await this.prisma.converstaion.findFirst({
      //     where: {
      //       AND: [
      //         {users: {some: {id: userId}}},
      //         {users: {some: {id: withUserId}}},
      //       ]
      //     },
      //     select: {
      //       users: {
      //         where: {
      //           NOT: {
      //             id: userId,
      //           },
      //         },
      //         select: {
      //           id: true,
      //           userName: true,
      //           image: true,
      //         },
      //       },
      //       messages: {
      //         orderBy: {
      //           createdAt: 'asc',
      //         },
      //         select: {
      //           content: true,
      //           userId: true,
      //         },
      //       },
      //     },
      //   });
      // }
      // const convData :ConvData = {
      //   id: user.users[0].id,
      //   image: user.users[0].image,
      //   userName: user.users[0].userName,
      //   messages: user.messages,
      }
      // console.log(convData);
      // console.log(user);
      // console.log('--------------------------')
      return (convData);
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

  async roomUsers(roomName :string) {

    const users = await this.prisma.room.findMany({
      where: {
        name: roomName,
      },
      select: {
        id: true,
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

    // console.log(JSON.stringify(users, null, 2));

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

      console.log(orgUsers);

      orgUsers.sort((user1, user2) => {
        const role = {'OWNER': 0, 'ADMIN': 1, 'USER': 2};

        return role[user1.role] - role[user2.role];
      });

      console.log(orgUsers);

      return (orgUsers);
    }
    return (null);
  }

  async userState(roomId :number, role: ROLE, isMuted :boolean, userId :number) {

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
}
