import "@/styles/userProfile/userFriend.css";
import React, { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaAward } from "react-icons/fa6";
import axios from "axios";
import { CircularProgress } from "@mui/material";




type AwardData = {

  idx: number;
  achivement : number[];
};



const Award  : React.FC<{   data  : AwardData  }> = (props) => {

  console.log("||||" , props.data);

   return (
    <div className=" FriendsPh max-w-[120px] min-w-[120px] rounded-[5px] h-[120px] flex justify-center">
        <Image  src="/iconsProfile/Award Medal 6.svg"
          width={100}
          height={100}
          priority={true}
          alt="user"
          className="bg-cover bg-center w-full h-full max-w-[100px] max-h-[100px]  overflow-hidden border-2 border-transparent shadow-lg"
        />
    </div>
    )
};

const Awards = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [stateClick, setStateClick] = useState(0);
    const [Achievement, setAchievement] = useState([]);
    const [reciveresponse , setreciveresponse] = useState<boolean>(false);


  
    const onDragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (scrollContainerRef.current) {
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        scrollContainerRef.current.style.cursor = "grabbing";
        scrollContainerRef.current.style.userSelect = "none";
        e.preventDefault(); // This is important to prevent the default text selection behavior
      }
    };
  
    const onDragEnd = () => {
      if (scrollContainerRef.current) {
        setIsDragging(false);
        scrollContainerRef.current.style.cursor = "grab";
        scrollContainerRef.current.style.removeProperty("user-select");
      }
    };
  
    const onDragMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (isDragging && scrollContainerRef.current) {
        const currentX = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (currentX - startX) * 2; // The number 2 determines the scroll speed
        scrollContainerRef.current.scrollLeft -= walk;
        setStartX(currentX);
      }
    };

      useEffect (() => {
        const Awards = async () => { 
          const response =  await axios.get(process.env.NEST_API + "/user/achievements", {
            withCredentials: true
        });
        if (response.data) {
          setAchievement(response.data);
          setreciveresponse(true);
          console.log(  ">>>>>>>>>>>>>>>>>>>>>>>>>>" ,  response.data);
        }
      }
      Awards();

      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>");
      },[]);



    return (
      <div className="containerUserFriends relative">
        <div className="flex p-[20px] pt-[20px]">
          <div
            className={`cursor-pointer pr-[5%] text-[24px] text-[#8A99E9] flex justify-center items-center text-center gap-2 hover:scale-[110%] transition-all duration-300 ease-in-out ${stateClick !== 0? 'opacity-25': ''}`}
            onClick={() => {
              setStateClick(0);
              scrollContainerRef.current?.scrollTo({ left: 0 });
            }}
          >
            <FaAward />
            <span className="mt-[4px]">Awards</span>
          </div>
        </div>
        <div
        className="mx-auto h-[240px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-y-scroll overflow-x-hidden"
        style={{ maxWidth: '96%' }}
          ref={scrollContainerRef}
          onMouseDown={onDragStart}
          onMouseLeave={onDragEnd}
          onMouseUp={onDragEnd}
          onMouseMove={onDragMove}
        >
        {/* {
          !reciveresponse ? (
            <div className="w-[100%] h-[100%]  flex items-center justify-center ">
              <CircularProgress />
            </div>
          ) : (
            Achievement.map((achievement: AwardData, i: number) => (
              <Award data={{ idx: i,  achivement : Achievement }} key={i} />
            ))
          )
        }
          */}
        </div>
      </div>
    );
};

export default Awards;
