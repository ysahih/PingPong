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

// export class User {

// 	id			:number
// 	username	:string
// 	socketId	:string
// 	rooms		:Room[]
// 	DirectChat	:Conversations[]
// }

// User's Role Interface
// export interface UserInRoom {
// 	// user: User
// 	room	:Room
// 	role	:'OWNER' | 'ADMIN' | 'USER'
// 	// muted :boolean
// }

// Room Interface
export class Room {

	@IsInt()
	id			:number

	@IsNotEmpty()
	@IsString()
	name		:string
	// UserRole	:'OWNER' | 'ADMIN' | 'USER',
	// type		:'PUBLIC' | 'PROTECTED' | 'PRIVATE'

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

// Room's roles options
// enum ROLE {
// 	'OWNER',
// 	'ADMIN',
// 	'USER',
// }

// enum ROOMTYPE {
// 	'PUBLIC',
// 	PROTECTED',
// 	'PRIVATE'
// }