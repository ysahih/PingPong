"use client";
import { useSearchParams, useRouter } from "next/navigation";
import ProfileOverlay from "../component/ProfileOverlay";
import { use, useContext, useEffect, useState } from "react";
import UserDataContext from "@/components/context/context";
import ProfileDataContext from "@/components/context/profilDataContext";
import axios from "axios";
import { Loding } from "../home/Loding";

export interface USER {
  id: number;
  image: string;
  inGame: boolean;
  online: boolean;
  userName: string;
  lastName: string;
  firstName: string;
  level: number;
  winCounter: number;
  lossCounter: number;
}

export interface SENTINVIT {
  id: number;
  receiver: {
    id: number;
    image: string;
    level: number;
    userName: string;
  };
}

const ProfileOverlayPage = () => {
  const searchRouter = useSearchParams();
  const user = useContext(ProfileDataContext);
  const [userData, setUserData] = useState<USER | null>(null);
  const [Loading, setLoading] = useState<boolean>(false);

  const [type, setType] = useState<null | string>(null);

  const router1 = useRouter();

  useEffect(() => {
    // console.log("ProfileOverlayPage: ", searchRouter.get("userName"));
    const sentInvit = async () => {
      const data = await axios.get(
        process.env.NEST_API + "/user/getSentInvits",
        { withCredentials: true }
      );
      const sentIvit : SENTINVIT[] = data.data;
      if (!searchRouter.get("userName")) {
        router1.replace("/404");
      } 
      else if (sentIvit.find((invit) => invit.receiver.userName === searchRouter.get("userName"))) {
        setType("sentInvit");
      }
      else if (
        user?.FriendsData?.find(
          (friend) => friend.userName === searchRouter.get("userName")
        )
      ) {
        console.log("frsdgsdg================: ", searchRouter.get("userName"));
        setType("friend");
      } else if (
        user?.InvitsData?.find(
          (friend) => friend.sender.userName === searchRouter.get("userName")
        )
      ) {
        setType("invit");
      } else setType("notFriend");
      console.log("sentInvit: ", data.data);
    };
    sentInvit();
    
  }, [searchRouter, user?.FriendsData, router1]);

  useEffect(() => {
    const getUser = async () => {
      const user = await axios.get(
        process.env.NEST_API + "/user/users/" + searchRouter.get("userName"),

        { withCredentials: true }
      );
      setUserData(user.data);
      setLoading(true);
      console.log("user+++++++++: ", user.data);
    };
    getUser();
  }, [type]);

  return (
    <>
      {userData && <ProfileOverlay userData={userData} Type={type} />}
      {!userData && !Loading && (
        <div className=" userProfile flex justify-center items-center text-white text-sm">
          <Loding />
        </div>
      )}
      {!userData && Loading && (
        <div className=" userProfile bg-[var(bg-color)] flex justify-center items-center text-white text-sm">
          User Not Found..!
        </div>
      )}
    </>
  );
};

export default ProfileOverlayPage;
