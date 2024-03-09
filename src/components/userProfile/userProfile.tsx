import "@/styles/userProfile/userFriend.css";
import React, { useRef, useState } from "react";
import Image from "next/image";

const Friend = () => {
  return (
    <div className="FriendsPh min-w-[150px] h-[150px] bg-[#040A2F] mr-[15px] flex flex-col  items-center">
      <div className="relative">
        {/* Status Indicator */}
        <p className="absolute w-2.5 h-2.5 bg-green-500 rounded-full z-50 -top-[-10px] -right-[-6px] transform translate-x-1/2 translate-y-1/2 border-[1px] border-white"></p>

        {/* Profile Image */}
        <div
          className="mt-[10px] inline-block rounded-full overflow-hidden border-2 border-transparent shadow-lg w-[60px] h-[60px]"
          style={{ outline: ".2px solid #535C91" }}
        >
          <Image
            className="bg-cover bg-center w-full h-full"
            src="https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=1024x1024&w=is&k=20&c=LEk3Riu7RsJXkWMTEdmQ1yDkgf5F95ScLNZQ4j0P23g="
            width={60}
            height={60}
            objectFit="cover"
            alt="user"
          />
        </div>
      </div>
      <div className="containerFriend__info">
        <h3>Username</h3>
        <p>Online</p>
      </div>
    </div>
  );
};

const UserFriends = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

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
    <div className="containerUserFriends">
      <div className="w-100  flex p-[20px]">
        <h3 className="pr-[5%] text-2xl text-[#8A99E9]">Friends</h3>
        <h3 className="pr-[5%] text-2xl text-[#8A99E9]">Blocked</h3>
        <h3 className="pr-[5%] text-2xl text-[#8A99E9]">Invits</h3>
      </div>
      <div
        className="ml-[20px] mr-[15px] h-[180px] overflow-x-auto flex flex-row"
        ref={scrollContainerRef}
        onMouseDown={onDragStart}
        onMouseLeave={onDragEnd}
        onMouseUp={onDragEnd}
        onMouseMove={onDragMove}
      >
        <Friend />
        <Friend />
        <Friend />
        <Friend />
        <Friend />
        <Friend />
        <Friend />
        <Friend />
      </div>
    </div>
  );
};

export default UserFriends;
