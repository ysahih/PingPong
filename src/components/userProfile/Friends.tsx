import ChatContext from "../context/chatContext";
import "@/styles/userProfile/userFriend.css";
import axios from "axios";
import Image from "next/image";
import { use, useContext, useEffect, useState } from "react";
import { FriendsType } from "./Dto";
import ProfileDataContext from "../context/profilDataContext";
import SocketContext from "../context/socket";
import UserDataContext from "../context/context";
import RenderContext from "../context/render";
// import RenderContext from "../context/render";


interface friendsType {
  value: FriendsType;
}


// const block = async (id: number) => {
//   try {
//     const dataBlocked = await axios.patch(
//       `http://localhost:3000/user/block?id=${id}`,
//       {},
//       {
//         withCredentials: true,
//       }
//     );
//     console.log(dataBlocked);
//   } catch (error) {
//     console.log(error);
//   }
// };

const Friend = (props: friendsType) => {
  const socket = useContext(SocketContext);
  const user = useContext(UserDataContext);
  const context = useContext(ChatContext);
  
  const render = useContext(RenderContext);
  
  const block = (id: number) => {
    socket?.emit("NewBlocked", { id: id, userId: user?.id });
  };

  return (
    <div className="FriendsPh min-w-[190px] h-[230px] bg-[#040A2F] mr-[15px] flex flex-col items-center">
      <div className="relative">
        {props.value.online && (
          <>
            <p
              className="absolute w-2.5 h-2.5 bg-green-500 rounded-full z-50 -top-[-12px] -right-[-8px] transform translate-x-1/2 translate-y-1/2 border-[4px] border-transparent "
              style={{ outline: "4px solid #040a2f" }}
            ></p>
            <p
              className="absolute w-2.5 h-2.5 bg-green-500 rounded-full -top-[-12px] -right-[-8px] transform translate-x-1/2 translate-y-1/2 border-[4px] border-transparent animationClass"
              style={{
                zIndex: 99,
              }}
            ></p>
          </>
        )}
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
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
          src="./iconsProfile/Gamepad_solid.svg"
          width={28}
          height={28}
          property="true"
          alt="online"
        />
        <Image
          src="./iconsProfile/Chat_solid.svg"
          width={23}
          height={24}
          property="true"
          alt="online"
          onClick={()=>{
            context?.setChat(props.value.id);
            render?.setRender("chat");
          
          }}
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
        />
        <Image
          onClick={() => {
            block(props.value.id);
          }}
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
          src="./iconsProfile/User-block.svg"
          width={28}
          height={28}
          property="true"
          alt="online"
        />
      </div>
    </div>
  );
};

const Friends = () => {
  // const [Friends, setFriends] = useState<FriendsType[] | null>(null);

  const Friends = useContext(ProfileDataContext)?.FriendsData;
  // useEffect(() => {
  //   setFriends( FriendsData|| null);
  // }
  // , [FriendsData] );

  return (
    <>
      {Friends &&
        Friends.map((friend: FriendsType) => {
          return <Friend key={friend.id} value={friend} />;
        })}
    </>
  );
};

export default Friends;
