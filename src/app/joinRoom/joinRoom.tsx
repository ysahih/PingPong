"use client";
import React, { useEffect, useState } from "react";
import "./joinRoom.css"
import Room from "./room/Room";
import axios from "axios";
import { JoinRoomDTO } from "./interfaces"
import RoomLoading from "./roomLoading/roomLoading";
import Image from "next/image";
import logo from '@/../public/RoomSettings/UserInite.svg';

const JoinRoom :React.FC<{searchDat :string}> = (prop) => {

    const [rooms, setRooms] = useState<JoinRoomDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        const getRooms = async () => {
            const response = await axios.get(process.env.NEST_API + `/user/getRooms?name=${prop.searchDat}`, {
                withCredentials: true,
            });
            
            if (response.data)
            {
                setRooms(response.data);
                setLoading(true);
            }
        }
        getRooms();

    }, [prop.searchDat]);

    return (
        <>
            {
                loading && (!rooms.length ?
                    <div className="joinRoom__message">
                        <p>No chat room available</p>
                        <Image src={logo} width={20} height={20} alt="User Inite logo"/>
                    </div>
                    :
                    <div className="joinRoom__rooms--wrapper">
                        {rooms?.map((room) => <Room key={room.name} room={room} updateRooms={setRooms} />)}
                    </div>
                )
            }
            {
                !loading &&
                <div className="joinRoom__rooms--wrapper">
                    <RoomLoading />
                    <RoomLoading />
                    <RoomLoading />
                    <RoomLoading />
                    <RoomLoading />
                    <RoomLoading />
                </div>
            }
        </>
    );
    
}

export default JoinRoom;