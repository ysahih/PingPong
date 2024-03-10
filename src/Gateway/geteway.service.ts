import { Injectable, Logger, OnModuleInit, Scope } from "@nestjs/common";
import { Prisma, PrismaClient, ROOMTYPE } from "@prisma/client";
import { CreateRoom, MessageDTO, JoinRoomDTO } from "src/Gateway/gateway.interface";
import { prismaService } from "src/prisma/prisma.service";

@Injectable()
export class GatewayService  {

	private logger = new Logger(GatewayService.name);

	constructor(private _prisma :prismaService) {}

	async findUser(id :number) {
		const user = await this._prisma.user.findUnique({

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

		const newConv = await this._prisma.converstaion.create({
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

		await this._prisma.converstaion.update({
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

		const newRoom = await this._prisma.room.create({
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

		const foundedRoom = await this._prisma.room.findUnique({
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
}
