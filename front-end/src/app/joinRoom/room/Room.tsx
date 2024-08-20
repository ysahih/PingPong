import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import "./Room.css";
import { JoinRoomDTO } from "../interfaces";
import Image from "next/image";
import pic from "@/../public/createRoom/GroupChat.svg";
import { ROOMTYPE } from "@/components/createRoom/interfaces";
import axios from "axios";
import SocketContext from "@/components/context/socket";
import UserDataContext from "@/components/context/context";
import axiosApi from "@/components/signComonents/api";

const Room: React.FC<{
  room: JoinRoomDTO;
  updateRooms: Dispatch<SetStateAction<JoinRoomDTO[]>>;
}> = (roomProp) => {
  const room = roomProp.room;
  const socket = useContext(SocketContext);
  const curUser = useContext(UserDataContext);
  const [join, setJoin] = useState<boolean>(false);
  const [pass, setPass] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPass(e.currentTarget.value);
  };

  const handleClick = async () => {

    setJoin(true);

    if (room.type !== ROOMTYPE.PROTECTED || (room.type === ROOMTYPE.PROTECTED && pass.length)) {
      const response = await axiosApi.post(
        process.env.NEST_API + "/user/joinRoom",
        {
          id: room.id,
          password: pass || null,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        if (!response.data.status) {
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 800);
        } else {
          socket?.emit("joinRoom", {
            userId: curUser?.id,
            room: {
              id: room.id,
              name: room.name,
              type: room.type,
              UserRole: "USER",
            },
          });

          roomProp.updateRooms((rooms) => {
            let copy = [...rooms];
            copy.splice(
              copy.findIndex((r) => r.name === room.name),
              1
            );
            return copy;
          });
        }
      }
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 800);
    }

    setPass("huj");
    setJoin(false);
  };

  return (
    // <div className="room--outside">
    <div className={error ? "room__warpper--error" : "room__wrapper"}>
      <Image src={room?.image ? room?.image : pic} width={75} height={75} alt="Room image" className={error ? "room__pic--error" : "room__pic"}/>
      <p className="room__name">{room.name}</p>
      <div className="room__form">
        {room.type === ROOMTYPE.PROTECTED &&
        (<input type="text" name="input__room--password" placeholder="Password" className={error ? "room__input--error" : "room__input"} onChange={handleType} />)
        }
        {join ?
          (<button type="button" className="room__btn"> Joining... </button>) : 
          (<button type="submit" className="room__btn" onClick={handleClick}> Join </button>)
          }
      </div>
    </div>
    // </div>
  );
};

export default Room;
