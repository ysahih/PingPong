import { Injectable } from "@nestjs/common";
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

  async findRoom(id: number) {
    const foundedRoom = await this._prisma.room.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });

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
          orgConv.username = conv.users[0].userName;
          orgConv.image = conv.users[0].image;
        }
        if (conv?.messages) {
          orgConv.lastMessaeg = conv.messages[0].content;
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

    console.log(sortedData);

    // return lastMessajes;
    return sortedData;
  }
}
