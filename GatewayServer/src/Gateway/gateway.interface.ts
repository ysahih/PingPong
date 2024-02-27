
// Message Interface
export interface MessageDTO {
	from	:number
	to		:number | string
	message	:string
	room	:boolean
}

// export interface MessageDTO {
// 	from	:string
// 	to		:string
// 	message	:string
// }

// New Connection Query = Will change into JWT
export interface NewConnectionQueryDTO {
	id			:number
	username	:string
}

export interface JoinRoomDTO {
	userId		:number
	roomId		:number
	roomName	:string
}
