import ChatContext from "../context/chatContext";
import "@/styles/userProfile/userFriend.css";
import Image from "next/image";
import { useContext, useState } from "react";
import { FriendsType } from "./Dto";
import ProfileDataContext from "../context/profilDataContext";
import SocketContext from "../context/socket";
import UserDataContext from "../context/context";
import RenderContext from "../context/render";
import { GameContext } from "@/app/Game/Gamecontext/gamecontext";
import { useRouter } from "next/navigation";
import { IoGameController } from "react-icons/io5";
import ScreenWidth from "../context/screenWidth";

interface friendsType {
  value: FriendsType;
}

const Friend = (props: friendsType) => {
  const socket = useContext(SocketContext);
  const user = useContext(UserDataContext);
  const context = useContext(ChatContext);
  const router = useRouter();
  const screen = useContext(ScreenWidth);
  const render = useContext(RenderContext);

  const [blocking, setBlocking] = useState<boolean>(false);
  
  const block = (id: number) => {
    socket?.emit("NewBlocked", { id: id, userId: user?.id });
  };
  const game = useContext(GameContext);

  const sendGame = (id: number) => {
    socket?.emit("SendGameInvite", {
      invitationSenderID: user?.id,
      mode: "Dark Valley",
      friendId: id,
    });
  };
  
  return (
    <div className="FriendsPh min-w-[190px] h-[230px] bg-[#040A2F] mr-[15px] flex flex-col items-center">
      <div className="relative">
        <>
          {props.value.inGame && props.value.online && (
            <IoGameController
              className={`bg-[#1B1A55] absolute rounded-full  -top-[-12px] -right-[-8px] text-blue-500 transform translate-x-1/2 translate-y-1/2 `}
              style={{ outline: "4px solid #1B1A55" }}
            />
          )}

          {!props.value.inGame && props.value.online && (
            <p
              className={` bg-green-500 absolute w-2.5 h-2.5 rounded-full  -top-[-12px] -right-[-8px] transform translate-x-1/2 translate-y-1/2 border-[4px] border-transparent `}
              style={{ outline: "4px solid #1B1A55" }}
            ></p>
          )}
        </>
        <div
          className="mt-[16px] inline-block rounded-full overflow-hidden border-2 border-transparent shadow-lg w-[60px] h-[60px]"
          style={{ outline: ".2px solid #535C91" }}
        >
          <Image
            className="bg-cover bg-center w-full h-full cursor-pointer"
            src={props?.value?.image || "./defaultImg.svg"}
            onClick={() => {
              router.push(`/users?userName=${props.value.userName}`);
            }}
            width={60}
            height={60}
            alt="user"
          />
        </div>
      </div>
      <div className="containerFriend__info">
        <h3 className="text-[16px]">{props.value.userName}</h3>
        <p className="text-center text-[#8A99E9] text-[12px]">
          #{props.value.level}
        </p>
      </div>
      <div
        className={`${
          blocking ? "hidden" : "flex"
        } flex items-center justify-center  w-[100%] gap-4 mt-12`}
      >
        <Image
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
          src="./iconsProfile/Gamepad_solid.svg"
          width={28}
          height={28}
          property="true"
          onClick={() => {
            game?.setGamemode("Dark Valley");
            game?.settype("friend");
            game?.setgamefriend(props.value.id);
            sendGame(props.value.id);
            render?.setRender("playGame");
            router.push("/Game");
          }}
          alt="online"
        />
        <Image
          src="/iconsProfile/Chat_solid.svg"
          width={24}
          height={24}
          onClick={() => {
            context?.setLabel({ id: props.value.id, isRoom: false });
            if (!screen?.large)
                router.push("/Chat");
          }}
          alt="online"
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out w-[24px] h-[24px] min-h-[24px]"
        />
        <Image
          onClick={() => {
            setBlocking(true);
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
      <div className="flex items-center justify-center  w-[100%] gap-4 mt-12">
        {blocking && <p>Blocking...</p>}
      </div>
    </div>
  );
};

const Friends = () => {
  const Friends = useContext(ProfileDataContext)?.FriendsData;

  return (
    <>
      {Friends && Friends.length > 0 ? (
        Friends.map((friend: FriendsType) => {
          return <Friend key={friend.id} value={friend} />;
        })
      ) : (
        <div className="text-[#8A99E9] flex items-center justify-center w-[95%]">
          No Friends
        </div>
      )}
    </>
  );
};

export default Friends;
