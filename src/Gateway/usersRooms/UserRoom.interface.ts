
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
export interface Room {
	id			:number
	name		:string
	UserRole	:'OWNER' | 'ADMIN' | 'USER',
	type		:'PUBLIC' | 'PROTECTED' | 'PRIVATE'
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
