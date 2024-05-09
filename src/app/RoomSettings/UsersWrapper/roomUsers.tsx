import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import User from "../User/user";
import { KickBanUser, RoomUsers } from "../interfaces"
import "./roomUsers.css"
import axios from "axios";
import UserDataContext from "@/components/context/context";
import SocketContext from "@/components/context/socket";
import UserLoading from "../UserLoading/UserLoading";
import { UpdateStatusRoom } from "../interfaces";

const RoomUser :React.FC<{name :string, settings :Dispatch<SetStateAction<boolean>>}> = (roomProps) => {

    const [users, setUsers] = useState<RoomUsers[]>([]);
    const [curUserStatus, setCurUserStatus] = useState<RoomUsers | null>(null);
    const curUser = useContext(UserDataContext);
    const socket = useContext(SocketContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);

    useEffect(() => {

        const getUsers = async () => {
            const users = await axios.get(process.env.NEST_API + '/user/roomUsers/' + roomProps.name, {
                withCredentials: true,
            });

            if (users.data)
            {
                console.log(users.data);
                const founded :RoomUsers = users.data?.users?.find((user :RoomUsers) => user.userName === curUser?.userName);
                setUsers(users?.data?.users);
                setCurUserStatus(founded);
            }
            setLoading(true);
        }
        getUsers();

    }, []);

    useEffect(() => {
        if (users)
        {
            socket?.on('UpdateStatus', (payload :UpdateStatusRoom) => {
                console.log(payload);

                if (payload.roomName === roomProps.name) {
                    if (curUserStatus?.userName === payload.userName)
                        setCurUserStatus((user) => {
                            return user ? {...user, role: payload.role, isMuted: payload.isMuted} : null;
                        });
                }

                setUsers((users) => users.map((user) => {
                    if (user.userName === payload.userName)
                        return {...user, role: payload.role, isMuted: payload.isMuted};
                    return user;
                }));
            });

            socket?.on('newJoin', (payload :RoomUsers) => {

                console.log("Room:", roomProps.name);
                console.log("Payload:", payload.roomName);

                if (payload.roomName === roomProps.name)
                    setUsers((user) => [...user, payload]);
            });

            socket?.on('kickBanUser', (payload :KickBanUser) => {

                console.log("KickBan:", payload);

                if (payload.roomName === roomProps.name) {
                    // TODO: I have to take him to the home
                    if (curUser?.id === payload.userId)
                        setUsers([]);
                    else
                        setUsers((users) => users.filter((user) => user.userId !== payload.userId));
                }
            });

            return () => {
                socket?.off('UpdateStatus');
                socket?.off('newJoin');
                socket?.off('kickBanUser');
            }
        }
    }, [users]);

    const handleUpdate = () => {
        setUpdate(true);
        setTimeout(() => {
            setUpdate(false)
            roomProps.settings(value => !value);
        }, 300);
    }

    return (
        <div className="room__users__wrapper">
            <div className="room__users__top">
                <h1 className="room__users__header"> Users </h1>

                <div className="room__users____top--settings">

                    {
                        curUserStatus?.role === 'OWNER' ?
                        <>
                            <div className="room__users__btn--wrapper">
                                <button type="submit" className={`url--update ${update ? "room__user__btn--animation" : ''}`} onClick={handleUpdate}></button>
                            </div>
                            <div className="room__users__btn--wrapper">
                                <button type="submit" className="url--delete"></button>
                            </div>
                        </>
                        : <></>
                    }

                    <div className="room__users__btn--wrapper">
                        <button type="submit" className="url--leave"></button>
                    </div>

                </div>
            </div>
            <div className="room__users">
                {
                    loading &&
                    users?.map((user :RoomUsers) => <User key={user.userName} user={user} curUser={curUserStatus} name={roomProps.name} updateUsers={setUsers} updateCurUser={setCurUserStatus} />)
                }
                {
                    !loading &&
                    <>
                        <UserLoading />
                        <UserLoading />
                        <UserLoading />
                    </>
                }

            </div>
        </div>
    );
}

export default RoomUser;