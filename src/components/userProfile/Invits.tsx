import "@/styles/userProfile/userFriend.css";
import axios from "axios";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { InvitsType } from "./Dto";
import ProfileDataContext from "../context/profilDataContext";
import SocketContext from "../context/socket";
import UserDataContext from "../context/context";




interface InvitProps {
  value: InvitsType;
}

const Invit = (props: InvitProps) => {
  const values = props.value;
  const socket = useContext(SocketContext);
  const user = useContext(UserDataContext);

  return (
    <div key={values.id} className="FriendsPh min-w-[190px] h-[230px] bg-[#040A2F] mr-[15px] flex flex-col items-center">
      <div className="relative">
        <div
          className="mt-[16px] inline-block rounded-full overflow-hidden border-2 border-transparent shadow-lg w-[60px] h-[60px]"
          style={{ outline: ".2px solid #535C91" }}
        >
          <Image
            className="bg-cover bg-center w-full h-full"
            src={values.sender.image}
            width={60}
            height={60}
            alt="user"
          />
        </div>
      </div>
      <div className="containerFriend__info">
        <h3 className="text-[16px]">{values.sender.userName}</h3>
        <p className="text-center text-[#8A99E9] text-[12px]">#12</p>
      </div>
      <div className="flex items-center justify-center  w-[100%] gap-6 mt-12">
        <Image
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
          src="./iconsProfile/Deny.svg"
          width={32}
          height={32}
          property="true"
          alt="online"
        />
        <Image
          onClick={() => socket?.emit("NewFriend",{id: values.sender.id, userId: user?.id})}
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
          src="./iconsProfile/Accept.svg"
          width={32}
          height={32}
          property="true"
          alt="online"
        />
      </div>
    </div>
  );
};

const Invits = () => {
  // const [Invits, setInvits] = useState<InvitsType[] | null>(null);

  const Invits = useContext(ProfileDataContext)?.InvitsData;

  return (
    <>
      {Invits &&
        Invits.map((invit: InvitsType) => {
          return <Invit key={invit.id} value={invit} />;
        })}
    </>
  );
};
export default Invits;
