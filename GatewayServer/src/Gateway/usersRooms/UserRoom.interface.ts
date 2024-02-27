
// User Inetface
export interface User {
	_id :number
	_socketId ?:string
	_username :string
}

// User's Role Interface
export interface UserInRoom {
	user :User
	role : 'OWNER' | 'ADMIN' | 'USER'
	// muted :boolean
}

// Room Interface
export interface Room {
	name :string
	users :UserInRoom
}

// Room's roles pptions
enum ROLE {
	'OWNER',
	'ADMIN',
	'USER',
}
