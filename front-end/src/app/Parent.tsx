"use client";
// "use strict";
import { use, useContext, useEffect, useState } from "react";
import "../styles/login/landingPage.css";
import axios from "axios";
import UserDataContext, { UserData } from "@/components/context/context";
import App from "./App";
import { Loding } from "./home/Loding";
import { useRouter } from "next/navigation";
import VerifyTwoFa from "@/components/Qrcode/QRcode";
import ProfileDataContext, {
  ProfileData,
} from "@/components/context/profilDataContext";
import UserStateContext, { UserState } from "@/components/context/userSate";
import { FriendsType, InvitsType } from "@/components/userProfile/Dto";
import io, { Socket } from "socket.io-client";
import SocketContext from "@/components/context/socket";
import Gameplay from "./Game/GamePages/Gameplay";
import BouncingBall from "./Game/GamePages/Gameplay";
import Gameresult from "./Game/GamePages/Gameresult";
import Friends from "@/components/userProfile/Friends";
import Navbar from "./component/Navbar";
import axiosApi from "@/components/signComonents/api";
import { ChatData } from "./component/Dto/Dto";
import { number } from "yup";
import { step } from "@material-tailwind/react";
import { boolean } from "yup";
import ScreenWidth from "@/components/context/screenWidth";
import RenderContext, { renderContext } from "@/components/context/render";

// import { useRouter } from 'next/router';
/*
 * if u need to use the socket in the app component, you can use the SocketContext to get
 * the socket instance like this:
 *
 * expemple:
 *
 * const socket = useContext(SocketContext);
 *
 * for accessing FriendsData, InvitsData, and BlockedFriend, you can use the ProfileDataContext
 *
 * example:
 * const { FriendsData, InvitsData, BlockedData } = useContext(ProfileDataContext);
 *
 * if you need to use the user public data, you can use the UserDataContext
 *
 * example:
 *
 * const data = useContext(UserDataContext);
 */

interface PropesBlockedData {
  setFriendsData: (FriendsData: FriendsType[]) => void;
}

const getFriends = async (proes: PropesBlockedData) => {
  try {
    const res = await axiosApi.get(process.env.NEST_API + "/user/friends", {
      withCredentials: true,
    });
    if (res) {
      proes.setFriendsData(res.data);
    }
  } catch (e) {
  }
};

interface PropesgetInvits {
  setInvitsData: (InvitsData: InvitsType[]) => void;
}

const getInvits = async (proes: PropesgetInvits) => {
  try {
    const res = await axiosApi.get(process.env.NEST_API + "/user/invits", {
      withCredentials: true,
    });
    if (res) {
      proes.setInvitsData(res.data);
    }
  } catch (e) {
  }
};

interface PropessetBlockedData {
  setBlockedData: (BlockedData: FriendsType[]) => void;
}

const getBlocked = async (proes: PropessetBlockedData) => {
  try {
    const dataBlocked = await axiosApi.get(
      process.env.NEST_API + "/user/blocked",
      {
        withCredentials: true,
      }
    );
    proes.setBlockedData(dataBlocked.data);
  } catch (error) {
  }
};

export default function Parent({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<UserData | null>(null);
  
  const [checkTwoFactor, setCheckTwoFactor] = useState(
    data?.twoFaCheck || false
  );
  const [FriendsData, setFriendsData] = useState<FriendsType[] | null>(null);
  const [InvitsData, setInvitsData] = useState<InvitsType[] | null>(null);
  const [BlockedData, setBlockedData] = useState<FriendsType[] | null>(null);
  const [Socket, setSocket] = useState<Socket | null>(null);
  const [redirect, setRedirect] = useState<boolean>(false);
  const [userState, setUserState] = useState<UserState>({
    id: 0,
    state: '',
  });
  const [large, setLarge] = useState<boolean>(true);
  const screenWidth = useContext(ScreenWidth);
  const context = useContext(RenderContext);
  const router = useRouter();

  const setImage = (image: string) => {
    setData((currentData) => (currentData ? { ...currentData, image } : null));
  };
  const setUserName = (userName: string) => {
    setData((currentData) =>
      currentData ? { ...currentData, userName } : null
    );
  };
  const setFirstName = (firstName: string) => {
    setData((currentData) =>
      currentData ? { ...currentData, firstName } : null
    );
  };
  const setLastName = (lastName: string) => {
    setData((currentData) =>
      currentData ? { ...currentData, lastName } : null
    );
  };
  const setEmail = (email: string) => {
    setData((currentData) => (currentData ? { ...currentData, email } : null));
  };

  useEffect(() => {
    // Check if the socket has already been initialized
    if (Socket) return;

    const socket = io(process.env.NEST_API ?? "", {
      withCredentials: true,
      // transports: ['websocket', 'polling'],
      // timestampParam: ,
      // timestampRequests: ,
      // autoConnect: true by default, so no need to explicitly call connect()
    });

    socket.on("online", (data: { id: number }) => {
      if (data){
        
        setFriendsData((currentFriends) =>
            currentFriends
          ? currentFriends.map((friend: FriendsType) =>
            friend.id === data.id ? { ...friend, online: true } : friend
        )
        : null
      );
      setUserState({id: data.id, state: "online"});
      }
    });

    socket.on("offline", (data: { id: number }) => {
      if (data){
        setFriendsData((currentFriends) =>
          currentFriends
            ? currentFriends.map((friend: FriendsType) =>
                friend.id === data.id ? { ...friend, online: false } : friend
              )
            : null
        );
        setUserState({id: data.id, state: "offline"});
      }
    });
    // Setup event listeners only once
    socket.on("connect", () => {
    });

    socket.on("disconnect", () => {
    });

    // socket?.on("newConvo", (newChatData: ChatData) => {
    // })

    socket.on("DeleteFriend", (id: number) => {
      setFriendsData((currentInvits) =>
        currentInvits
          ? currentInvits.filter((invit: FriendsType) => invit.id !== id)
          : null
      );
    });

    socket.on("UnBlocked", (id: number) => {
      setBlockedData((currentBlocked) =>
        currentBlocked
          ? currentBlocked.filter((blocked: FriendsType) => blocked.id !== id)
          : null
      );
    });

    socket.on("newConvo", (pylod: any) => {
    });

    socket.on("NewFriend", (data: FriendsType) => {
      if (data === undefined || !data) return;
      // if(FriendsData?.some((friend) => friend.id === data.id)) return;
      setFriendsData((currentFriends) =>
        currentFriends ? [...currentFriends, data] : [data]
      );
      setInvitsData((currentInvits) =>
        currentInvits
          ? currentInvits.filter(
              (invit: InvitsType) => invit.sender.id !== data.id
            )
          : null
      );
    });

    socket.on("gameStatus", (gameStatus: {id: number, status: boolean}) => {
        if (gameStatus) {
          setFriendsData((currentFriends) =>
            currentFriends
              ? currentFriends.map((friend: FriendsType) =>
                  friend.id === gameStatus.id ? { ...friend, inGame: gameStatus.status } : friend
                )
              : null
          );
          setUserState({id: gameStatus.id, state: gameStatus.status ? "inGame" : "online"});
          if(data?.id === gameStatus.id){
            setData((currentData) => currentData ? {...currentData, inGame: gameStatus.status} : null);
          }
      }
    })

    socket.on("NewInvit", (data: InvitsType) => {
      if (
        InvitsData?.find(
          (invit: InvitsType) => invit.sender.id === data.sender.id
        )
      )
        return;
      setInvitsData((currentInvits) =>
        currentInvits ? [...currentInvits, data] : [data]
      );
    });

    socket.on("DeleteInvit", (id: number) => {
      setInvitsData((currentInvits) =>
        currentInvits
          ? currentInvits.filter((invit: InvitsType) => invit.sender.id !== id)
          : null
      );
    });

    socket.on("NewBlocked", (data: FriendsType) => {
      // const isUserBlocked = BlockedData?.some((blocked: FriendsType) => blocked.id === data.id);
      // if (isUserBlocked) return;
      setBlockedData((currentBlocked) =>
        currentBlocked ? [...currentBlocked, data] : [data]
      );
      setFriendsData((currentFriends) =>
        currentFriends
          ? currentFriends.filter(
              (friend: FriendsType) => friend.id !== data.id
            )
          : null
      );
    });

    // Update the Socket state to ensure this effect runs only once
    setSocket(socket);

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // Removed Socket from dependency array

  useEffect(() => {
    if (!data) {
      const getdata = async () => {
        try {
          const ApiUrl = process.env.NEST_API;
          const res = await axiosApi.get(ApiUrl + "/profile", {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
          if (
            res.data === undefined ||
            res.data === false ||
            res.data === null ||
            res.data.update === undefined ||
            res.data.update === false
          ) {
            setRedirect(true);
            router.push("/login");
          } else if (res.data.twoFa === true) {
            setCheckTwoFactor(res.data.twofaCheck);
          } else if (res.data.twoFa === false) {
            setCheckTwoFactor(true);
          }
          const data: UserData = res.data;
          data.setEmail = setEmail;
          data.setImage = setImage;
          data.setUserName = setUserName;
          data.setFirstName = setFirstName;
          data.setLastName = setLastName;
          setData(data);
          if(data.inGame)
            router.push("/Game");
        } catch (error) {
          setRedirect(true);
          router.push("/login");
        }
      };
      getdata();
    }
    if (!FriendsData) {
      getFriends({ setFriendsData });
    }
    if (!InvitsData) {
      getInvits({ setInvitsData });
    }
    if (!BlockedData) {
      getBlocked({ setBlockedData });
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1040) {
      setLarge(false);
    }
    else {
      setLarge(true);
    }
    
  },[]);

  return (
    <>
      <UserDataContext.Provider value={data}>
        <ProfileDataContext.Provider
          value={{ FriendsData, InvitsData, BlockedData }}
          >
          <UserStateContext.Provider value={{userState , setUserState}}>
          <SocketContext.Provider value={Socket}>
     
          <ScreenWidth.Provider value={{ large, setLarge }}>
            {data ? (
              checkTwoFactor ? (
                <App>{children}</App>
              ) : (
                !redirect && <VerifyTwoFa close={setCheckTwoFactor} />
              )
            ) : (
              <Loding />
            )}
            </ScreenWidth.Provider>

          </SocketContext.Provider>
            </UserStateContext.Provider>
        </ProfileDataContext.Provider>
      </UserDataContext.Provider>
    </>
  );
}
