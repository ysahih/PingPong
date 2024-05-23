"use client";
import { useSearchParams, useRouter } from "next/navigation";
import ProfileOverlay from "../component/ProfileOverlay";
import { use, useContext, useEffect, useState } from "react";
import UserDataContext from "@/components/context/context";
import ProfileDataContext from "@/components/context/profilDataContext";

const ProfileOverlayPage = () => {
  const searchRouter = useSearchParams();
  const user = useContext(ProfileDataContext);
  const [type, setType] = useState<null | string>(null);

  const router1 = useRouter();
  useEffect(() => {
    console.log("ProfileOverlayPage: ", searchRouter.get('userName'));
    if (!searchRouter.get('userName')){ 
      router1.replace('/404');
    }
    else if (user?.FriendsData?.find((friend) => friend.userName === searchRouter.get('userName'))){
      console.log("frsdgsdg================: ", searchRouter.get('userName'));
      setType('friend');
    }
    else if (!user?.InvitsData?.find((friend) => friend.sender.userName === searchRouter.get('userName'))){
      // router1.replace('/404');
      setType('invit');
    }
    else 
      setType('notFriend');

  }, [searchRouter, user?.FriendsData, router1]);

  useEffect(() => {
    console.log("ProfileOverlayPageType: ", type);
  }, [type]);

  return (
    <>
      <ProfileOverlay />
    </>
  );
};

export default ProfileOverlayPage;
