import { Injectable, Logger, OnModuleInit, Scope } from "@nestjs/common";
import { Prisma, PrismaClient, ROOMTYPE } from "@prisma/client";
import { CreateRoom, MessageDTO, JoinRoomDTO } from "src/Gateway/gateway.interface";


@Injectable({
	scope: Scope.DEFAULT,
})
export class PrismaService extends PrismaClient implements OnModuleInit {

	private logger = new Logger(PrismaService.name);

	constructor() {
		super();
	}

	async onModuleInit() {
		// FIXME: At DB connection failure !!!!
		// Send a Signal to the NESTAPP Maybe 
		await this.$connect()
		.then(() => this.logger.log('Prisma connected to DB !'))
		.catch(e => this.logger.log(e.message));
	}

	async findUser(id :number) {
		const user =await this.user.findUnique({

			where: {
				id: id,
			},
			include: {
				rooms: {
					select: {
						userRole: true,
						room: {
							select: {
								name: true,
								id: true,
								type: true,
							}
						}
					}
				},
				conv: {
					select: {
						id: true,
						users: true,
					},
				},
			},
		});
		return (user);
	}

	async createConversation(payload :MessageDTO) {

		const newConv = await this.converstaion.create({
			data: {
				users: {
					connect: [
						{ id: payload.from },
						{ id: payload.to },
					],
				},
				messages: {
					create: {
						content: payload.message,
						userId: payload.from,
					},
				},
			},
		});
		return (newConv);
	}

	async updateConversation(id :number, payload :MessageDTO) {

		await this.converstaion.update({
			where: {
				id: id,
			},
			data: {
				messages: {
					create: {
						content: payload.message,
						userId: payload.from,
					}
				}
			}
		});
	}

	async createRoom(payload :CreateRoom, roomType :ROOMTYPE) {

		const newRoom = await this.room.create({
			data: {
				name: payload.name,
				type: roomType,
				users: {
					create: {
						userRole: 'OWNER',
						userId: payload.ownerId,
					},
				},
			},
		});

		return (newRoom);
	}

	async findRoom(id :number) {

		const foundedRoom = await this.room.findUnique({
			where: {
				id: id,
			},
			select: {
				id: true,
				name: true,
				type: true,
			}
		});

		return (foundedRoom);
	}

	async joinRoom(id :number, payload :JoinRoomDTO) {

		await this.room.update({
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
}