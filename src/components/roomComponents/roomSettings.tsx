import { FC, useContext, useEffect, useState } from "react";
import RoomUser from "./UsersWrapper/roomUsers";
import "./roomSettings.css";
import InviteFriends from "./InviteFriends/InviteFriend";
import RoomUpdate from "./roomUpdate/roomUpdate";
import { ROOMTYPE } from "../createRoom/interfaces";
import axios from "axios";
import SocketContext from "@/components/context/socket";
import BannedUsers from "./bannedUsers/BannedUsers";

export interface RoomData {
  type: ROOMTYPE;
}

const RoomSettings: FC<{ name: string }> = (roomProp) => {
  const [roomType, setRoomType] = useState<ROOMTYPE>();
  const [id, setId] = useState<number>(0);
  const [ownerId, setOwnerId] = useState<number>(0);
  const [settings, setSettings] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const socket = useContext(SocketContext);

  useEffect(() => {
    // TODO: Better get RoomType as Prop
    const data = async () => {
      // setLoading(true);

      const data = await axios.get(
        process.env.NEST_API + "/user/getRoom/" + roomProp.name,
        {
          withCredentials: true,
        }
      );

      // TODO: if (!data.data) Push to 404
      if (data.data) {
        setRoomType(data.data.type);
        setId(data.data.id);

        setLoading(false);
      }
    };
    data();
  }, []);

  useEffect(() => {
    socket?.on("roomType", (payload: { roomId: number, type: ROOMTYPE }) => {
      console.log("Incoming Data:", payload);
      // if (payload.name)
      //   setRoomName(payload.name);
      if (id === payload.roomId && payload.type !== roomType)
        setRoomType(payload.type);
    });

    return () => {
      socket?.off('roomType')
    }
  }, [roomType]);

  return (
    <div className="roomSettings__wrapper">
      {!loading && (
        <>
          <RoomUser id={id} settings={setSettings} setOwnerId={setOwnerId} />
          {roomType === "PRIVATE" && <InviteFriends id={ownerId} roomId={id} />}
          {settings && (
            <div className="settings--wrapper">
              <RoomUpdate id={id} type={roomType} setType={setRoomType} ownerId={ownerId} /> 
              <BannedUsers roomId={id} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RoomSettings;