import { useEffect, useState } from "react";
import UserInvite from "../UserInvite/UserInvite";
import "./InviteFriend.css"

const InviteFriends = () => {

    const [users, setUsers] = useState([]);

    useEffect(() => {

    }, []);

    return (
        <div className="invite__wrapper">
            <h1 className="invite__header"> Invites </h1>
            <div className="invite__friends--wrapper">
                <UserInvite/>
                <UserInvite/>
                <UserInvite/>
                <UserInvite/>
            </div>
        </div>
    );
}

export default InviteFriends;