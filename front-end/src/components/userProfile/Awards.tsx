import "@/styles/userProfile/userFriend.css";
import React, {useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaAward } from "react-icons/fa6";
import { CircularProgress, Tooltip } from "@mui/material";
import axiosApi from "../signComonents/api";

type AwardData = {
  idx: number;
  achivement: number[];
};

const Award: React.FC<{ data: AwardData }> = ({ data }) => {
  const [AwardDescription, setDescription] = useState<string>("");
  const [AwardImage, setAwardImage] = useState<string | null>(null); // Allow null initially
  const [AwardTitle, setAwardTitle] = useState<string>("");
  const [IsRealised, setIsRealised] = useState<boolean>(false);

  useEffect(() => {
    if (data.achivement.includes(data.idx)) setIsRealised(true);
    
    let description = "";
    let imagePath = "";
    let title = "";

    switch (data.idx) {
      case 1:
        description = "You win in Dark Valley";
        imagePath = "/Awards/DarkValleyAward.svg";
        title = "Dark Valley";
        break;
      case 2:
        description = "You win in Flame Arena";
        imagePath = "/Awards/FlameArenaAward.svg";
        title = "Flame Arena";
        break;
      case 3:
        description = "You win one time";
        imagePath = "/Awards/winAward.svg";
        title = "First Win";
        break;
      case 4:
        description = "You win 3 times";
        imagePath = "/Awards/winAward.svg";
        title = "Triple Win";
        break;
      case 5:
        description = "You win 42 times";
        imagePath = "/Awards/winAward.svg";
        title = "Champion 42";
        break;
      case 6:
        description = "You win 100 times";
        imagePath = "/Awards/BigWin.svg";
        title = "Centurion Win";
        break;
      case 7:
        description = "You reached level 1";
        imagePath = "/Awards/lvlAward.svg";
        title = "First Step";
        break;
      case 8:
        description = "You reached level 3";
        imagePath = "/Awards/lvlAward.svg";
        title = "Rookie";
        break;
      case 9:
        description = "You reached level 42";
        imagePath = "/Awards/lvlAward.svg";
        title = "Elite 42";
        break;
      case 10:
        description = "You reached level 100";
        imagePath = "/Awards/lvl100Award.svg";
        title = "Centurion";
        break;
      default:
        description = "";
        imagePath = "/Awards/default.svg"; // Fallback image
        title = "";
        break;
    }

    setDescription(description);
    setAwardImage(imagePath);
    setAwardTitle(title);
  }, [data.idx, data.achivement]);

  return (
    <Tooltip title={AwardDescription} placement="bottom" followCursor>
      <div className={`${!IsRealised ? 'opacity-[.5] blur-[.5px]' : 'opacity-[1]'} FriendsPh max-w-[140px] min-w-[140px] rounded-[5px] h-[140px] flex justify-center flex-col items-center cursor-pointer`}>
        {AwardImage ? (
          <Image
            src={AwardImage}
            width={110}
            height={110}
            priority={false}
            alt={AwardTitle}
            className="bg-cover bg-center w-full h-full max-w-[110px] max-h-[110px] overflow-hidden border-2 border-transparent shadow-lg"
          />
        ) : (
          <div className="bg-gray-200 w-[110px] h-[110px] flex items-center justify-center rounded-full">
            {/* Placeholder or loading spinner */}
            <span>Loading...</span>
          </div>
        )}
        <div className="text-[14px] text-[#9FEAFF]">{AwardTitle}</div>
      </div>
    </Tooltip>
  );
};

const Awards = (props: {userName: string}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [stateClick, setStateClick] = useState(0);
  // const [Achievement, setAchievement] = useState([]);
  const [reciveresponse, setreciveresponse] = useState<boolean>(false);
  const [Achievement, setAchievement] = useState<AwardData[]>();

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

  useEffect(() => {
    if (!props.userName) return;
    const getAwardsData = async () => {
      const response = await axiosApi.get(
        process.env.NEST_API + "/user/achievements/" + `${props.userName}`,
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        // setAchievement(response.data);
        setreciveresponse(true);
        let awards: AwardData[];

        awards = Array.from(
          { length: 10 },
          (_, index): AwardData => ({
            idx: index + 1,
            achivement: response.data, // Replace with your actual Achievement data
          })
        );
        awards = awards.map((award) => ({
          idx: award.idx,
          achivement: award.achivement,
        }));
        const achiv: AwardData[] = awards.filter((award) =>
          award.achivement.includes(award.idx)
        );
        const nanAchiv: AwardData[] = awards.filter(
          (award) => !award.achivement.includes(award.idx)
        );
        awards = achiv.concat(nanAchiv);
        
        setAchievement(awards);
      }
    };
    getAwardsData();
  }, []);

  return (
    <div className="containerUserFriends relative">
      <div className="flex p-[20px] pt-[20px]">
        <div
          className={`cursor-pointer pr-[5%] text-[24px] text-[#8A99E9] flex justify-center items-center text-center gap-2 hover:scale-[110%] transition-all duration-300 ease-in-out ${
            stateClick !== 0 ? "opacity-25" : ""
          }`}
          onClick={() => {
            setStateClick(0);
            scrollContainerRef.current?.scrollTo({ left: 0 });
          }}
        >
          <FaAward />
          <span className="mt-[4px]">Awards</span>
        </div>
      </div>

      {!reciveresponse ? (
        <div className="w-[100%] h-[100%]  flex items-center justify-center  ">
          <CircularProgress />
        </div>
      ) : (
        <div
          className="mx-auto h-[240px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-y-scroll overflow-x-hidden"
          style={{ maxWidth: "96%" }}
          ref={scrollContainerRef}
          onMouseDown={onDragStart}
          onMouseLeave={onDragEnd}
          onMouseUp={onDragEnd}
          onMouseMove={onDragMove}
        >
          {Achievement?.map((award) => (
            <Award key={award.idx} data={award} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Awards;
