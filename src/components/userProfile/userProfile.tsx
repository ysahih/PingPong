import "@/styles/userProfile/userFriend.css";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { FaUserFriends } from "react-icons/fa";
import { MdOutlineBlock } from "react-icons/md";
import { MdGroupAdd } from "react-icons/md";
import Friends from "./Friends";
import Blocked from "./Blocked";
import Invits from "./Invits";


const UserFriends = () => {
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
          <FaUserFriends />
          <span className="mt-[4px]">Friends</span>
        </div>
        <div
          className={`cursor-pointer pr-[5%] text-[24px] text-[#8A99E9] flex justify-center items-center text-center gap-2 hover:scale-[110%] transition-all duration-300 ease-in-out ${stateClick !== 1? 'opacity-25': ''}`}
          onClick={() => {
            setStateClick(1);
            scrollContainerRef.current?.scrollTo({ left: 0 });
          }}
        >
          <MdOutlineBlock />
          <span className="cursor-pointer mt-[4px]">Blocked</span>
        </div>
        <div
          className={`cursor-pointer pr-[5%] text-[24px] text-[#8A99E9] flex justify-center items-center text-center gap-2 hover:scale-[110%] transition-all duration-300 ease-in-out ${stateClick !== 2? 'opacity-25': ''}`}
          onClick={() => {
            setStateClick(2);
            scrollContainerRef.current?.scrollTo({ left: 0 });
          }}
        >
          <MdGroupAdd />
          <span className="cursor-pointer mt-[4px]">Invits</span>
        </div>
      </div>
      <div
        className="ml-[20px] mr-[15px] h-[250px] overflow-x-auto flex"
        ref={scrollContainerRef}
        onMouseDown={onDragStart}
        onMouseLeave={onDragEnd}
        onMouseUp={onDragEnd}
        onMouseMove={onDragMove}
      >
        {stateClick === 0 && <Friends />}
        {stateClick === 1 && <Blocked />}
        {stateClick === 2 && <Invits />}
      </div>
    </div>
  );
};

export default UserFriends;
