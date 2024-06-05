"use client";
import Awards from "@/components/userProfile/Awards";

import "@/styles/userProfile/userprofile.css";
import next from "next";
import { useContext } from "react";
import Image from "next/image";
import { useState } from "react";

const ProfileOverlay = () => {
    // const context = useContext(UserDataContext);

    const [blocking, setBlocking] = useState<boolean>(false);
    return (
      <div className="userProfile">
        <div className="HeadProfile">
          <div className="ImgHeadProfileContainer">
            <Image
              className="ImgHeadprofile w-[70px] h-[70px] rounded-full md:w-[75px] md:h-[75px] "
              src="/defaultImg.svg"
              width={75}
              height={75}
              alt="avatar"
            />
            <div>
              <h2 className="ProfileUserName text-[20px] sm:text-xl">
                {/* {context?.userName} <span> #12 </span> */}
              </h2>
              <h3 className="ProfileUserFName">
                {/* {context?.firstName + " " + context?.lastName} */}
              </h3>
            </div>
          </div>
          <div className="flex flex-col items-end">

            <div>
              <p
                className=" w-2.5 h-2.5 bg-green-500 rounded-full"
                ></p>
            </div>

            <div className="flex sm:mr-[35%] p-1 gap-1 sm:gap-0 sm-p-0 justify-center">
              <div>
                <h3 className="WinsLowssers">Wins</h3>
                <h3 className="counterWinsLowsers">30</h3>
              </div>

              <div>
                <h3 className="WinsLowssers">Losses</h3>
                <h3 className="counterWinsLowsers">5</h3>
              </div>

            </div>

          <div className={`${blocking? 'hidden' : 'flex'} flex items-center justify-center  w-[100%] gap-4 mt-12`}>
              <Image
                className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
                src="/iconsProfile/Gamepad_solid.svg"
                width={28}
                height={28}
                property="true"
                onClick={()=>{
                  // game?.setGamemode("friend")
                  // game?.settype("friend");
                  // game?.setgamefriend(props.value.id);
                  // console.log("send game1 " ,game?.gametype , "33")
                  // sendGame(props.value.id);
                  // console.log("send game " , props.value.id , user?.id);
                  // render?.setRender("playGame");
                }}
                alt="online"
              />
              <Image
                src="/iconsProfile/Chat_solid.svg"
                width={24}
                height={24}
                property="true"
                onClick={() => {
                  // context?.setChat(props.value.id);
                }}
                alt="online"
                className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out w-[24px] min-h-[24px]"
                style={{
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '24px',
                  maxHeight: '24px',
                }}
              />
              <Image
                onClick={() => {
                  setBlocking(true);
                  // block(props.value.id);
                }}
                className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
                src="/iconsProfile/User-block.svg"
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
        </div>
        
        <div className={"profileAwards "}>
          <Awards />
        </div>
      </div>
    );
  };
  
  export default ProfileOverlay;
  