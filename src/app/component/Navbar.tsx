import Image from "next/image";
import Profile from "./Profile";
import { UserData } from "@/components/context/context";

import { GameContext } from "../Game/Gamecontext/gamecontext";

import RenderContext from "@/components/context/render";
import { useContext, useEffect, useState } from "react";
import UserDataContext from "@/components/context/context";
import { useClickAway } from "@uidotdev/usehooks";
import SocketContext from "@/components/context/socket";
import axios from "axios";
import TimeAgo from "javascript-time-ago";
import "@/styles/search.css";

import { getTimeAgo } from "./timeAgo";

const PhoneLogo = () => {};

const Logo = () => {
  return (
    <div className="logo">
      {/* <Image
        src="./homeImages/logo.svg"
        alt="logo"
        className="applogo"
        width={36}
        height={42}
      /> */}
      <div style={{ maxWidth: "36px", maxHeight: "42px" }}>
        <Image
          src="/homeImages/logo.svg"
          alt="logo"
          className="applogo"
          width={36}
          priority={true}
          height={42}
        />
      </div>
      <div style={{ maxWidth: "106px", maxHeight: "36px" }}>
        <Image
          src="/homeImages/PONGy.svg"
          className="Pongy"
          alt="logo"
          priority={true}
          width={106}
          height={36}
        />
      </div>
    </div>
  );
};

type NotificationType = {
  id: number;
  content: string;
  createdAt: Date;
  image: string;
  userName: string;
  seen: boolean;
};

const Notification = () => {
  const [notification, setNotification] = useState(false);
  const ref = useClickAway<HTMLDivElement>(() => {
    if (!notification) return;
    setNotification(false);
    setNumberNotf(0);
  });
  const [notificationList, setNotificationList] = useState<NotificationType[]>(
    []
  );
  const socket = useContext(SocketContext);
  const [timeAgo, setTimeAgo] = useState<TimeAgo | null>(null);
  const [numberNotf, setNumberNotf] = useState<number>(0);

  useEffect(() => {
    setTimeAgo(getTimeAgo());
    // No need for cleanup to set to null, but you can keep it if it suits your use case
    return () => {
      setTimeAgo(null);
    };
  }, []);

  const NotificationsSeen = async () => {
    const res = await axios.get(
      process.env.NEST_API + "/user/NotificationsSeen",
      {
        withCredentials: true,
      }
    );
    // setNotificationList(data);
  };

  useEffect(() => {
    async function fetchNotification() {
      const res = await axios.get(
        process.env.NEST_API + "/user/Notifications",
        {
          withCredentials: true,
        }
      );
      const data: NotificationType[] = res.data.notifications;
      setNotificationList(data);
      setNumberNotf(data.filter((data) => !data.seen).length);
    }
    fetchNotification();

    socket?.on("Notification", (data: NotificationType) => {
      setNotificationList((prev) => (prev.length ? [data, ...prev] : [data]));
      setNumberNotf((prev) => prev + 1);
    });
    return () => {
      socket?.off("Notification");
    };
  }, [socket, numberNotf]);

  return (
    <div ref={ref} className="z-100">
      <div
        className="notification cursor-pointer"
        onClick={() => {
          notification && setNumberNotf(0);
          setNotification(!notification);
          // setNumberNotf(0)

          NotificationsSeen();
        }}
      >
        <div className="absolute ml-[30px] rounded-full NumNotf">
          {numberNotf > 100 ? "99+" : `${ numberNotf|| "0"}`}
        </div>
        <div className="NtfIcon">
          <Image
            src="/homeImages/Ell2.svg"
            alt="logo"
            width={26}
            height={26}
            priority={true}
            className="h-[26px] w-[26px] object-cover"
          />
        </div>
      </div>
      {notification && (
        <div className="NtfContainer absolute">
          {notificationList?.length > 0 ? (
            notificationList.map((data) => (
              <div
                className={
                  data.seen
                    ? "bg-[#23233efc] notificationList"
                    : "notificationList bg-[#1B1A55]"
                }
                key={data.id}
              >
                <div className="w-[34px] h-[34px] min-w-[34px] min-h-[34px]">
                <Image
                  src={data?.image || "/defaultImg.svg"}
                  className="rounded-full w-[34px] h-[34px] min-w-[34px] min-h-[34px]"
                  alt="image"
                  width={34}
                  height={34}
                  priority={true}
                />
                </div>
                <p className="infoNtf">
                  {" "}
                  <span className="userNameSpan">{data.userName} </span>
                  {data.content}
                </p>
                <p className="text-[12px]  absolute mt-[40px] ml-[180px]">
                  {timeAgo?.format(new Date(data.createdAt))}
                </p>
              </div>
            ))
          ) : (
            <div className="notificationList">
              <p className="text-sm">No Notification</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Invite = () => {
  const socket = useContext(SocketContext);
  const [notification, setNotification] = useState({
    invitationSenderID: "",
    username: "",
    userimage: "",
    message: "",
    mode: "",
  });
  const [display, setDisplay] = useState(false);
  const [displayChoise, setDisplayChoise] = useState(false);
  const game = useContext(GameContext);
  const render = useContext(RenderContext);
  const user = useContext(UserDataContext);
  useEffect(() => {
    const resetgame = () => {
        game?.setRunning(false);
        game?.setlodingdata({
          users  : [{
            clientid : user?.id || -1 ,
               image : user?.image || "no image",
               username : user?.userName || "no name" ,
                ingame : false,
                level : user?.level || 0
      } ] ,
          gameloding: true });   
        game?.setplayerposition("");
        game?.setGamemode("");
        game?.settype("");
        game?.setgamefriend(-1);
    }

    const HandelNotification = () => {
      socket?.on("gameInvitation", (data) => {
        console.log("message", data);
        setNotification(data);
        setDisplayChoise(true);
        setDisplay(true);
        setTimeout(() => {
          setDisplay(false);
          setDisplayChoise(true);
        }, 5000);
      });

      socket?.on("gameresponse", (data) => {
        console.log("message1", data);
        setNotification(data);
        setDisplayChoise(false);
        setDisplay(true);

        if (data.response == false) {
          resetgame();
          render?.setRender("home");
        }
        setTimeout(() => {
          setDisplay(false);
          setDisplayChoise(true);
        }, 3000);
      });
    };
    HandelNotification();

    return () => {
      socket?.off("gameInvitation");
    };
  }, [socket]);

    return (
        <>
        {
                display &&
            <div className="Gameinvite drift-animation">
                <div className="userprofile">
                    <Image src={notification.userimage}  className="userpic" alt="image" width={34} height={34}/>
                </div>
                <div className="info">
                    <h2 className="username">{notification.username}</h2>
                    <p className="type">{notification.message}</p>
                </div>
                {
                        displayChoise &&  <div className="desicion ">
                        <Image src="/homeImages/Deny.svg" className="yes-no   " alt="image" width={24} height={24}  onClick={() =>
                        { 
                            socket?.emit("gameInvitation", { clientID : user?.id ,  invitationSenderID: notification.invitationSenderID , response: false});
                            setDisplay(false);
                        } 
                        } />
                        <Image src="/homeImages/Accept.svg" className="yes-no " alt="image" width={24} height={24} onClick={() =>
                            {
                                socket?.emit("gameInvitation", {  clientID : user?.id , invitationSenderID: notification.invitationSenderID , response: true});
                                game?.setGamemode(notification.mode);
                                game?.settype("friend");
                                render?.setRender("playGame");
                                setDisplay(false);
                            }
                        } />
                    </div>
                }
            </div>
        }
        </>
    );
}

const Header = () => {
  const data: UserData | null = useContext(UserDataContext);

  return (
    <div className="header">
      <div className="leftBar">
        <Invite />
      </div>

      <div className="rightBar ">
        <Notification />
        <Profile src={data?.image} />

        <h2 className="hidden md:block "> {data?.userName}</h2>
      </div>
    </div>
  );
};

const Navbar = () => {
  return (
    <div className="navbar">
      <Logo />
      <Header />
    </div>
  );
};

export default Navbar;
