"use client";
import { useEffect, useState } from "react";
import "./joinRoom.css"
import Room from "./room/Room";
import axios from "axios";
import { JoinRoomDTO } from "./interfaces"
import RoomLoading from "./roomLoading/roomLoading";

const JoinRoom = () => {

    const [rooms, setRooms] = useState<JoinRoomDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        const getRooms = async () => {
            const response = await axios.get(process.env.NEST_API + "/user/getRooms", {
                withCredentials: true,
            });

            if (response.data)
            {
                setRooms(response.data);
                setLoading(true);
            }
        }
        getRooms();

    }, []);

    return (
        <div className="joinRoom__warpper">
            <input type="text" name="search--room" className="joinRoom__search"/>
            {
                loading && (!rooms.length ?
                    <p className="joinRoom__message"> No chat room available </p>
                    :
                    <div className="joinRoom__rooms--wrapper">
                        {rooms?.map((room) => <Room key={room.name} room={room} updateRooms={setRooms} />)}
                    </div>
                )
            }
            {/* {
                loading && rooms?.length &&
                <div className="joinRoom__rooms--wrapper">
                    {rooms?.map((room) => <Room key={room.name} room={room} updateRooms={setRooms} />)}
                </div>
            } */}
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
        </div>
    );
    
}

export default JoinRoom;