import { Dispatch, FC, SetStateAction } from 'react';
import './BannedCard.css';
import userPic from '@/../public/RoomSettings/DefaultUserPic.svg';
import Image from 'next/image';
import axios from 'axios';
import { Banned } from '../../interfaces';
import axiosApi from '@/components/signComonents/api';

const BannedCard :FC<{id: number, userName: string, pic: string, roomId: number, setBannedUsers :Dispatch<SetStateAction<Banned[]>>}> = (prop) => {

    const handleUnban = async () => {
        const response = await axiosApi.post(process.env.NEST_API + '/user/unban', {
            roomId: prop.roomId,
            userId: prop.id,
        }, {
            withCredentials: true,
        });

        console.log(response.data);
        if (response.data.status)
            prop.setBannedUsers(users => users.filter(user => user.id !== prop.id));
    };

    return (
        <div className='bannedCard__wrapper'>
            <div className='banned__info'>
                <Image src={prop.pic || userPic} width={40} height={40} alt="User Picture"/>
                <p> {prop.userName} </p>
            </div>
            <button className="url--unblock" onClick={handleUnban}></button>
        </div>
    );
};

export default BannedCard;