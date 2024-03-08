import { IsEnum, IsIn, IsInt, IsNotEmpty, IsString } from "@nestjs/class-validator"
import { ROOMTYPE } from "@prisma/client"

// Message Class
export class MessageDTO {

	@IsInt()
	from	:number

	@IsInt()
	to		:number

	@IsNotEmpty()
	@IsString()
	message	:string
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

	@IsNotEmpty()
	@IsString()
	password	?:string
}
