import './UserInvite.css'
import Image from "next/image";
import defaultPic from "@/../public/RoomSettings/DefaultUserPic.svg";
import loadingLogo from "@/../public/RoomSettings/loading.svg";
import inviteLogo from "@/../public/RoomSettings/invite.svg";
import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { UserInvited } from '../interfaces';
import axios from 'axios';
import SocketContext from '@/components/context/socket';
import axiosApi from '@/components/signComonents/api';

const UserInvite :React.FC<{ownerId: number, user: UserInvited, setUsers: Dispatch<SetStateAction<UserInvited[]>> }> = (prop) => {

    const [loading, setLoading] = useState<boolean>(false);
    const socket = useContext(SocketContext);

    const handleClick = async () => {
        setLoading(true);
        const data = await axiosApi.post(process.env.NEST_API + '/user/inviteUser', {
            roomId: prop.user.roomId,
            invitedId: prop.user.id,
        }, {
            withCredentials: true,
        });

        if (data.data.status) {
            socket?.emit('roomInvite', {
                adminId: prop.ownerId,
                roomId: prop.user.roomId,
                userId: prop.user.id,
            })
            prop.setUsers((users) => users.filter(allUsers => allUsers.id !== prop.user.id));
        }
        setLoading(false);
    }

    return (
        <div className='userInvite__wrapper'>
            <Image src={prop.user.pic || defaultPic} height={75} width={75} className='userInvite__pic' alt='User pic'/>
            <p className='userInvite__username' title={prop.user.userName}>{ prop.user.userName.length > 10 ?  `${prop.user.userName.slice(0, 10)}...` : prop.user.userName}</p>
            <div className="userInvite__btn--wrapper">
                {!loading ?
                    <button type='submit' className='userInvite__btn' onClick={handleClick}></button>
                    :
                    <Image src={loadingLogo} width={22} height={22} className='userInvite__Loading' alt='Loading Logo' onClick={handleClick} />
                }
            </div>
        </div>
    );
}

export default UserInvite;