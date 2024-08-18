import { ROLE, ROOMTYPE } from "@prisma/client"
import { IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator"

// User Inetface
export class User {

	id			:number
	username	:string
	socketId	?:string[]
	rooms		:Room[]
	DirectChat	:Conversations[]
}

// Room Interface
export class Room {

	@IsInt()
	id			:number

	@IsNotEmpty()
	@IsString()
	name		:string

	@IsEnum(ROLE)
	UserRole	:ROLE

	@IsEnum(ROOMTYPE)
	type		:ROOMTYPE
}

// Converstion Interface
export interface Conversations {
	id			:number
	toUserId	:number
}
