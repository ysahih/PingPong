import "@/styles/userProfile/userFriend.css";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { FaAward } from "react-icons/fa6";

const Award = () => {

   return (
    <div className=" FriendsPh max-w-[120px] min-w-[120px] rounded-[5px] h-[120px] flex justify-center">
        <Image  src="./iconsProfile/Award Medal 6.svg"
          width={100}
          height={100}
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
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
          <Award/>
        </div>
      </div>
    );
};

export default Awards;
