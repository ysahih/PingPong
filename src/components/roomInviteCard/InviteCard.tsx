import Image from "next/image";
import "./InvitetCard.css"
import roomPic from '@/../public/createRoom/GroupChat.svg';
import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import axios from "axios";
import SocketContext from "../context/socket";
import RoomInvite from "@/app/roomInvites/interface";

const InviteCard :React.FC<{userId: number | undefined, id: number, name :string, image :string, setRooms :Dispatch<SetStateAction<RoomInvite[]>>}> = (prop) => {

    const [clicked, setClicked] = useState<boolean>(false)
    const socket = useContext(SocketContext);

    const handleClick = async (e : React.MouseEvent<HTMLElement>, action :'accept' | 'deny') => {
        setClicked(true);
        const response = await axios.post(process.env.NEST_API + '/user/accInvite', {
            roomId: prop.id,
            accept: action === 'accept',
        }, {
            withCredentials: true,
        });

        console.log(response.data);
        if (response.data.status) {
            socket?.emit("joinRoom", {
                userId: prop.userId,
                room: {
                    id: prop.id,
                    name: prop.name,
                    type: 'PRIVATE',
                    UserRole: "USER",
                },
            });

            prop.setRooms(rooms => rooms.filter(room => room.id !== prop.id));
        }
        setClicked(false);
    }

    return (
        <div className="inviteCard">
            <div className="inviteCard__infos">
                <Image src={prop.image || roomPic} width={40} height={40} alt="Room Picture"/>
                <p> {prop.name} </p>
            </div>
            <div className="inviteCard__btns">
                <button className="url--accept" disabled={clicked} onClick={e => handleClick(e, 'accept')}></button>
                <button className="url--deny" disabled={clicked} onClick={e => handleClick(e, 'deny')}></button>
            </div>
        </div>
    );
};

export default InviteCard;