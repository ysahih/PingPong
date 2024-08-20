import { useEffect, useState } from "react";
import UserInvite from "../UserInvite/UserInvite";
import "./InviteFriend.css"
import axios from "axios";
import UserLoading from "../UserLoading/UserLoading";
import { UserInvited } from "../interfaces";
import Image from "next/image";
import logo from '@/../public/RoomSettings/UserInite.svg';
import axiosApi from "@/components/signComonents/api";

const InviteFriends :React.FC<{id :number, roomId :number}> = (prop) => {

    const [users, setUsers] = useState<UserInvited[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [lastSerch, setLastSearch] = useState<string>('')

    useEffect(() => {
        // TODO: Get Some random users to put here
        const getData = async () => {
            const response = await axiosApi.get(process.env.NEST_API + '/user/inviteUsers/' + prop.roomId.toString(), {
                withCredentials: true,
            });

            if (response.data.length) {
                setUsers(response.data);
                // setUsers([]);
            }
            setLoading(false);
        }

        getData();
    }, []);

    const handleSubmit = async (e :React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter' && e.currentTarget.value && e.currentTarget.value !== lastSerch) {
            setLastSearch(e.currentTarget.value);
            const result = await axiosApi.get(process.env.NEST_API + '/user/roomSearch/' + prop.roomId.toString() + '/' + e.currentTarget.value, {
                withCredentials: true,
            });

            setUsers(result.data);
        }
    }

    return (
        <div className="invite__wrapper">
            <div className="invite__top--wrapper">
                <h1 className="invite__header"> Invites </h1>
                <div className="invite__search--wrapper">
                    <input type="text" placeholder="search" className="invite__search" id="sear" onKeyDown={e => handleSubmit(e)}/>
                </div>
            </div>
            <div className="invite__friends--wrapper">
                {
                    !loading ?
                    <>
                    {
                        users?.length ?
                        users?.map(user => user && <UserInvite key={user.id} ownerId={prop.id} user={user} setUsers={setUsers}/> )
                        :
                        <div className="invite__friends__inform">
                            <p>No user found</p>
                            <Image src={logo} width={20} height={20} alt="User Inite logo"/>
                        </div>
                    }
                    </>
                    :
                    <>
                        <UserLoading />
                        <UserLoading />
                        <UserLoading />
                        <UserLoading />
                    </>
                }
            </div>
        </div>
    );
}

export default InviteFriends;