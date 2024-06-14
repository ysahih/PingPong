import { FC } from 'react';
import './BannedCard.css'
import userPic from '@/../public/RoomSettings/DefaultUserPic.svg'
import Image from 'next/image';
import axios from 'axios';

const BannedCard :FC<{id: number, userName: string, pic: string, roomId: number}> = (prop) => {

    const handleUnban = async () => {
        const response = await axios.post(process.env.NEST_API + '/user/unban/' + prop.roomId.toString(), {
            userId: prop.id,
        }, {
            withCredentials: true,
        });

        console.log(response.data);
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