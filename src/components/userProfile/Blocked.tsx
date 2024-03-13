import "@/styles/userProfile/userFriend.css";
import axios from "axios";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { FriendsType } from "./Dto";
import ProfileDataContext from "../context/profilDataContext";

interface BlockedType {
  value: FriendsType;
}

const unblock = async (id: number) => {
  try {
    const dataBlocked = await axios.patch(
      `http://localhost:3000/user/unblock?id=${id}`,
      {},
      {
        withCredentials: true,
      }
    );
    console.log(dataBlocked);
  } catch (error) {
    console.log(error);
  }
};

const Block = (props: BlockedType) => {
  return (
    <div className="FriendsPh min-w-[190px] h-[230px] bg-[#040A2F] mr-[15px] flex flex-col items-center">
      <div className="relative">
        <div
          className="mt-[16px] inline-block rounded-full overflow-hidden border-2 border-transparent shadow-lg w-[60px] h-[60px]"
          style={{ outline: ".2px solid #535C91" }}
        >
          <Image
            className="bg-cover bg-center w-full h-full"
            src={props.value.image}
            width={60}
            height={60}
            alt="user"
          />
        </div>
      </div>
      <div className="containerFriend__info">
        <h3 className="text-[16px]">{props.value.userName}</h3>
        <p className="text-center text-[#8A99E9] text-[12px]">#12</p>
      </div>
      <div className="flex items-center justify-center  w-[100%] gap-4 mt-12">
        <Image
          onClick={() => {
            unblock(props.value.id);
          }}
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
          src="./iconsProfile/unblock.svg"
          width={25}
          height={25}
          property="true"
          alt="online"
        />
      </div>
    </div>
  );
};

const Blocked = () => {
  // const [blocked, setBlocked] = useState<FriendsType[] | null>(null);

  const blocked = useContext(ProfileDataContext)?.BlockedData;

  return (
    <>
      {blocked &&
        blocked.map((value) => {
          return <Block key={value.id} value={value} />;
        })}
    </>
  );
};

export default Blocked;
