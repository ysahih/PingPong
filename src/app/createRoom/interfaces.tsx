
export enum ROOMTYPE {
	PRIVATE = 'PRIVATE',
	PUBLIC = 'PUBLIC',
	PROTECTED = 'PROTECTED'
}

export interface RoomFormat {
	name		:string
	type		:ROOMTYPE
	password	:string
	error		:string
}

export interface RoomFormatUpdate {
	name		:string
	type		:ROOMTYPE | null
	password	:string
	error		:string
}