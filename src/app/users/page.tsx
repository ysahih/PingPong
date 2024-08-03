"use client";
import { useSearchParams, useRouter } from "next/navigation";
import ProfileOverlay from "../component/ProfileOverlay";
import { use, useContext, useEffect, useState } from "react";
import UserDataContext from "@/components/context/context";
import ProfileDataContext from "@/components/context/profilDataContext";
import axios from "axios";
import { Loding } from "../home/Loding";
import Image from "next/image";
import axiosApi from "@/components/signComonents/api";

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
      const data = await axiosApi.get(
        process.env.NEST_API + "/user/getSentInvits",
        { withCredentials: true }
      );
      const sentIvit: SENTINVIT[] = data.data;
      if (!searchRouter.get("userName")) {
        router1.replace("/404");
      } else if (
        sentIvit.find(
          (invit) => invit.receiver.userName === searchRouter.get("userName")
        )
      ) {
        setType("sentInvit");
      } else if (
        user?.FriendsData?.find(
          (friend) => friend.userName === searchRouter.get("userName")
        )
      ) {
        setType("friend");
      } else if (
        user?.InvitsData?.find(
          (friend) => friend.sender.userName === searchRouter.get("userName")
        )
      ) {
        setType("invit");
      } else setType("notFriend");
    };
    sentInvit();
  }, [searchRouter, user?.FriendsData, router1]);

  useEffect(() => {
    const getUser = async () => {
      const user = await axiosApi.get(
        process.env.NEST_API + "/user/users/" + searchRouter.get("userName"),
        { withCredentials: true }
      );
      setUserData(user.data);
      setLoading(true);
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
         <div className="userProfile">
         <div className="HeadProfile">
           <div className="ImgHeadProfileContainer">
             <div className="relative">
               <div
                 className="mt-[16px] inline-block rounded-full overflow-hidden border-2 border-transparent shadow-lg w-[75px] h-[75px]"
                 style={{ outline: ".2px solid #535C91" }}
               >
                 <Image
                   className="bg-cover bg-center w-full h-full cursor-pointer"
                   src="./defaultImg.svg"
                   width={75}
                   height={75}
                   alt="user"
                 />
               </div>
             </div>
             <div>
                <h3 className="text-[16px] text-center text-[#8A99E9]">User Not Found!</h3>
             </div>
           </div>
          </div>
          </div>
      )}
    </>
  );
};

export default ProfileOverlayPage;
