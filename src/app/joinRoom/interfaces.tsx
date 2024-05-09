import { ROOMTYPE } from "../createRoom/interfaces"

export interface JoinRoomDTO {
    id      :number
    name    :string
    image   :string
    type    :ROOMTYPE
}

// {
//   id: 98,
//   userId: 1,
//   roomId: 3,
//   userRole: 'USER',
//   joinedAt: 2024-04-22T15:56:40.583Z,
//   isMuted: false
// }