import "@/styles/userProfile/userFriend.css";
import React, { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaAward } from "react-icons/fa6";
import axios from "axios";
import { CircularProgress } from "@mui/material";

type AwardData = {
  idx: number;
  achivement: number[];
};

const Award: React.FC<{ data: AwardData }> = (props) => {
  const { data } = props;
  const [AwardDiscription, setdiscription] = useState<string>("");
  const [AwardImage, setAwardImage] = useState<string>("");
  const [AwardTitle, setAwardTitle] = useState<string>("");
  const [IsRealised, setIsRealised] = useState<boolean>(false);

  useEffect(() => {
    if (data.achivement.includes(data.idx)) setIsRealised(true);
    switch (data.idx) {
      case 1:
        setdiscription("You have ");
        setAwardImage("./Awards/valAward.svg");
        setAwardTitle("Dark Valley");
        break;
      case 2:
        setdiscription("You have ");
        setAwardImage("./Awards/flamAward.svg");
        setAwardTitle("Flam Arina");
        break;
      case 3:
        setdiscription("You have ");
        setAwardImage("./Awards/winAward.svg");
        setAwardTitle("First Win");
        break;
      case 4:
        setdiscription("You have ");
        setAwardImage("./Awards/winAward.svg");
        setAwardTitle("Win 3");
        break;
      case 5:
        setdiscription("You have ");
        setAwardImage("./Awards/winAward.svg");
        setAwardTitle("Win 42");
        break;
      case 6:
        setdiscription("You have ");
        setAwardImage("./Awards/Award Medal 6.svg");
        setAwardTitle("Big Win");
        break
      case 7:
        setdiscription("You have ");
        setAwardImage("/iconsProfile/Award Medal 6.svg");
        setAwardTitle("The Great Wall");
        break;
      case 8:
        setdiscription("You have ");
        setAwardImage("/iconsProfile/Award Medal 6.svg");
        setAwardTitle("The Great Wall");
        break;
      case 9:
        setdiscription("You have ");
        setAwardImage("/iconsProfile/Award Medal 6.svg");
        setAwardTitle("The Great Wall");
        break;
      case 10:
        setdiscription("You have ");
        setAwardImage("/iconsProfile/Award Medal 6.svg");
        setAwardTitle("The Great Wall");
        break;
      default:
        break;
    }
  }, []);

  return (
    <div className={`${!IsRealised ? 'opacity-[.5] blur-[.5px]' :' opacity-[1]'} FriendsPh max-w-[140px] min-w-[140px] rounded-[5px] h-[140px] flex justify-center flex-col items-center `}>
      <Image
        src={AwardImage}
        width={110}
        height={110}
        priority={true}
        alt="user"
        className="bg-cover bg-center w-full h-full max-w-[110px] max-h-[110px]  overflow-hidden border-2 border-transparent shadow-lg"
      />
      <div className="text-[14px] text-[#9FEAFF]">{AwardTitle}</div>
    </div>
  );
};

const Awards = () => {
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
    const getAwardsData = async () => {
      const response = await axios.get(
        process.env.NEST_API + "/user/achievements",
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
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>", awards);
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
