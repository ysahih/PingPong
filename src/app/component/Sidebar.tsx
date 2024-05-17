"use client";
import Image from "next/image";
import Profile from "./Profile";
import { use, useEffect, useState } from "react";
import axios from "axios";
import Router from "next/navigation";
import { useRouter, usePathname } from "next/navigation";
import UserDataContext, { UserData } from "@/components/context/context";
import { useContext } from "react";
import RenderContext, { renderContext } from "@/components/context/render";
import SocketContext from "@/components/context/socket";

const Buttons = () => {
  const context: renderContext | null = useContext(RenderContext);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (pathName === "/") {
      context?.setRender("home");
    } else if (pathName === "/Game") {
      context?.setRender("games");
    } else if (pathName === "/Ranking") {
      context?.setRender("ranking");
    } else if (pathName === "/Search") {
      context?.setRender("search");
    }
  }
  , [pathName]);

  return (
    <div className="buttons">
      <div
        className={`sideButton ${
          context?.render === "home" ? "activeChatButton" : ""
        }`}
        onClick={() => {context?.setRender("home")
        router.push("/")
      }}
      >
        <Image
          className="icon"
          src="./homeImages/HomeIcon.svg"
          alt="logo"
          width={14}
          height={18}
        />
        <h2>Home</h2>
      </div>

      <div
        className={`sideButton ${
          context?.render === "games" ? "activeChatButton" : ""
        }`}
        onClick={() => {context?.setRender("games")
        router.push("/Game")
      }}
      >
        <Image
          className="icon"
          src="./homeImages/gamesicon.svg"
          alt="logo"
          width={20}
          height={18}
        />
        <h2>Games</h2>
      </div>

      <div
        className={`sideButton ${
          context?.render === "ranking" ? "activeChatButton" : ""
        }`}
        onClick={() => {context?.setRender("ranking")
        router.push("/Ranking")
      }}
      >
        <Image
          className="icon"
          src="./homeImages/rankingicon.svg"
          alt="logo"
          width={20}
          height={18}
        />
        <h2>Ranking</h2>
      </div>

      <div
        className={`sideButton ${
          context?.render === "search" ? "activeChatButton" : ""
        }`}
        onClick={() => {context?.setRender("search")
        router.push("/Search")
      }}
      >
        <Image
          className="icon"
          src="./homeImages/searchicon.svg"
          alt="logo"
          width={20}
          height={18}
        />
        <h2>Search</h2>
      </div>

      <div
        className={`sideButton visible xl:invisible ${
          context?.render === "chat" ? "activeChatButton" : ""
        }`}
        onClick={() => context?.setRender("chat")}
      >
        <Image
          className="icon"
          src="./homeImages/chaticon.svg"
          alt="logo"
          width={20}
          height={18}
        />
        <h2>Chat</h2>
      </div>
    </div>
  );
};

const PhoneButtons = () => {
  const context: renderContext | null = useContext(RenderContext);

  return (
    <div className="phonebuttons">
      <div
        className={`phonebutton ${
          context?.render === "home" ? "activeChatButton" : ""
        }`}
        onClick={() => context?.setRender("home")}
      >
        <Image
          className="Phoneicon"
          src="./homeImages/HomeIcon.svg"
          alt="logo"
          width={24}
          height={20}
        />
      </div>

      <div
        className={`phonebutton ${
          context?.render === "games" ? "activeChatButton" : ""
        }`}
        onClick={() => context?.setRender("games")}
      >
        <Image
          className="Phoneicon"
          src="./homeImages/gamesicon.svg"
          alt="logo"
          width={30}
          height={18}
        />
      </div>
      <div
        className={`phonebutton ${
          context?.render === "ranking" ? "activeChatButton" : ""
        }`}
        onClick={() => context?.setRender("ranking")}
      >
        <Image
          className="Phoneicon"
          src="./homeImages/rankingicon.svg"
          alt="logo"
          width={30}
          height={18}
        />
      </div>
      <div
        className={`phonebutton ${
          context?.render === "search" ? "activeChatButton" : ""
        }`}
        onClick={() => context?.setRender("search")}
      >
        <Image
          className="Phoneicon"
          src="./homeImages/searchicon.svg"
          alt="logo"
          width={30}
          height={18}
        />
      </div>
      <div
        className={`phonebutton ${
          context?.render === "chat" ? "activeChatButton" : ""
        }`}
        onClick={() => context?.setRender("chat")}
      >
        <Image
          className="Phoneicon"
          src="./homeImages/chaticon.svg"
          alt="logo"
          width={24}
          height={18}
        />
      </div>
    </div>
  );
};

const Sidebar = (props: { showPopup: boolean}) => {
  const data: UserData | null = useContext(UserDataContext);
  const router = useRouter();
  const socket = useContext(SocketContext);
  
  async function Logout() {
    
    
    try {
      const res = await axios.get(process.env.NEST_API + "/logout", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data) {
        // //console.log('Success:', data);
        socket?.disconnect();
        router.push("/login");
      }
    } catch (error) {
      //console.error('Error:', error);
    }
  }

  return (
    <>
      <div className="Sidebar drift-animation">
        <Buttons />
        <div className="logout">
          <Profile src={data?.image} sidBar/>

          <h2 className="Username mb-[10px]">{data?.userName}</h2>

          <div className="logoutSection">
            <button className="logoutbutton" onClick={Logout}>
              logout
            </button>
          </div>
        </div>
      </div>

     {props.showPopup && <div className="PhoneSidebar drift-animation" >
        <PhoneButtons />
        <div className="logoutIcon" onClick={Logout} style={{
              width: "auto",
              height: "auto",
            }}>
          <Image
            className="logoutimage"
            src="./homeImages/logouticon.svg"
            alt="logo"
            width={26}
            height={30}
            
          />
        </div>
      </div>}
    </>
  );
};

export default Sidebar;
