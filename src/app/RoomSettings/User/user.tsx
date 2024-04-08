import "./user.css";
import Image from "next/image";
import defaultPic from "@/../public/RoomSettings/DefaultUserPic.svg";
import kickUser from "@/../public/RoomSettings/kickUsers.svg";
import banUser from "@/../public/RoomSettings/BanUsers.svg";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { FormControlLabel, FormGroup } from "@mui/material";
import OverSwitch from "../Switch/switch";
import SocketContext from "@/components/context/socket";
import axios from "axios";

export interface RoomUsers {
    userId      :number
    roomId      :number
	userName	:string
	image		:string
	isMuted		:boolean
	role		: 'OWNER' | 'ADMIN' | 'USER'
}

const User :React.FC<{user :RoomUsers, curUser :RoomUsers | undefined, name :string, updateUsers :Dispatch<SetStateAction<RoomUsers[]>>}> = (userProp) => {

    const [user, setUser] = useState<RoomUsers>(userProp.user);
    const [disableAdmin, setDisableAdmin] = useState<boolean>(false);
    const [disableMute, setDisableMute] = useState<boolean>(false);
    const curUser = userProp.curUser;
    const socket = useContext(SocketContext);

    useEffect(() => {
        console.log('Rerendering at' , user.userName);
    });

    const handleAdmin = async () => {

        setUser((user :RoomUsers) => {
            return {...user, role: user.role === 'ADMIN' ? 'USER' : 'ADMIN'}
        });

        setDisableAdmin(true);
        const response = await axios.post(process.env.NEST_API + '/user/userStatus' ,{
            roomId: user.roomId,
            userId: user.userId,
            role: user.role === 'ADMIN' ? 'USER' : 'ADMIN',
            isMuted: user.isMuted,
        },
        {
            withCredentials: true,
        });

        setDisableAdmin(false);

        if (!response.data.status) {

            setUser((user :RoomUsers) => {
                return {...user, role: user.role === 'ADMIN' ? 'USER' : 'ADMIN'}
            });
        }
        else {

            userProp.updateUsers(users => users.map(updateUser => {

                    if (updateUser.userName === user.userName)
                        updateUser.role = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
                    return updateUser;
                })
                .sort((user1, user2) => {

                    const role = {'OWNER': 0, 'ADMIN': 1, 'USER': 2};
                    return role[user1.role] - role[user2.role];
                })
            );

            socket?.emit('userStatusInRoom', {userName: user.userName, userId: user.userId, roomId: user.roomId, role: user.role === 'ADMIN' ? 'USER' : 'ADMIN'});
        }

    }

    const handleMute = async () => {
        setUser((user :RoomUsers) => {
            return {...user, isMuted: !user.isMuted}
        });

        setDisableMute(true);
        const response = await axios.post(process.env.NEST_API + '/user/userStatus' ,{
            roomId: user.roomId,
            userId: user.userId,
            role: user.role,
            isMuted: !user.isMuted,
        },
        {
            withCredentials: true,
        });

        setDisableMute(false);

        if (!response.data.status)
        {
            setUser((user :RoomUsers) => {
                return {...user, isMuted: !user.isMuted}
            });
        }
    }

    const handleKick = () => {
        console.log('Kicked !');
    }

    return (
        <div className={user.userName === curUser?.userName ? "wrapper--current" : "wrapper"}>
            <Image src={user.image ? user.image : defaultPic.src} width={75} height={75} alt="user pic" className="user__profile--pic" />
            <p className="user__profile--username">{user.userName}</p>
            <p className="user__profile--role">{user.role}</p>
            {
                (curUser?.role === 'OWNER' || curUser?.role === 'ADMIN') && user.role !== 'OWNER' ?
                <FormGroup className="user__profile--role--settings">
                    <FormControlLabel control={<OverSwitch size="small" />} label={"Admin"} checked={user.role === 'ADMIN'} className="user__profile--role" onChange={handleAdmin} disabled={disableAdmin} />
                    <FormControlLabel control={<OverSwitch size="small" />} label={"Mute"} checked={user.isMuted} className="user__profile--role" onChange={handleMute} disabled={disableMute}/>
                </FormGroup>
                :null
            }
            {
                (curUser?.role === 'OWNER' || curUser?.role === 'ADMIN') && user.role !== 'OWNER' ?
                <div className="user__profile--settings">
                    <Image src={kickUser.src} width={20} height={20} alt="Kick user svg" onClick={handleKick}/>
                    <Image src={banUser.src} width={20} height={20} alt="Ban user svg" />
                </div>
                :null
            }
        </div>
    );
}

export default User;