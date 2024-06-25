import InviteCard from '@/components/roomInviteCard/InviteCard';
import './roomInvites.css'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import RoomInvite from '../interface';
import WaitingCard from '@/components/roomInviteCard/waitingCard';
import SocketContext from '@/components/context/socket';
import UserDataContext from '@/components/context/context';

const RoomInvites = () => {

    const [rooms, setRooms] = useState<RoomInvite[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const socket = useContext(SocketContext);
    const user = useContext(UserDataContext);

    useEffect(() => {
        const getInvites = async () => {
            const response = await axios.get(process.env.NEST_API + '/user/roomInvites', {
                withCredentials: true,
            });

            console.log('UserInvites:', response.data);
            setRooms(response.data);
            setTimeout(() => setLoading(false), 2000);
        };

        getInvites();
    }, []);

    useEffect(() => {
        socket?.on('newRoom', (payload :RoomInvite) => {
            setRooms(rooms => [payload, ...rooms]);
        })
        return () => {
            socket?.off('newRoom');
        }
    }, [rooms]);

    return (
        <div className="roomInvites">
            <h1>Invites</h1>
            {
                <div className='roomInvites__users'>
                    {
                        loading ? 
                        <>
                            <WaitingCard />
                            <WaitingCard />
                            <WaitingCard />
                            <WaitingCard />
                        </>
                        :
                        !!rooms?.length && rooms?.map(room => <InviteCard key={room.id} userId={user?.id} id={room.id} name={room.name} image={room.image} setRooms={setRooms}/>)
                    }
                </div>
            }
        </div>
    );
}

export default RoomInvites;