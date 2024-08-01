"use client";
import Awards from "@/components/userProfile/Awards";

import "@/styles/userProfile/userprofile.css";
import next from "next";
import { useContext } from "react";
import Image from "next/image";
import { useState } from "react";
import { SENTINVIT, USER } from "../users/page";
import ProfileDataContext from "./../../components/context/profilDataContext";
import SocketContext from "./../../components//context/socket";
import UserDataContext from "./../../components//context/context";
import RenderContext from "./../../components//context/render";
import { GameContext } from "../Game/Gamecontext/gamecontext";
import { useRouter } from "next/navigation";
import ChatContext from "@/components/context/chatContext";
import { MdOutlinePersonAddDisabled } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { IoGameController } from "react-icons/io5";

const FriendsType = (props: { value: USER }) => {
  const socket = useContext(SocketContext);
  const user = useContext(UserDataContext);
  const context = useContext(ChatContext);
  const router = useRouter();

  const render = useContext(RenderContext);

  const block = (id: number) => {
    socket?.emit("NewBlocked", { id: id, userId: user?.id });
  };
  const game = useContext(GameContext);

  const sendGame = (id: number) => {
    socket?.emit("SendGameInvite", {
      invitationSenderID: user?.id,
      mode: "friend",
      friendId: id,
    });
  };

  const [blocking, setBlocking] = useState<boolean>(false);
  return (
    <>
      <div
        className={`${
          blocking ? "hidden" : "flex"
        } flex items-center justify-center  w-[100%] gap-4 mt-10 mr-4`}
      >
        <Image
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
          src="./iconsProfile/Gamepad_solid.svg"
          width={28}
          height={28}
          property="true"
          onClick={() => {
            game?.setGamemode("friend");
            game?.settype("friend");
            game?.setgamefriend(props.value.id);
            console.log("send game1 ", game?.gametype, "33");
            sendGame(props.value.id);
            console.log("send game ", props.value.id, user?.id);
            render?.setRender("playGame");
          }}
          alt="online"
        />
        <Image
          src="/iconsProfile/Chat_solid.svg"
          width={24}
          height={24}
          onClick={() => {
            context?.setLabel({ id: props.value.id, isRoom: false });
            // handleChat();
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
      <div className="flex items-center justify-center text-white w-[100%] gap-4 mt-12">
        {blocking && <p>Blocking...</p>}
      </div>
    </>
  );
};

const InvitType = (props: { value: USER }) => {
  const values = props.value;
  const socket = useContext(SocketContext);
  const user = useContext(UserDataContext);
  const [Accepting, setAccepting] = useState<boolean>(false);
  const [deny, setDeny] = useState<boolean>(false);
  const router = useRouter();
  const context = useContext(ChatContext);

  return (
    <>
      <div
        className={`${
          Accepting || deny ? "hidden" : "flex"
        } flex items-center justify-center   w-[100%] gap-4 mt-10 mr-4`}
      >
        <Image
          onClick={() => {
            setDeny(true);
            socket?.emit(
              "DenyFriend",
              { id: values.id, userId: user?.id },
              (error: Error | string) => {
                error ? setDeny(false) : setDeny(true);
              }
            );
          }}
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
          src="./iconsProfile/Deny.svg"
          width={30}
          height={30}
          property="true"
          alt="online"
        />
        <Image
          onClick={() => {
            setAccepting(true);
            socket?.emit(
              "NewFriend",
              { id: values.id, userId: user?.id },
              (error: Error | string) => {
                error ? setAccepting(false) : setAccepting(true);
              }
            );
          }}
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
          src="./iconsProfile/Accept.svg"
          width={32}
          height={32}
          property="true"
          alt="online"
        />
        <Image
          src="/iconsProfile/Chat_solid.svg"
          width={30}
          height={30}
          onClick={() => {
            context?.setLabel({ id: props.value.id, isRoom: false });
            // handleChat();
          }}
          alt="online"
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out w-[30px] h-[30px] min-h-[30px]"
        />
      </div>

      <div className="flex items-center justify-center w-[100%] mt-12">
        {Accepting && (
          <p className="text-[#8A99E9] text-[14px]">Accepting...</p>
        )}
        {deny && <p className="text-[#8A99E9] text-[14px]">Denied</p>}
      </div>
    </>
  );
};

const SentInvit = (props: { value: USER }) => {
  const socket = useContext(SocketContext);
  const user = useContext(UserDataContext);
  const router = useRouter();
  const context = useContext(ChatContext);
  const [canceled, setCanceled] = useState<boolean>(false);

  return (
    <>
      <div
        className={`${
          canceled ? "hidden" : "flex"
        } flex items-center justify-center  w-[100%] gap-4 mt-10 mr-4`}
      >
        <div
          onClick={() => {
            socket?.emit("DeleteFriend", {
              id: props.value.id,
              userId: user?.id,
            });
            setCanceled(true);
          }}
        >
          <MdOutlinePersonAddDisabled className="text-[#8a99e9] cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out w-[30px] min-h-[30px]" />
        </div>
        <Image
          src="/iconsProfile/Chat_solid.svg"
          width={30}
          height={30}
          onClick={() => {
            context?.setLabel({ id: props.value.id, isRoom: false });
            // handleChat();
          }}
          alt="online"
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out w-[30px] h-[30px] min-h-[30px]"
        />
      </div>
      <div className="flex items-center justify-center w-[100%] mt-12">
        {canceled && <p className="text-[#8A99E9] text-[14px]">Canceled</p>}
      </div>
    </>
  );
};

const AddFried = (props: { value: USER }) => {
  const socket = useContext(SocketContext);
  const user = useContext(UserDataContext);
  const router = useRouter();
  const context = useContext(ChatContext);

  const [sent, setSent] = useState<boolean>(false);
  return (
    <>
      <div
        className={`${
          sent ? "hidden" : "flex"
        } flex items-center justify-center  w-[100%] gap-4 mt-10 mr-4`}
      >
        <IoMdPersonAdd
          className="w-[30px] text-[#8a99e9] h-[30px]  cursor-pointer  hover:scale-[120%] transition-all duration-300 ease-in-out"
          onClick={() => {
            socket?.emit("NewInvit", { id: props.value.id, userId: user?.id });
            setSent(true);
          }}
        />
          <Image
          src="/iconsProfile/Chat_solid.svg"
          width={30}
          height={30}
          onClick={() => {
            context?.setLabel({ id: props.value.id, isRoom: false });
            // handleChat();
          }}
          alt="online"
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out w-[30px] h-[30px] min-h-[30px]"
        />
      </div>
      <div className="flex items-center justify-center w-[100%] mt-12">
        {sent && <p className="text-[#8A99E9] text-[14px]">Invitation Sent</p>}
      </div>
    </>
  );
};

const ProfileOverlay = (props: { userData: USER; Type: string | null }) => {
  // const context = useContext(UserDataContext);

  return (
    <div className="userProfile">
      <div className="HeadProfile">
        <div className="ImgHeadProfileContainer">
          <div className="relative">
            <>
              {props.userData.inGame && props.userData.online && (
                <IoGameController
                  className={`bg-[#1B1A55] absolute rounded-full  -top-[-18px] -right-[-8px] text-blue-500 transform translate-x-1/2 translate-y-1/2 `}
                  style={{ outline: "4px solid #1B1A55" }}
                />
              )}

              {!props.userData.inGame && props.userData.online && (
                <p
                  className={` bg-green-500 absolute w-2.5 h-2.5 rounded-full  -top-[-18px] -right-[-8px] transform translate-x-1/2 translate-y-1/2 border-[4px] border-transparent `}
                  style={{ outline: "4px solid #1B1A55" }}
                ></p>
              )}
            </>
            <div
              className="mt-[16px] inline-block rounded-full overflow-hidden border-2 border-transparent shadow-lg w-[75px] h-[75px]"
              style={{ outline: ".2px solid #535C91" }}
            >
              <Image
                className="bg-cover bg-center w-full h-full cursor-pointer"
                src={props?.userData?.image || "./defaultImg.svg"}
                width={75}
                height={75}
                alt="user"
              />
            </div>
          </div>
          <div>
            <h2 className="ProfileUserName text-[20px] sm:text-xl">
              {props?.userData?.userName}
              <span> #{props?.userData.level} </span>
            </h2>
            <h3 className="ProfileUserFName">
              {props?.userData?.firstName + " " + props?.userData?.lastName}
            </h3>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex sm:mr-[35%] p-1 gap-1 mt-2 sm:gap-0 sm-p-0 justify-center">
            <div>
              <h3 className="WinsLowssers">Wins</h3>
              <h3 className="counterWinsLowsers">
                {props?.userData.winCounter}
              </h3>
            </div>
            <div>
              <h3 className="WinsLowssers">Losses</h3>
              <h3 className="counterWinsLowsers">
                {props?.userData.lossCounter}
              </h3>
            </div>
          </div>
          {props?.userData && props.Type == "friend" && (
            <FriendsType value={props.userData} />
          )}
          {props?.userData && props.Type == "invit" && (
            <InvitType value={props.userData} />
          )}
          {props?.userData && props.Type == "notFriend" && (
            <AddFried value={props.userData} />
          )}
          {props?.userData && props.Type == "sentInvit" && (
            <SentInvit value={props.userData} />
          )}
        </div>
      </div>

      <div className={"profileAwards "}>
        <Awards />
      </div>
    </div>
  );
};

export default ProfileOverlay;
