import { IsEnum, IsIn, IsInt, IsNotEmpty, IsString } from "@nestjs/class-validator"
import { ROOMTYPE } from "@prisma/client"
import { IsDate, ValidateIf } from "class-validator"

// Message Class
export class MessageDTO {

	@IsInt()
	from	:number

	@IsInt()
	to		:number

	@IsNotEmpty()
	@IsString()
	message	:string

	@IsNotEmpty()
	@IsDate()
	createdAt :Date
}

// Join room class
export class JoinRoomDTO {

	@IsInt()
	roomId		:number

	@IsInt()
	userId		:number
}

// Create room class
export class CreateRoom {

	@IsInt()
	ownerId		: number

	@IsNotEmpty()
	@IsString()
	name		:string

	@IsEnum(ROOMTYPE)
	@IsString()
	type		:ROOMTYPE

	// TODO: Check This
	@ValidateIf(o => o.type === ROOMTYPE.PROTECTED)
	@IsNotEmpty()
	@IsString()
	password	?:string

	@IsString()
	image		?:string
}

export class ChatData {
	id: number
	userName: string
	image: string
	lastMessage: string
	createdAt: Date
	// TODO: Handle This
	isOnline: boolean
	isRead: boolean
	isRoom: boolean
}

export class Messages {
	content :string
	userId :number
	createdAt: Date
}

export class ConvData {
	id :number
	userName :string
	image :string
	messages :Messages[]
}