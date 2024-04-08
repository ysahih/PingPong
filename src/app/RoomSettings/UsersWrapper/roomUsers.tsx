import React, { useContext, useEffect, useState } from "react";
import User, { RoomUsers } from "../User/user";
import "./roomUsers.css"
import axios from "axios";
import Image from "next/image";
import UserDataContext from "@/components/context/context";
import deleteRoom from "@/../public/RoomSettings/deleteRoom.svg"
import leaveRoom from "@/../public/RoomSettings/leaveRoom.svg"
import roomSettings from "@/../public/RoomSettings/roomSettings.svg"
import SocketContext from "@/components/context/socket";

interface UpdateStatusRoom {

	userName	:string
	userId	:number
	roomId	:number
	role	?:'ADMIN' | 'USER'
	isMuted	?:boolean
}

const RoomUser :React.FC<{name :string}> = (roomProps) => {

    const [users, setUsers] = useState<RoomUsers[]>([]);
    const [curUserStatus, setCurUserStatus] = useState<RoomUsers>();
    const curUser = useContext(UserDataContext);
    const socket = useContext(SocketContext);

    useEffect(() => {

        const getUsers = async () => {
            const users = await axios.get(process.env.NEST_API + '/user/roomUsers/' + roomProps.name, {
                withCredentials: true,
            });

            const founded :RoomUsers = users.data?.find((user :RoomUsers) => user.userName === curUser?.userName);
            setCurUserStatus(founded);
            setUsers(users.data);
        }
        getUsers();


        // socket?.on('UpdateStatus', (payload) => {

        // });
        return () => {
            socket?.off('UpdateStatus');
        }
    }, []);

    return (
        <div className="room__users__wrapper">
            <div className="room__users__top">
                <h1 className="room__users____top--header">Users</h1>
                <div className="room__users____top--settings">
                    <Image src={roomSettings.src} width={30} height={30} alt="settings room logo" />
                    <Image src={deleteRoom.src} width={30} height={30} alt="delete room logo" />
                    <Image src={leaveRoom.src} width={30} height={30} alt="Leave room logo" />
                </div>
            </div>
            <div className="room__users">
                {
                    users.map((user :RoomUsers) => <User key={user.userName} user={user} curUser={curUserStatus} name={roomProps.name} updateUsers={setUsers} />)
                }

            </div>
        </div>
    );
}

export default RoomUser;