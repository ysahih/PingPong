import { flatten, Injectable } from "@nestjs/common";
import { ROOMTYPE } from "@prisma/client";
import { use } from "passport";
import {
  CreateRoom,
  MessageDTO,
  JoinRoomDTO,
  ChatData,
} from "src/Gateway/gateway.interface";
import { prismaService } from "src/prisma/prisma.service";

@Injectable()
export class GatewayService {
  constructor(private _prisma: prismaService) {}

  async findUser(id: number) {
    // const user = await this._prisma.user.findUnique({
    // 	where: {
    // 		id: id,
    // 	},
    // 	include: {
    // 		rooms: {
    // 			select: {
    // 				userRole: true,
    // 				room: {
    // 					select: {
    // 						name: true,
    // 						id: true,
    // 						type: true,
    // 					}
    // 				}
    // 			}
    // 		},
    // 		conv: {
    // 			select: {
    // 				id: true,
    // 				users: true,
    // 			},
    // 		},
    // 	},
    // });

    const user = await this._prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        userName: true,
        rooms: {
          select: {
            userRole: true,
            room: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
        conv: {
          select: {
            id: true,
            users: true,
          },
        },
      },
    });

    return user;
  }

  async getBlocked(user1 :number, user2 :number) :Promise<boolean> {

    // FIXME:  Keep working on this
    const user = await this._prisma.user.findUnique({
      where: {
        id: user1,
      },
      include: {
        friendRequests: {
          where: {
            senderId: user2,
          },
          select: {
            id: true,
            blocked: true,
          },
        },
        sentRequests: {
          where: {
            receiverId: user2,
          },
          select: {
            id: true,
            blocked: true,
          }
        }
      }
    });

    // console.log("Data:", user);

    return user.sentRequests[0]?.blocked || user.friendRequests[0]?.blocked;
  }

  async isMuted(roomId: number, userId :number) {
    const data = await this._prisma.room.findUnique({
      where: {
        id: roomId,
      },
      select: {
        users: {
          where: {
            userId: userId,
          },
          select: {
            isMuted: true,
          }
        }
      }
    });

    return data.users[0]?.isMuted;
  }

  async createConversation(payload: MessageDTO) {
    return await this._prisma.converstaion.create({
      data: {
        users: {
          connect: [{ id: payload.from }, { id: payload.to }],
        },
        messages: {
          create: {
            content: payload.message,
            userId: payload.from,
            createdAt: payload.createdAt,
            readBy: {
              create: { users: { connect: { id: payload.from } } },
            },
          },
        },
      },
    });
    // const newConv = await this._prisma.converstaion.create({
    //   data: {
    //     users: {
    //       connect: [{ id: payload.from }, { id: payload.to }],
    //     },
    //     messages: {
    //       create: {
    //         content: payload.message,
    //         userId: payload.from,
    //         createdAt: payload.createdAt,
    //         readBy: {
    //           create: { users: { connect: { id: payload.from } } },
    //         },
    //       },
    //     },
    //   },
    // });

    // return newConv;
  }

  async updateConversation(id: number, payload: MessageDTO) {

    await this._prisma.converstaion.update({
      where: {
        id: id,
      },
      data: {
        messages: {
          create: {
            content: payload.message,
            userId: payload.from,
            createdAt: payload.createdAt,
          },
        },
      },
    });
  }

  async updateConvRoom(payload: MessageDTO) :Promise<ChatData> {

      const data = await this._prisma.room.update({
        where: {
          id: payload.to,
        },
        data: {
          messages: {
            create: {
              content: payload.message,
              userId: payload.from,
              createdAt: payload.createdAt,
            }
          }
        },
        select: {
          image: true,
          name: true,
          users: {
            where: {
              userId: payload.from,
            },
            select: {
              isMuted: true,
              user: {
                select: {
                  userName: true,
                }
              }
            }
          }
        }
      });

      return {
        id: payload.to,
        image: data.image,
        userName: data.name,
        createdAt: payload.createdAt,
        lastMessage: payload.message,
        isRoom: true,
        fromName: data.users[0].user.userName,
        userId: payload.from,
        // hasNoAccess: data.users[0].isMuted,
        // Will be deleted !
        isOnline: false,
      }
  }

  // async createRoom(payload: CreateRoom, roomType: ROOMTYPE) {

  //   const newRoom = await this._prisma.room.create({
  //     data: {
  //       name: payload.name,
  //       type: roomType,
  //       image: payload.image ? payload.image: null,
  //       users: {
  //         create: {
  //           userRole: "OWNER",
  //           userId: payload.ownerId,
  //         },
  //       },
  //     },
  //   });

  //   return newRoom;
  // }

  async findRoom(id: number, userId: number) {
    // console.log(id, userId);
    const foundedRoom = await this._prisma.room.findUnique({
      where: {
        id: id,
      },
      // select: {
      //   id: true,
      //   name: true,
      //   type: true,
      //   users: {
      //     select: {
      //       user: {
      //         select: {
      //           id: true,
      //         }
      //       }
      //     }
      //   }
      // },
      include : {
        users: {
          where: {
            user: {
              id: userId,
            },
          },
          select: {
            userRole: true,
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

    // console.log(JSON.stringify(foundedRoom, null, 2));

    return foundedRoom;
  }

  // async joinRoom(id: number, payload: JoinRoomDTO) {
  //   await this._prisma.room.update({
  //     where: {
  //       id: id,
  //     },
  //     data: {
  //       users: {
  //         create: {
  //           userId: payload.userId,
  //         },
  //       },
  //     },
  //   });
  // }

  // async findMessage(id: number) {
  //   const message = await this._prisma.message.findMany({
  //     where: {
  //       id: {
  //         in: [1, 2],
  //       },
  //     },
  //     include: {
  //       readBy: {
  //         include: {
  //           users: true,
  //         },
  //       },
  //       conv: true,
  //       user: true,
  //       room: true,
  //     },
  //   });

  //   return message;
  // }

  // async allConversations(id: number) {
  //   const lastMessajes = await this._prisma.user.findUnique({
  //     where: {
  //       id: id,
  //     },
  //     select: {
  //       conv: {
  //         orderBy: {
  //           messages: {
  //             _count: "asc",
  //           },
  //         },
  //         include: {
  //           users: {
  //             where: {
  //               id: {
  //                 not: id,
  //               },
  //             },
  //             select: {
  //               id: true,
  //               userName: true,
  //               image: true,
  //             },
  //           },
  //           messages: {
  //             orderBy: {
  //               createdAt: "desc",
  //             },
  //             take: 1,
  //             select: {
  //               content: true,
  //               createdAt: true,
  //               userId: true,
  //               readBy: {
  //                 select: {
  //                   users: {
  //                     select: {
  //                       id: true,
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   let sortedData = new Array<ChatData>();

  //   if (lastMessajes?.conv) {
  //     lastMessajes.conv.forEach((conv) => {
  //       let orgConv = new ChatData();

  //       if (conv?.users[0]) {
  //         orgConv.id = conv.users[0].id;
  //         orgConv.userName = conv.users[0].userName;
  //         orgConv.image = conv.users[0].image;
  //       }
  //       if (conv?.messages) {
  //         orgConv.lastMessage = conv.messages[0].content;
  //         orgConv.createdAt = conv.messages[0].createdAt;
  //         // orgConv.isRead = !!conv.messages[0].readBy.users.find(user => user.id === id);
  //         orgConv.isRoom = false;
  //         // FIXME: This is should be handled
  //         orgConv.isOnline = orgConv.isRead;
  //       }
  //       // if (conv.users && conv.messages)
  //       // {
  //       //   console.log('Entered !!');
  //       //   let organizedConv :ChatData = {
  //       //     id: conv.users[0].id,
  //       //     username: conv.users[0].userName,
  //       //     image: conv.users[0].image,
  //       //     lastMessaeg: conv.messages[0].content,
  //       //     createdAt: conv.messages[0].createdAt,
  //       //     // isOnline:
  //       //     isRead: !!conv.messages[0].readBy.users.find(userid => userid.id === id),
  //       //     isRoom: false,
  //       //   }
  //       if (orgConv) sortedData.push(orgConv);
  //       // }
  //     });
  //   }

  //   // console.log(sortedData);

  //   // return lastMessajes;
  //   return sortedData;
  // }

  // async message(userId: number, withUserId: number, isRoom: boolean = false) {
  //   if (!isRoom) {
  //     const user = await this._prisma.converstaion.findFirst({
  //       where: {
  //         AND: [
  //           { users: { some: { id: userId } } },
  //           { users: { some: { id: withUserId } } },
  //         ],
  //       },
  //       select: {
  //         users: {
  //           where: {
  //             NOT: {
  //               id: userId,
  //             },
  //           },
  //           select: {
  //             id: true,
  //             userName: true,
  //             image: true,
  //           },
  //         },
  //         messages: {
  //           orderBy: {
  //             createdAt: "desc",
  //           },
  //           select: {
  //             content: true,
  //             userId: true,
  //           },
  //         },
  //       },
  //     });
  //     // console.log(user);
  //   }
  // }

  // async uniqueConvo(senderId: number, receiverId: number, message: string, createdAt :Date) {

  //   const user = await this._prisma.converstaion.findFirst({
  //     where: {
  //       AND: [
  //         {users: {some: {id: senderId}}},
  //         {users: {some: {id: receiverId}}},
  //       ],
  //     },
  //     include: {
  //       users: {
  //         where: {
  //           NOT: {
  //             id: receiverId,
  //           },
  //         },
  //         select: {
  //           id: true,
  //           userName: true,
  //           image: true,
  //           online: true,
  //           inGame: true,
  //         },
  //       },
  //     },
  //   });

  //   // console.log(user);

  //   const convo :ChatData = {
  //     id: user.users[0].id,
  //     userName: user.users[0].userName,
  //     image: user.users[0].image,
  //     lastMessage: message,
  //     createdAt: createdAt,
  //     isOnline: user.users[0].online,
  //     isRoom: user.users[0].inGame,
  //     // hasNoAccess: false,
  //   }

  //   // console.log(convo);

  //   return (convo);
  // }

  async getUser(id: number, message :string, createdAt :Date) :Promise<ChatData>{
    const user = await this._prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
          userName: true,
          image: true,
          online: true,
          inGame: true,
      }
    });

    return {
      id: id,
      userId: id,
      userName: user.userName,
      image: user.image,
      isOnline: user.online,
      createdAt: createdAt,
      lastMessage: message,
      isRoom: false,
      // hasNoAccess: false,
    }
  }

  // async uniqueConvo(senderId: number, receiverId: number, message: string) {

  //   const user = await this._prisma.converstaion.findFirst({
  //     where: {
  //       AND: [
  //         {users: {some: {id: senderId}}},
  //         {users: {some: {id: receiverId}}},
  //       ],
  //     },
  //     include: {
  //       users: {
  //         where: {
  //           NOT: {
  //             id: receiverId,
  //           },
  //         },
  //         select: {
  //           id: true,
  //           userName: true,
  //           image: true,
  //           online: true,
  //           inGame: true,
  //         },
  //       },
  //       // messages: {
  //       //   take: 1,
  //       //   orderBy: {
  //       //     createdAt: 'desc',
  //       //   },
  //       //   select: {
  //       //     content: true,
  //       //     createdAt: true,
  //       //     userId: true,
  //       //   },
  //       // },
  //     },
  //   });

  //   // console.log(user);

  //   const convo :ChatData = {
  //     id: user.users[0].id,
  //     userName: user.users[0].userName,
  //     image: user.users[0].image,
  //     lastMessage: message,
  //     createdAt: createdAt,
  //     isOnline: user.users[0].online,
  //     isRoom: user.users[0].inGame,
  //     isRead: false,
  //   }

  //   // console.log(convo);

  //   return (convo);
  // }

  async userInfogame(id: number) {

		const user = await this._prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				id: true,
				userName: true,
				image: true,
        level: true,
        achievement: true,
        winCounter :true ,
			}
		});
    return (user);
	}


  async getInvite(userId: number, roomId: number) {

    try {

      const data = await this._prisma.room.findUnique({
        where: {
          id: roomId,
        },
        include: {
          invites: {
            where: {
              id: userId,
            },
            select: {
              id: true,
            }
          },
        },
      });

      // console.log(data.invites[0]);

      return data.invites[0] ? data : null;
    } catch (e) {
      return null;
    }
  }

}
