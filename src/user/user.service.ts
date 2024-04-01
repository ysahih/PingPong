import { Injectable } from "@nestjs/common";
import { ChatData } from "src/Gateway/gateway.interface";
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
            orgConv.username = conv.users[0].userName;
            orgConv.image = conv.users[0].image;
          }
          if (conv?.messages) {
            orgConv.lastMessaeg = conv.messages[0].content;
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
}
