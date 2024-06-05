
export interface RoomUsers {
	roomName	:string
    userId      :number
    roomId      :number
	userName	:string
	image		:string | null
	isMuted		:boolean
	role		: 'OWNER' | 'ADMIN' | 'USER'
}

export interface UpdateStatusRoom {

	userName	:string
	roomName	:string
	userId	    :number
	roomId	    :number
	role	    :'OWNER' | 'ADMIN' | 'USER'
	isMuted	    :boolean
}

export interface KickBanUser {
	// roomName	:string
	userId		:number
	roomId		:number
}

export interface UserInvited {
	id			:number
	roomId		:number
	userName	:string
	pic			:string
}
