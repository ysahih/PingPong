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
import axiosApi from "@/components/signComonents/api";

const Buttons = () => {
  const context: renderContext | null = useContext(RenderContext);
  const router = useRouter();
  const pathName = usePathname();



  return (
    <div className="buttons">
      <div
        className={`sideButton ${
          pathName === "/" ? "activeChatButton" : ""
        }`}
        onClick={() => {
          
        router.push("/")
      }}
      >
        <Image
          className="icon"
          src="/homeImages/HomeIcon.svg"
          alt="logo"
          width={14}
          height={18}
        />
        <h2>Home</h2>
      </div>

      <div
        className={`sideButton ${
          pathName === "/Game" ? "activeChatButton" : ""
        }`}
        onClick={() => {
        router.push("/Game")
      }}
      >
        <Image
          className="icon"
          src="/homeImages/gamesicon.svg"
          alt="logo"
          width={20}
          height={18}
        />
        <h2>Games</h2>
      </div>

      <div
        className={`sideButton ${
          pathName === "/Ranking" ? "activeChatButton" : ""
        }`}
        onClick={() => {
        router.push("/Ranking")
      }}
      >
        <Image
          className="icon"
          src="/homeImages/rankingicon.svg"
          alt="logo"
          width={20}
          height={18}
        />
        <h2>Ranking</h2>
      </div>

      <div
        className={`sideButton ${
          pathName === "/Search" ? "activeChatButton" : ""
        }`}
        onClick={() => {
        router.push("/Search")
      }}
      >
        <Image
          className="icon"
          src="/homeImages/searchicon.svg"
          alt="logo"
          width={20}
          height={18}
        />
        <h2>Search</h2>
      </div>

      <div
        className={`sideButton visible xl:invisible ${
          pathName === "/Chat" ? "activeChatButton" : ""
        }`}
        onClick={() => {
        router.push("/Chat")}}
      >
        <Image
          className="icon"
          src="/homeImages/chaticon.svg"
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
  const router = useRouter();
  const context: renderContext | null = useContext(RenderContext);
  const path = usePathname();

  return (
    <div className="phonebuttons">
      <div
        className={`phonebutton ${
          path === "/" ? "activeChatButton" : ""
        }`}
        onClick={() => {
        router.push("/")}}
      >
        <Image
          className="Phoneicon"
          src="/homeImages/HomeIcon.svg"
          alt="logo"
          width={24}
          height={20}
        />
      </div>

      <div
        className={`phonebutton ${
          path === "/Game" ? "activeChatButton" : ""
        }`}
        onClick={() => {
        router.push("/Game")}}
      >
        <Image
          className="Phoneicon"
          src="/homeImages/gamesicon.svg"
          alt="logo"
          width={30}
          height={18}
        />
      </div>
      <div
        className={`phonebutton ${
          path === "/Ranking" ? "activeChatButton" : ""
        }`}
        onClick={() => {
        router.push("/Ranking")}}
      >
        <Image
          className="Phoneicon"
          src="/homeImages/rankingicon.svg"
          alt="logo"
          width={30}
          height={18}
        />
      </div>
      <div
        className={`phonebutton ${
          path === "/Search" ? "activeChatButton" : ""
        }`}
        onClick={() => {
        router.push("/Search")}}
      >
        <Image
          className="Phoneicon"
          src="/homeImages/searchicon.svg"
          alt="logo"
          width={30}
          height={18}
        />
      </div>
      <div
        className={`phonebutton ${
          path === "/Chat" ? "activeChatButton" : ""
        }`}
        onClick={() => {
        router.push("/Chat")}}
      >
        <Image
          className="Phoneicon"
          src="/homeImages/chaticon.svg"
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
      const res = await axiosApi.get(process.env.NEST_API + "/logout", {
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
            src="/homeImages/logouticon.svg"
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
