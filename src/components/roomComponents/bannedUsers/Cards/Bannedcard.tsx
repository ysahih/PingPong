import { FC } from 'react';
import './BannedCard.css'
import userPic from '@/../public/RoomSettings/DefaultUserPic.svg'
import Image from 'next/image';

const BannedCard :FC<{id: number, userName: string, pic: string}> = (prop) => {

    return (
        <div className='bannedCard__wrapper'>
            <div className='banned__info'>
                <Image src={prop.pic || userPic} width={40} height={40} alt="User Picture"/>
                <p> {prop.userName} </p>
            </div>
            <button className="url--unblock"></button>
        </div>
    );
};

export default BannedCard;