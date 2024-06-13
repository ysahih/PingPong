import { FC, useEffect, useState } from 'react';
import './BannedUsers.css'
import axios from 'axios';
import { Banned } from '../interfaces';
import WaitingCard from '@/components/roomInviteCard/waitingCard';
import Image from 'next/image';
import logo from '@/../public/RoomSettings/Scan_solid.svg'
import BannedCard from './Cards/Bannedcard';

const BannedUsers :FC<{roomId :number}> = (banProp) => {

    const [bannedUsers, setBannedUsers] = useState<Banned[]>([])
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getBannedUsers = async () => {
            const response = await axios.get(process.env.NEST_API + '/user/ban/' + banProp.roomId.toString(), {
                withCredentials: true,
            });

            console.log(response.data);

            setBannedUsers(response.data);
            setLoading(false);
        };

        getBannedUsers();
    }, []);

    return (
        <div className="banned__wrapper">
            <h1 className='banned__header'>Ban</h1>
            <div className='banned__users'>
                {
                    loading ? 
                    <>
                        <WaitingCard />
                        <WaitingCard />
                        <WaitingCard />
                    </>
                    :
                    <>
                        {
                            !bannedUsers.length ?
                            <>
                                <p>No Banned User</p>
                                <Image src={logo} width={20} height={20} alt='Logo' />
                            </>
                            :
                            <>
                                {
                                    bannedUsers.map(user => <BannedCard key={user.id} id={user.id} userName={user.userName} pic={user.image} />)
                                }
                            </>
                        }
                    </>
                }
            </div>
        </div>
    );
}

export default BannedUsers;
