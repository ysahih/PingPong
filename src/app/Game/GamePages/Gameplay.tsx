"use client";

import { use, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
// import '@/app/globals.css'
import SocketContext from "@/components/context/socket";
import UserDataContext from "@/components/context/context";
import Game from "./Game";
import { GameContext, GameLodingProps, Userinfo } from "../Gamecontext/gamecontext";
import RenderContext from "@/components/context/render";


const  PlayerReady : React.FC<{lodingdata : Userinfo } > = (props) => {
  const user = props.lodingdata;
  const game = useContext(GameContext);
  return (
    <div className=" w-[100px] h-[60px]      flex flex-col justify-center items-center   " >
      <div  className="  w-[40px] h-[60px] " >
        <Image  className="rounded-full"  src={  (game?.gametype == "ai"  && user.username == "ROBOT")  ? "./homeImages/robot.svg"    :  ( user?.image || "./GamePlayImages/GamePlayerProfile.svg") }width={70} height={70}  alt ="Player image" />
      </div>
      <p  className="text-white text-[10px]  md:text-[15px] text-center   " >{user?.username}</p>
      <p  className="text-white  text-[10px]  md:text-[12px] text-center "> lv{user?.level}</p>
    </div>
  )
}

const PlayerLoding = ( ) => {  
  return (
    <div className=" loader  w-[100px] h-[60px]      flex justify-center items-center   ">
      <div  className="box-load1  w-[10px] h-[10px] md:w-[20px] md:h-[20px] rounded-3xl  "></div>
      <div  className="box-load2  w-[10px] h-[10px] md:w-[20px] md:h-[20px] rounded-3xl   "></div>
      <div  className="box-load3 w-[10px] h-[10px] md:w-[20px] md:h-[20px] rounded-3xl "></div>
    </div>
  )
}

const GameLoding : React.FC<{lodingdata : GameLodingProps } > = ( props ) => {

  
  return (
    <div className="flex items-center justify-center  min-h-screen">
      <div className="w-[200px] h-[160px]  md:w-[600px] md:h-[450px] rounded-[15px]  md:rounded-[20px] bg-[#070F2B] flex  items-center flex-col pt-2 pl-6 md:pt-6 pr-6 ">
        <p  className="text-[#8A99E9]  text-[20px]  md:text-[40px]    "  ></p>
        <div className="card  w-[200px] h-[140px]  md:w-[590px] md:h-[400px] " >
            <svg height="100%" width="100%" viewBox="0 0 590 400" className="border " >
              <line y1="1" x2="1770" y2="1" x1="0" strokeLinecap="round" className="top"></line>
              <line y2="-800" x2="0" y1="400" x1="0" strokeLinecap="round" className="left"></line>
              <line y2="398" x2="-1180" y1="398" x1="590"  strokeLinecap="round" className="bottom"></line>
              <line y2="1200" x2="588" y1="0" x1="588" strokeLinecap="round" className="right"></line>
            </svg>
            <div className="w-[100%]  md:w-[80%] h-[100%] m-auto  mt-[-140px]  md:mt-[-400px]   flex  justify-around  items-center ">
              <PlayerReady  lodingdata={props.lodingdata.users[0]} />
              <div className="w-[1px] md:w-[3px] h-[110px] md:h-[330px]  bg-[#0064FB] "> </div>
              { props.lodingdata.users.length < 2?<PlayerLoding />: <PlayerReady lodingdata={props.lodingdata.users[1]}  />}
            </div>
        </div>    
      </div>
    </div>
  )
}

const Gameplay : React.FC<{  }> = ( ) => {
    const game = useContext(GameContext);
    const user = useContext(UserDataContext);
    const socket = useContext(SocketContext);
    const render = useContext(RenderContext);
    useEffect(() => {
      const handlcheck = () => {
      if (game?.lodingdata && game?.lodingdata.users.length < 2)
      {
          game?.setRunning(false);
          game?.setlodingdata({
          users  : [{
            clientid : user?.id || -1 ,
               image : user?.image || "no image",
               username : user?.userName || "no name" ,
                ingame : false,
                level : user?.level || 0,
                mode : game?.gamemode || ""
          } ] ,
        gameloding: true });   
        game?.setplayerposition("");
        game?.setGamemode("");
        game?.settype("");
        game?.setgamefriend(-1);
        socket?.emit("endGame" , { clientid: user?.id })
        render?.setRender("home");
        
      }
      }
      const gametimeout = setTimeout(handlcheck, 5000 ); 
      return () => {
        clearTimeout(gametimeout);
      }
    }, [game?.lodingdata])

    useEffect(() => 
    {
      const handlegameroom =(responsedata : { room  :{ users : Userinfo[]  , gameloding : boolean} , alreadymatch : boolean  }) =>
      {
     
        if ( responsedata && responsedata.room  && responsedata.room.users && responsedata.room.users.length == 2) 
        {

          if (game?.lodingdata && game?.lodingdata.users.length < 2 && responsedata.room.users[0].clientid ==  user?.id )
          {
            game?.setGamemode(responsedata.room.users[0].mode)
            game?.setplayerposition("left");
          }
          else if  (game?.lodingdata &&  game?.lodingdata.users.length < 2  && responsedata.room.users[1].clientid == user?.id)
          {
            game?.setplayerposition("right");
            var tmp = responsedata.room.users[0];
            responsedata.room.users[0] = responsedata.room.users[1];
            responsedata.room.users[1] = tmp;
            game?.setGamemode(responsedata.room.users[0].mode)
          }
          if (game?.lodingdata &&  game?.lodingdata.users.length  < 2)
            game?.setlodingdata({users : responsedata.room.users,gameloding : true});
            if (responsedata && responsedata.alreadymatch)
               game?.setRunning(true);
       }
      }

      const gamematch = () => {
        socket?.emit("RandomGameroom",   { userid : user?.id ,  soketid :socket?.id  , type : game?.gametype , mode : game?.gamemode , friend : game?.gamefriend});
        socket?.on("RandomGameroom", handlegameroom )
      }
      const timematch = setTimeout(gamematch, 1000);
      return () => {
        socket?.off("RandomGameroom", handlegameroom);
        clearTimeout(timematch);
      }
    } ,[socket]);



      useEffect(() => {
        if (game?.lodingdata && game?.lodingdata.users.length == 2 )
        {
          setTimeout(() => {
            game?.setRunning(true);
          }, 3000);
        }
      } ,  [game?.lodingdata])


    return ( 
        <div>
          { game?.Isrunning == false  && <GameLoding lodingdata={game.lodingdata}  />} 
          { game?.Isrunning == true &&  <Game />} 
    </div>
     );
}

export default Gameplay;
