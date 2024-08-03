"use client";

import React, { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import User from "../User/user";
import { KickBanUser, RoomUsers } from "../interfaces"
import "./roomUsers.css"
import axios from "axios";
import UserDataContext from "@/components/context/context";
import SocketContext from "@/components/context/socket";
import UserLoading from "../UserLoading/UserLoading";
import { UpdateStatusRoom } from "../interfaces";
import { useRouter } from "next/navigation";
import axiosApi from "@/components/signComonents/api";

const RoomUser :React.FC<{id :number, settings :Dispatch<SetStateAction<boolean>>, setOwnerId :Dispatch<SetStateAction<number>>}> = (roomProps) => {

    const [users, setUsers] = useState<RoomUsers[]>([]);
    const [curUserStatus, setCurUserStatus] = useState<RoomUsers | null>(null);
    const curUser = useContext(UserDataContext);
    const socket = useContext(SocketContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const rout = useRouter();

    useEffect(() => {

        const getUsers = async () => {
            // const users = await axios.get(process.env.NEST_API + '/user/roomUsers/' + roomProps.id.toString(), {
            const users = await axiosApi.get(process.env.NEST_API + '/user/roomUsers/' + String(roomProps.id), {
                withCredentials: true,
            });

            if (users.data)
            {
                console.log(users.data);
                const founded :RoomUsers = users.data?.users?.find((user :RoomUsers) => user.userName === curUser?.userName);
                setUsers(users?.data?.users);
                setCurUserStatus(founded);
                if (founded.role === 'OWNER')
                    roomProps.setOwnerId(founded.userId);
            }
            setLoading(true);
        }
        getUsers();

    }, []);

    useEffect(() => {
        if (users)
        {
            socket?.on('UpdateStatus', (payload :{userId: number, roomId: number, role: 'OWNER' | 'ADMIN' | 'USER', isMuted: boolean}) => {
                console.log(payload);

                // if (payload.roomName === roomProps.name) {
                if (payload.roomId === roomProps.id) {
                    if (curUserStatus?.userId === payload.userId)
                        setCurUserStatus((user) => {
                            // return user ? {...user, role: payload.role, isMuted: payload.isMuted} : null;
                            return user ? {...user, role: payload.role, isMuted: payload.isMuted} : user;
                        });
                    roomProps.setOwnerId(payload.userId);
                }

                setUsers((users) => users.map((user) => {
                    if (user.userId === payload.userId)
                        return {...user, role: payload.role, isMuted: payload.isMuted};
                    return user;
                }));
            });

            socket?.on('newJoin', (payload :RoomUsers) => {

                console.log("Join:", payload);

                if (payload.roomId === roomProps.id)
                    setUsers((user) => [...user, payload]);
            });

            socket?.on('kickBanUser', (payload :KickBanUser) => {

                console.log("KickBan:", payload);

                if (payload.roomId === roomProps.id) {
                    // TODO: I have to take him to the home
                    // setUsers([]);
                    if (curUser?.id === payload.userId)
                        rout.push('/');
                    else
                        setUsers((users) => users.filter((user) => user.userId !== payload.userId));
                }
            });

            socket?.on('deleted', (payload: {roomId: number}) => { 
                if (roomProps.id === payload.roomId)
                    rout.push('/');
            })

            return () => {
                socket?.off('UpdateStatus');
                socket?.off('newJoin');
                socket?.off('kickBanUser');
                socket?.off('deleted');
            }
        }
    }, [users]);

    const handleUpdate = () => {

        setUpdate(true);

        setTimeout(() => {
            setUpdate(false);
            roomProps.settings(value => !value);
        }, 300);
    };

    const handleLeave = async () => {
        const response = await axiosApi.post(process.env.NEST_API + '/user/leave', {
            roomId: roomProps.id,
        }, {
            withCredentials: true,
        });

        console.log(response.data);

        if (response.data.status) {
            if (response.data.deleted !== 1) {
                socket?.emit('userOut', {
                    adminId: curUser?.id,
                    userId: curUser?.id,
                    roomId: roomProps.id,
                    // roomName: roomProps.name,
                });
                if (curUserStatus?.role === 'OWNER') {
                    console.log("I'm Here !");
                    socket?.emit('changeOwner', {
                        // roomName: roomProps.name,
                        roomId: roomProps.id,
                        ownerId: response.data.ownerId,
                        userId: curUser?.id,
                    });
                }
            }
            // TODO: I have to push the user to the home
            // setUsers([]);
            rout.push('/');
        }
    };

    const deleteRoom = async () => {
        const response = await axiosApi.post(process.env.NEST_API + '/user/deleteRoom', {
            roomId: roomProps.id,
        }, {
            withCredentials: true,
        });

        console.log(response.data);
        if (response.data.status) {
            rout.push('/');
            socket?.emit('deleteRoom', {
                ownerId: curUser?.id,
                roomId: roomProps.id,
            })
        }
    };

    return (
        <div className="room__users__wrapper">
            <div className="room__users__top">
                <h1 className="room__users__header"> Users </h1>

                {
                    !!users.length &&
                    <div className="room__users____top--settings">
                        {
                            curUserStatus?.role === 'OWNER' &&
                            <>
                                <div className="room__users__btn--wrapper">
                                    <button type="submit" className={`url--update ${update ? "room__user__btn--animation" : ''}`} onClick={handleUpdate}></button>
                                </div>
                                {/* <div className="room__users__btn--wrapper">
                                    <button type="submit" className="url--bannedUsers"></button>
                                </div> */}
                                <div className="room__users__btn--wrapper" onClick={deleteRoom}>
                                    <button type="submit" className="url--delete"></button>
                                </div>
                            </>
                            // : <></>
                        }

                        <div className="room__users__btn--wrapper" onClick={handleLeave}>
                            <button type="submit" className="url--leave"></button>
                        </div> 

                    </div>
                }
            </div>
            <div className="room__users">
                {
                    loading &&
                    users?.map((user :RoomUsers) => <User key={user.userName} user={user} curUser={curUserStatus} updateUsers={setUsers} updateCurUser={setCurUserStatus} />)
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