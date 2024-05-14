import { FC, useContext, useEffect, useState } from "react";
import RoomUser from "./UsersWrapper/roomUsers";
import "./roomSettings.css"
import InviteFriends from "./InviteFriends/InviteFriend";
import RoomUpdate from "./roomUpdate/roomUpdate";
import { ROOMTYPE } from "../createRoom/interfaces";
import axios from "axios";
import SocketContext from "@/components/context/socket";

export interface RoomData {
    type :ROOMTYPE
}

const RoomSettings :FC<{name: string}> = (roomProp) => {

    const [roomType, setRoomType] = useState<ROOMTYPE>();
    const [roomName, setRoomName] = useState<string>(roomProp.name);
    const [settings, setSettings] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const socket = useContext(SocketContext);

    useEffect(() => {

        // TODO: Better get RoomType as Prop
        const data = async () => {

            setLoading(true);

            const data = await axios.get(process.env.NEST_API + '/user/getRoom/' + roomProp.name, {
                withCredentials: true,
            });

            console.log("DATA:", data.data.type);
            setRoomType(data.data.type);

            setLoading(false);
            // setRoomData(data.data);
        }
        data();

    }, []);

    useEffect(() => {
        socket?.on('nameTypeUpdate', (payload :{name :string, newName ?:string, type ?:ROOMTYPE}) => {
            if (RoomUpdate.name === payload.name && payload.newName)
                setRoomName(payload.newName);
            if (RoomUpdate.name === payload.name && payload.type)
                setRoomType(payload.type);
        });

        return () => {
            socket?.off('nameTypeUpdate');
        }
    }, [roomName]);

    return (
        <div className="roomSettings__wrapper">
            {
                !loading ? 
                <>
                    <RoomUser name={roomName} settings={setSettings}/>
                    {/* <InviteFriends /> */}
                    {settings && <RoomUpdate roomName={roomName} type={roomType} setType={setRoomType} setName={setRoomName} />}
                </>
                : <></>
            }
        </div>
    );
}

export default RoomSettings;