import { flatten, Injectable } from "@nestjs/common";
import { ROOMTYPE } from "@prisma/client";
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

  async createConversation(payload: MessageDTO) {
    const newConv = await this._prisma.converstaion.create({
      data: {
        users: {
          connect: [{ id: payload.from }, { id: payload.to }],
        },
        messages: {
          create: {
            content: payload.message,
            userId: payload.from,
            readBy: {
              create: { users: { connect: { id: payload.from } } },
            },
          },
        },
      },
    });

    return newConv;
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
          },
        },
      },
    });
  }

  async createRoom(payload: CreateRoom, roomType: ROOMTYPE) {

    const newRoom = await this._prisma.room.create({
      data: {
        name: payload.name,
        type: roomType,
        image: payload.image ? payload.image: null,
        users: {
          create: {
            userRole: "OWNER",
            userId: payload.ownerId,
          },
        },
      },
    });

    return newRoom;
  }

  async findRoom(id: number, userId: number) {
    console.log(id, userId);
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
            user: {
              select: {
                userName: true,
                image: true,
              },
            },
          },
        },
      },
    });

    console.log(JSON.stringify(foundedRoom, null, 2));

    return foundedRoom;
  }

  async joinRoom(id: number, payload: JoinRoomDTO) {
    await this._prisma.room.update({
      where: {
        id: id,
      },
      data: {
        users: {
          create: {
            userId: payload.userId,
          },
        },
      },
    });
  }

  async findMessage(id: number) {
    const message = await this._prisma.message.findMany({
      where: {
        id: {
          in: [1, 2],
        },
      },
      include: {
        readBy: {
          include: {
            users: true,
          },
        },
        conv: true,
        user: true,
        room: true,
      },
    });

    return message;
  }

  async allConversations(id: number) {
    const lastMessajes = await this._prisma.user.findUnique({
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
        // rooms: {
        //   select: {
        //     room: {
        //       select: {
        //         id: true,
        //         name: true,
        //         type: true,
        //         users: {
        //           select: {
        //             userRole: true,
        //             user: {
        //               select: {
        //                 id: true,
        //                 userName: true,
        //                 image: true,
        //               },
        //             },
        //           },
        //         },
        //         messages: {
        //           take: 1,
        //           orderBy: {
        //             createdAt: "desc",
        //           },
        //           select: {
        //             id: true,
        //             content: true,
        //             userId: true,
        //             readBy: {
        //               select: {
        //                 users: {
        //                   select: {
        //                     id: true,
        //                   },
        //                 },
        //               },
        //             },
        //           },
        //         },
        //       },
        //     },
        //   },
        // orderBy: {
        //   room: {
        //     messages: {
        //       _count: 'asc',
        //     },
        //   },
        // },
        // include: {
        //   room: {
        //     include: {
        //       users: {
        //         select: {
        //           userRole: true,
        //           user: {
        //             select: {
        //               id: true,
        //               userName: true,
        //               image: true,
        //             },
        //           },
        //         },
        //       },
        //       messages: {
        //         take: 1,
        //         orderBy: {
        //           createdAt: "desc",
        //         },
        //         select: {
        //           content: true,
        //           userId: true,
        //           createdAt: true,
        //         },
        //       },
        //     },
        // select: {
        //   name: true,
        //   type: true,
        // },
        //       },
        //     },
        //   },
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
          // orgConv.isRead = !!conv.messages[0].readBy.users.find(user => user.id === id);
          orgConv.isRoom = false;
          // FIXME: This is should be handled
          orgConv.isOnline = orgConv.isRead;
        }
        // if (conv.users && conv.messages)
        // {
        //   console.log('Entered !!');
        //   let organizedConv :ChatData = {
        //     id: conv.users[0].id,
        //     username: conv.users[0].userName,
        //     image: conv.users[0].image,
        //     lastMessaeg: conv.messages[0].content,
        //     createdAt: conv.messages[0].createdAt,
        //     // isOnline:
        //     isRead: !!conv.messages[0].readBy.users.find(userid => userid.id === id),
        //     isRoom: false,
        //   }
        if (orgConv) sortedData.push(orgConv);
        // }
      });
    }

    // console.log(sortedData);

    // return lastMessajes;
    return sortedData;
  }

  async message(userId: number, withUserId: number, isRoom: boolean = false) {
    if (!isRoom) {
      const user = await this._prisma.converstaion.findFirst({
        where: {
          AND: [
            { users: { some: { id: userId } } },
            { users: { some: { id: withUserId } } },
          ],
        },
        select: {
          users: {
            where: {
              NOT: {
                id: userId,
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
            select: {
              content: true,
              userId: true,
            },
          },
        },
      });
      // console.log(user);
    }
  }

  async uniqueConvo(senderId: number, receiverId: number) {

    const user = await this._prisma.converstaion.findFirst({
      where: {
        AND: [
          {users: {some: {id: senderId}}},
          {users: {some: {id: receiverId}}},
        ],
      },
      include: {
        users: {
          where: {
            NOT: {
              id: receiverId,
            },
          },
          select: {
            id: true,
            userName: true,
            image: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            content: true,
            createdAt: true,
            userId: true,
          },
        },
      },
    });

    // console.log(user);

    const convo :ChatData = {
      id: user.users[0].id,
      userName: user.users[0].userName,
      image: user.users[0].image,
      lastMessage: user.messages[0].content,
      createdAt: user.messages[0].createdAt,
      isOnline: false,
      isRead: false,
      isRoom: false,
    }

    // console.log(convo);

    return (convo);
  }

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
			}
		});
		return (user);
	}

}
