import './UserInvite.css'
import Image from "next/image";
import defaultPic from "@/../public/RoomSettings/DefaultUserPic.svg";
import loadingLogo from "@/../public/RoomSettings/loading.svg";
import inviteLogo from "@/../public/RoomSettings/invite.svg";
import { useState } from 'react';

const UserInvite = () => {

    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = () => {
        setLoading(!loading);
    }

    return (
        <div className='userInvite__wrapper'>
            <Image src={defaultPic} height={75} width={75} className='userInvite__pic' alt='User pic'/>
            <p className='userInvite__username'>Username</p>
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