import { use, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import Chat from "./component/Chat";
import "./globals.css";
import { FiChevronsRight } from "react-icons/fi";
import "@/styles/userProfile/userFriend.css";
import { Carousel, Typography, Button, Switch } from "@material-tailwind/react";
import ChatContext, { chatContext } from "@/components/context/chatContext";
import RenderContext, { renderContext } from "@/components/context/render";
import Gameplay from "./Game/GamePages/Gameplay";
import {
  GameContext,
  GameLodingProps,
  NotificationContext,
} from "./Game/Gamecontext/gamecontext";
import UserDataContext from "@/components/context/context";
import { CircularProgress } from "@mui/material";
import axiosApi from "@/components/signComonents/api";
import ScreenWidth from "@/components/context/screenWidth";
import { useRouter } from "next/navigation";

export const Tables = () => {
  return (
    <Carousel placeholder="carousel" className="tables rounded-lg z-10">
      <div className=" darktable relative h-1/2 w-full">
        <Image
          src="/homeImages/darkvalley.svg"
          alt="image 1"
          width={200}
          height={100}
          priority={true}
          className="h-full w-full object-cover"
        />
        <div className="playdarknow absolute inset-0 grid h-full w-full place-items-center ">
          <div className="w-3/4 text-center md:w-2/4">
            <Typography
              placeholder="type"
              variant="h2"
              color="white"
              className="typo"
            >
              Dark Valley
            </Typography>
            <div className="flex">
              <Button placeholder="button" className="playnow" color="blue">
                Play Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="lighttable relative h-full w-full">
        <img
          src="./homeImages/frozenarena.svg"
          alt="image 2"
          className="h-full w-full object-cover"
        />
        <div className="playlightnow absolute inset-0 grid h-full w-full place-items-center ">
          <div className=" w-3/4 text-center md:w-2/4">
            <Typography
              placeholder="type"
              variant="h2"
              color="white"
              className="typo"
            >
              Frozen Areana
            </Typography>

            <div className="flex text-sm">
              <Button placeholder="button" className="playnow" color="white">
                Play Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Carousel>
  );
};

const Match: React.FC<{ user: History }> = (props) => {
  return (
    <div className="match">
      <div className="opponent w-[30%] xl:mr-[-20%] mr-[-40%]">
        <Image
          className="rounded-full w-[30px] h-[30px]"
          src={props.user?.image || "@/public/defaultImg.svg"}
          alt="profile"
          width={26}
          height={26}
        />
        <p className="truncate min-w-[40px]">{props.user.userName}</p>
      </div>
      <div className="level">
        <p>{props.user.level}</p>
      </div>
      <div className="w-l">
        <p> {props.user.result} </p>
      </div>
    </div>
  );
};

interface History {
  userName: string;
  image: string;
  result: string;
  level: number;
}

export const NoHistoy = () => {
  return (
    <div className=" flex justify-center items-center w-[100%] h-[100%] font-inter  text-lg  font-light text-[#8A99E9] ">
      <p>NO MATCH PLAYED YET</p>
    </div>
  );
};

export const Statistics = () => {
  const [history, setHistory] = useState<History[]>([]);
  const [reciveresponse, SetReciveResponse] = useState<boolean>(false);
  useEffect(() => {
    const histories = async () => {
      const response = await axiosApi.get(
        process.env.NEST_API + "/user/history",
        {
          withCredentials: true,
        }
      );
      SetReciveResponse(true);
      if (response.data) setHistory(response.data);
    };
    histories();
  }, []);

  return (
    <>
      <div className="statistics-line flex items-center">
        <hr className="line" />
        <span className="px-4">Statistics</span>
        <hr className="line" />
      </div>
      <div className="Statistics flex flex-col max-h-[800px] overflow-y-auto">
        <div className="Statistics-head">
          <div className="">
            <p>Opponent</p>
          </div>

          <div>
            <p>Level</p>
          </div>

          <div>
            <p>W/L</p>
          </div>
        </div>
        <div className="matches  flex-1 flex flex-col">
          {!reciveresponse ? (
            <div className="w-[100%] h-[100%] flex items-center justify-center ">
              <CircularProgress />
            </div>
          ) : Array.isArray(history) && history.length > 0 ? (
            history.map((user: History, idx: number) => {
              return <Match key={user.userName + idx} user={user} />;
            })
          ) : (
            <NoHistoy />
          )}
        </div>
      </div>
    </>
  );
};

const Home = ({
  children,
  showPopup,
}: {
  children: React.ReactNode;
  showPopup: boolean;
}) => {

  return (
    <div className={showPopup ? "home-margin homepage" : "homepage"}>
      {/* <button onClick={() => setChoice(() => 0)} style={{position:"absolute", marginLeft: "200px", backgroundColor:"white"}}> RoomSettings </button>
    <button onClick={() => setChoice(() => 1)} style={{position:"absolute", marginLeft: "400px", backgroundColor:"white"}}> JoinRoom </button>
    <button onClick={() => setChoice(() => 2)} style={{position:"absolute", marginLeft: "300px", backgroundColor:"white"}}> CreateRoom </button> */}
      {/* {!choice && <RoomSettings name={"keepItUp"} />}
      {choice === 1 && <JoinRoom />}
      {choice === 2 && <CreateRoom />} */}
      {/* {context?.render === "home" && (
        <div className="home">
          <Tables />
          <Statistics />
        </div>
      )}
      {context?.render === "games" && <Games />}
      {context?.render === "ranking" && <Ranking />}
      {context?.render === "search" && <Search />}
      {context?.render === "profile" && <UserProfile />}
      {context?.render === "profileOverly" && <ProfileOverlay />}
      {context?.render === "chat" && (
        <div className="chatholder visible xl:invisible">{/* }</div>
      )} */}
      {children}
    </div>
  );
};

const Body = ({ children }: { children: React.ReactNode }) => {
  const [showPopup, setShowPopup] = useState(true);
  const [label, setLabel] = useState({ id: 0, isRoom: false });
  const context: renderContext | null = useContext(RenderContext);
  const screenWidth = useContext(ScreenWidth);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setShowPopup(false);
      else setShowPopup(true);
      if (window.innerWidth <= 1139) screenWidth?.setLarge(false);
      else {
        screenWidth?.setLarge(true);
        context?.setRender("home");
        router.push("/"); 
      }
    };
    // handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <ChatContext.Provider value={{ label, setLabel }}>
      <div className="body">
        <Sidebar showPopup={showPopup} />
        <div
          className="absolute cursor-pointer w-[80px] h-[50px] ml-[20px] text-white mt-[60px] flex items-center justify-center z-20 hidden PopupBtn"
          onClick={() => {
            setShowPopup(!showPopup);
          }}
        >
          <FiChevronsRight
            className={` w-[30px] h-[30px] ${
              showPopup ? "retation180" : "retation0"
            }`}
          />
        </div>
        <Home showPopup={showPopup}>{children}</Home>

        <div className="chatdiv hidden xl:block">
          <Chat />
        </div>
      </div>
    </ChatContext.Provider>
  );
};

export default function App({ children }: { children: React.ReactNode }) {
  const [render, setRender] = useState("home");
  const [gamemode, setGamemode] = useState<string>("Dark Valley");
  const [gametype, settype] = useState<string>("random");
  const [gamefriend, setgamefriend] = useState<number>(-1);
  const [Isrunning, setRunning] = useState<boolean>(false);
  const [playerposition, setplayerposition] = useState<string>("");
  const user = useContext(UserDataContext);

  const [lodingdata, setlodingdata] = useState<GameLodingProps>({
    users: [
      {
        clientid: user?.id || -1,
        image: user?.image || "no image",
        username: user?.userName || "no name",
        ingame: false,
        level: user?.level || 0,
      },
    ],
    gameloding: true,
  });

  return (
    <RenderContext.Provider value={{ render, setRender }}>
      <GameContext.Provider
        value={{
          lodingdata,
          gamemode,
          gametype,
          gamefriend,
          Isrunning,
          playerposition,
          setRunning,
          setGamemode,
          settype,
          setgamefriend,
          setlodingdata,
          setplayerposition,
        }}
      >
        <div>
          <Navbar />
          {render == "playGame" && <Gameplay />}
          {render != "playGame" && <Body>{children}</Body>}
        </div>
      </GameContext.Provider>
    </RenderContext.Provider>
  );
}
