"use client";
"use strict";
import { useEffect, useState } from "react";
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
import { FriendsType, InvitsType } from "@/components/userProfile/Dto";
import io, { Socket } from "socket.io-client";
import SocketContext from "@/components/context/socket";

interface PropesBlockedData {
  setFriendsData: (FriendsData: FriendsType[]) => void;
}

const getFriends = async (proes: PropesBlockedData) => {
  try {
    const res = await axios.get(process.env.NEST_API + "/user/friends", {
      withCredentials: true,
    });
    //   console.log(res);
    if (res) {
      proes.setFriendsData(res.data);
    }
  } catch (e) {
    console.log(e);
  }
};

interface PropesgetInvits {
  setInvitsData: (InvitsData: InvitsType[]) => void;
}

const getInvits = async (proes: PropesgetInvits) => {
  try {
    const res = await axios.get(process.env.NEST_API + "/user/invits", {
      withCredentials: true,
    });
    //   console.log(res);
    if (res) {
      proes.setInvitsData(res.data);
    }
  } catch (e) {
    console.log(e);
  }
};

interface PropessetBlockedData {
  setBlockedData: (BlockedData: FriendsType[]) => void;
}

const getBlocked = async (proes: PropessetBlockedData) => {
  try {
    const dataBlocked = await axios.get(
      process.env.NEST_API + "/user/blocked",
      {
        withCredentials: true,
      }
    );
    proes.setBlockedData(dataBlocked.data);
    // console.log('Blocked ::', dataBlocked);
  } catch (error) {
    console.log(error);
  }
};

export default function landingPage() {
  const [data, setData] = useState<UserData | null>(null);
  const [checkTwoFactor, setCheckTwoFactor] = useState(
    data?.twoFaCheck || false
  );
  const [FriendsData, setFriendsData] = useState<FriendsType[] | null>(null);
  const [InvitsData, setInvitsData] = useState<InvitsType[] | null>(null);
  const [BlockedData, setBlockedData] = useState<FriendsType[] | null>(null);
  const [Socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();

  const socket = io(process.env.NEST_API ?? "", {
    withCredentials: true,
    autoConnect: false,
  });

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("socket connected");
      setSocket(socket);
    });

    socket.on("NewFriend", (data: FriendsType) => {
      console.log("NewFriend", data);
      setFriendsData((currentFriends) => {
        if (currentFriends) {
          return [...currentFriends, data];
        } else {
          return [data];
        }
      });
    });

    socket.on("NewInvit", (data: InvitsType) => {
      console.log("NewInvit", data);
      setInvitsData((currentInvits) => {
        if (currentInvits) {
          return [...currentInvits, data];
        } else {
          return [data];
        }
      });
    });

    
    socket.on("NewBlocked", (data: FriendsType) => {
      console.log("NewBlocked", data);
      setBlockedData((currentBlocked) => {
        if (currentBlocked) {
          return [...currentBlocked, data];
        } else {
          return [data];
        }
      });
    });

    if (!data) {
      const getdata = async () => {
        try {
          const ApiUrl = process.env.NEST_API;
          const res = await axios.get(ApiUrl + "/profile", {
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
            router.push("/login");
          } else if (res.data.twoFa === true) {
            setData(res.data);
            setCheckTwoFactor(res.data.twofaCheck);
          } else if (res.data.twoFa === false) {
            setData(res.data);
            setCheckTwoFactor(true);
          } else setData(res.data);
          console.log("Data:", res.data, data);
        } catch (error) {
          // console.log('Error:', error);
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

  console.log("FriendsData:", FriendsData);
  console.log("InvitsData:", InvitsData);
  console.log("BlockedData:", BlockedData);

  return (
    <>
      <UserDataContext.Provider value={data}>
        <ProfileDataContext.Provider
          value={{ FriendsData, InvitsData, BlockedData }}
        >
        <SocketContext.Provider value={Socket}>
          {data ? (
            checkTwoFactor ? (
              <App />
            ) : (
              <VerifyTwoFa close={setCheckTwoFactor} />
            )
          ) : (
            <Loding />
          )}
        </SocketContext.Provider>
        </ProfileDataContext.Provider>
      </UserDataContext.Provider>
    </>
  );
}
