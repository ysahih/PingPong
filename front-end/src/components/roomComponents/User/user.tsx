import "./user.css";
import Image from "next/image";
import defaultPic from "@/../public/RoomSettings/DefaultUserPic.svg";
import loading from "@/../public/RoomSettings/loadingRed.svg"
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { FormControlLabel, FormGroup } from "@mui/material";
import OverSwitch from "../Switch/switch";
import SocketContext from "@/components/context/socket";
import axios from "axios";
import { RoomUsers } from "../interfaces";
import axiosApi from "@/components/signComonents/api";

const User :React.FC<{user :RoomUsers, curUser :RoomUsers | null, updateUsers :Dispatch<SetStateAction<RoomUsers[]>>, updateCurUser :Dispatch<SetStateAction<RoomUsers | null>>}> = (userProp) => {

    const [user, setUser] = useState<RoomUsers>(userProp.user);
    const [disableAdmin, setDisableAdmin] = useState<boolean>(false);
    const [disableMute, setDisableMute] = useState<boolean>(false);
    const [disableKick, setDisableKick] = useState<boolean>(false);
    const [disableBan, setDisableBan] = useState<boolean>(false);
    const curUser = userProp.curUser;
    const socket = useContext(SocketContext);

    useEffect(() => {
        setUser(userProp.user);
    }, [userProp.user]);

    const handleStatus = async (action :'role' | 'mute') => {

        action === 'role' ? setDisableAdmin(true) : setDisableMute(true);
        
        const newUser = {
            ...user,
            role: action === 'role' ? user.role === 'ADMIN' ? 'USER' : 'ADMIN' : user.role,
            isMuted: action === 'mute' ? !user.isMuted : user.isMuted,
        };

        setUser(newUser);

        const response = await axiosApi.post(process.env.NEST_API + '/user/userStatus' ,{
            roomId: user.roomId,
            userId: user.userId,
            role: newUser.role,
            isMuted: newUser.isMuted,
        },{
            withCredentials: true,
        });

        // console.log("Response:", response.data);

        if (response.data.status) {
            socket?.emit('userStatusInRoom', {
                fromId: curUser?.userId,
                // userName: newUser.userName,
                userId: newUser.userId,
                // roomName: userProp.name,
                roomId: newUser.roomId,
                role: newUser.role,
                isMuted: newUser.isMuted
            });
        }
        else {
            setUser(user);
        }

        action === 'role' ? setDisableAdmin(false) : setDisableMute(false);
    }

    const handleKick = async (action :'kick' | 'ban') => {

        action === 'kick' ? setDisableKick(!disableKick) : setDisableBan(!disableBan);

        const response = await axiosApi.post(process.env.NEST_API + '/user/kickBanRoom', {
            userId: user.userId,
            roomId: user.roomId,
            ban: action === 'ban',
        }, {
            withCredentials: true,
        });

        if (response.data.status) {
        // if (true) {
            // Delete the user from the array of users
            userProp.updateUsers((allUsers) => allUsers.filter(indiv => indiv.userName !== user.userName));

            // Emit to all the users in the roo that this user is deleted !
            socket?.emit("userOut", {
                adminId: curUser?.userId,
                userId: user.userId,
                roomId: user.roomId,
                // roomName: userProp.name,
            });
        }

        action === 'kick' ? setDisableKick(disableKick) : setDisableBan(disableBan);
    }

    return (
        <div className={user.userName === curUser?.userName ? "wrapper--current" : "wrapper"}>
            <div className="user__profile--pic--wrapper">
                <Image src={user.image ? user.image : defaultPic.src} width={75} height={75} alt="user pic" className="user__profile--pic" />
            </div>
            <p className="user__profile--username" title={user.userName}>{user.userName.length > 10 ? user.userName.slice(0, 10) + "..." : user.userName} </p>
            <p className="user__profile--role">{user.role}</p>

            {/* TODO: Add a mute sign if the user was muted */}

            {
                curUser?.role === 'OWNER' && user.role !== 'OWNER' &&
                <>
                    <FormGroup className="user__profile--role--settings">
                        <FormControlLabel control={<OverSwitch size="small" name="switch" id={user.userName + "1"} />} label={"Admin"} checked={user.role === 'ADMIN'} className="user__profile--role" onChange={() => handleStatus('role')} disabled={disableAdmin} />
                        <FormControlLabel control={<OverSwitch size="small" name="switch" id={user.userName + "2"} />} label={"Mute"} checked={user.isMuted} className="user__profile--role" onChange={() => handleStatus('mute')} disabled={disableMute}/>
                    </FormGroup>
                </>
            }
            {
                curUser?.role === 'ADMIN' && user.role === 'USER' &&
                <>
                    <FormGroup className="user__profile--role--settings">
                        <FormControlLabel control={<OverSwitch size="small" name="switch" id={user.userName + "1"} />} label={"Admin"} className="user__profile--role" onChange={() => handleStatus('role')} disabled={disableAdmin} />
                        <FormControlLabel control={<OverSwitch size="small" name="switch" id={user.userName + "2"} />} label={"Mute"} checked={user.isMuted} className="user__profile--role" onChange={() => handleStatus('mute')} disabled={disableMute}/>
                    </FormGroup>
                </>
            }
            {
                ((curUser?.role === 'OWNER' && user.role !== 'OWNER') || (curUser?.role === 'ADMIN' && user.role === 'USER')) &&
                <div className="user__profile--settings">
                    {
                        !disableKick ?
                        <button type="submit" className="user__profile--btn--enabled url--kick" onClick={() => handleKick('kick')} title="Kick user"></button> :
                        <Image src={loading} width={20} height={20} className="user__profile--loading" alt="Loading logo"/>
                    }
                    {
                        !disableBan ? 
                        <button type="submit" className="user__profile--btn--enabled url--ban" onClick={() => handleKick('ban')} title="Ban user"></button> :
                        <Image src={loading} width={20} height={20} className="user__profile--loading" alt="Loading logo"/>
                    }
                </div>
            }
        </div>
    );
}

export default User;