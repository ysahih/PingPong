"use client";
import { CiSearch } from "react-icons/ci";
import { IoMdPersonAdd } from "react-icons/io";
import Image from "next/image";
import React, {
  ReactElement,
  use,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import SocketContext from "@/components/context/socket";
import UserDataContext from "@/components/context/context";
import "@/styles/search.css";
import ProfileDataContext from "@/components/context/profilDataContext";

import {
  FriendsType,
  InvitsType,
  SentInvitsType,
} from "@/components/userProfile/Dto";
import Friends from "@/components/userProfile/Friends";
import ChatContext from "@/components/context/chatContext";
import axiosApi from "@/components/signComonents/api";

type UserProps = {
  id: number;
  image: string;
  userName: string;
};

interface friendsType {
  value: FriendsType;
}

const Friend = (props: friendsType) => {
  const socket = useContext(SocketContext);
  const user = useContext(UserDataContext);
  const context = useContext(ChatContext);
  const [blocking, setBlocking] = useState<boolean>(false);

  const block = (id: number) => {
    socket?.emit("NewBlocked", { id: id, userId: user?.id });
  };

  return (
    <div className="search-card SearchCard  text-white mb-2">
      <div className="relative">
        {props.value.online && (
          <>
            <p
              className="absolute w-2.5 h-2.5 bg-green-500 rounded-full  -top-[-12px] -right-[-8px] transform translate-x-1/2 translate-y-1/2 border-[4px] border-transparent "
              style={{ outline: "4px solid #1B1A55" }}
            ></p>
          </>
        )}
        <div
          className="mt-2 inline-block rounded-full overflow-hidden border-2 border-transparent shadow-lg w-[80px] h-[80px]"
          style={{ outline: ".2px solid #535C91" }}
        >
          <Image
            className="bg-cover bg-center w-[80px] h-[80px]"
            src={props?.value?.image || "./defaultImg.svg"}
            width={60}
            height={60}
            alt="user"
          />
        </div>
      </div>
      <div className="mt-[-10px]">
        <h3 className="text-[16px]">{props.value.userName}</h3>
        <p className="text-center text-[#8A99E9] text-[12px]">#12</p>
      </div>
      <div
        className={`${
          blocking ? "hidden" : "flex"
        } flex items-center justify-center  w-[100%]  gap-4`}
      >
        <Image
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
          src="./iconsProfile/Gamepad_solid.svg "
          width={28}
          height={28}
          property="true"
          alt="online"
        />
        <Image
          src="./iconsProfile/Chat_solid.svg"
          width={24}
          height={24}
          property="true"
          onClick={() => {
            context?.setChat(props.value.id);
          }}
          alt="online"
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out w-[24px] min-h-[24px]"
          style={{
            width: 'auto',
            height: 'auto',
            maxWidth: '24px',
            maxHeight: '24px',
          }}
        />
        <Image
          onClick={() => {
            setBlocking(true);
            block(props.value.id);
          }}
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
          src="./iconsProfile/User-block.svg"
          width={28}
          height={28}
          property="true"
          alt="online"
        />
      </div>
      <div className="flex items-center justify-center  w-[100%]  gap-4">
        {blocking && <p>Blocking...</p>}
      </div>
    </div>
  );
};

interface InvitProps {
  value: InvitsType;
}

const Invit = (props: InvitProps) => {
  const values = props.value;
  const socket = useContext(SocketContext);
  const user = useContext(UserDataContext);
  const [Accepting, setAccepting] = useState<boolean>(false);
  const [deny, setDeny] = useState<boolean>(false);

  return (
    <div key={values.id} className="search-card SearchCard  text-white mb-2">
      <div className="relative">
        <div
          className="mt-2 inline-block rounded-full overflow-hidden border-2 border-transparent shadow-lg w-[80px] h-[80px]"
          style={{ outline: ".2px solid #535C91" }}
        >
          <Image
            className="bg-cover bg-center w-[80px] h-[80px]"
            src={values?.sender?.image || "./defaultImg.svg"}
            width={60}
            height={60}
            alt="user"
          />
        </div>
      </div>
      <div className="mt-[-10px]">
        <h3 className="text-[16px]">{values.sender.userName}</h3>
        <p className="text-center text-[#8A99E9] text-[12px]">#12</p>
      </div>
      <div
        className={`${
          Accepting || deny ? "hidden" : "flex"
        } flex items-center justify-center  w-[100%]  gap-8`}
      >
        <Image
          onClick={() => {
            setDeny(true);
            socket?.emit(
              "DenyFriend",
              { id: values.sender.id, userId: user?.id },
              (error: Error | string) => {
                error ? setDeny(false) : setDeny(true);
              }
            );
          }}
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
          src="./iconsProfile/Deny.svg"
          width={32}
          height={32}
          property="true"
          alt="online"
        />
        <Image
          onClick={() => {
            setAccepting(true);
            socket?.emit(
              "NewFriend",
              { id: values.sender.id, userId: user?.id },
              (error: Error | string) => {
                error ? setAccepting(false) : setAccepting(true);
              }
            );
          }}
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
          src="./iconsProfile/Accept.svg"
          width={32}
          height={32}
          property="true"
          alt="online"
        />
      </div>

      <div className="flex items-center justify-center  w-[100%]  gap-8">
        {Accepting && (
          <p className="text-[#8A99E9] text-[14px]">Accepting...</p>
        )}
        {deny && <p className="text-[#8A99E9] text-[14px]">Denied</p>}
      </div>
    </div>
  );
};

const LoadingIndicator = () => {
  return Array.from({ length: 20 }, (_, i) => (
    <div
      className="search-card SearchCard  text-white mb-2 justify-center"
      key={i}
    >
      <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-900"></div>
    </div>
  ));
};

const User = (props: UserProps) => {
  const socket = useContext(SocketContext);
  const user = useContext(UserDataContext);
  const [sent, setSent] = useState<boolean>(false);
  // need to change ./re
  return (
    <div className="search-card SearchCard  text-white mb-2">
      <Image
        src={props?.image || "./defaultImg.svg"}
        alt="profile"
        width={80}
        height={80}
        className="w-[80px] h-[80px] rounded-[50%] mt-2 ounded-full overflow-hidden border-2 border-transparent shadow-lg"
        style={{ outline: "1px solid #535C91" }}
      />
      <div className="mt-[-10px]">
        <h3 className="text-[16px]">{props.userName}</h3>
        <p className="text-center text-[#8A99E9] text-[12px]">#12</p>
      </div>
      {sent ? (
        <div className="mt-[10px] rounded-2 ">
          <p className="text-[#8A99E9] text-[14px]">Invitation Sent</p>
        </div>
      ) : (
        <IoMdPersonAdd
          className="w-[30px] h-[30px] mt-[10px] cursor-pointer  hover:scale-[120%] transition-all duration-300 ease-in-out"
          onClick={() => {
            socket?.emit("NewInvit", { id: props.id, userId: user?.id });
            setSent(true);
          }}
        />
      )}
    </div>
  );
};

const SentInvits = (props: { invit: SentInvitsType }) => {
  const invit: SentInvitsType = props.invit;
  const user = useContext(UserDataContext);
  const [cenceled, setCenceled] = useState<boolean>(false);

  const socket = useContext(SocketContext);
  return (
    <div className="search-card SearchCard  text-white mb-2">
      <div className="relative">
        <div
          className="mt-2 inline-block rounded-full overflow-hidden border-2 border-transparent shadow-lg w-[80px] h-[80px]"
          style={{ outline: ".2px solid #535C91" }}
        >
          <Image
            className="bg-cover bg-center w-[80px] h-[80px]"
            src={invit?.receiver?.image || "./defaultImg.svg"}
            width={60}
            height={60}
            alt="user"
          />
        </div>
      </div>
      <div className="mt-[-10px]">
        <h3 className="text-[16px]">{invit.receiver.userName}</h3>
        <p className="text-center text-[#8A99E9] text-[12px]">#12</p>
      </div>
      <div
        className="mt-[6px] cursor-pointer CancelBtn"
        onClick={() => {
          socket?.emit("DeleteFriend", {
            id: invit.receiver.id,
            userId: user?.id,
          });
          setCenceled(true);
        }}
      >
        <p className=" text-[#8A99E9] text-[14px] "> {cenceled? 'canceled' : 'cancel Invitation'}</p>
      </div>
    </div>
  );
};

const Search = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const friends = useContext(ProfileDataContext);
  const [userNotFound, setUserNotFound] = useState<boolean>(false);
  const [sentInvits, setSentInvits] = useState<SentInvitsType[]>([]);

  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
      setUserNotFound(false);
    }
    if (userName.length > 0) {
      setIsLoading(false);
    }
    if (!isLoading) {
      let inUsers = users.find((user) =>
        user.userName.toLowerCase().startsWith(userName.toLowerCase())
      );
      if (inUsers) {
        setUserNotFound(false);
        return;
      }

      let inSentInvit = sentInvits?.some((invit) =>
        invit.receiver.userName.toLowerCase().startsWith(userName.toLowerCase())
      );

      if (inSentInvit) {
        setUserNotFound(false);
        return;
      }

      let inFriends = friends?.FriendsData?.find((friend) =>
        friend.userName.toLowerCase().startsWith(userName.toLowerCase())
      );
      let inInvits = friends?.InvitsData?.find((invit) =>
        invit.sender.userName.toLowerCase().startsWith(userName.toLowerCase())
      );
      if (inFriends || inInvits || inUsers || inSentInvit) {
        setUserNotFound(false);
      }
      if (
        !inFriends &&
        !inInvits &&
        !inUsers &&
        !inSentInvit &&
        userName.length > 0
      ) {
        setUserNotFound(true);
      }
    }
  }, [friends, userNotFound, users, userName, isLoading]);

  useEffect(() => {
    setIsLoading(true);
    const search = async () => {
      try {
        const dataSearch = await axiosApi.get(
          process.env.NEST_API + "/user/search?userName=" + userName,
          {
            withCredentials: true,
          }
        );
        if (dataSearch.data) {
          setSentInvits(dataSearch.data.sentInvits);
          const data: UserProps[] = dataSearch.data.users;
          console.log("data: ", data);
          const filter: UserProps[] = data.filter((u) => {
            return !friends?.InvitsData?.some((s) => s.sender.id === u.id);
          });
          console.log("filter: ", filter);
          setUsers(filter);
          console.log("users: ", users);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    search();
  }, [userName, friends]);

  return (
    <div className="search flex flex-col items-center w-full p-2 pt-8">
      <div className="bg-[#030824] InputSearch w-[300px] flex pl-[10px] items-center gap-2 mb-[20px]">
        <CiSearch className="w-[30px] h-[30px] text-white" />
        <input
          type="search"
          name="search"
          placeholder="Search"
          className=" bg-transparent border-none focus:border-none focus:outline-none w-[240px] h-[40px] text-white text-[16px]"
          onChange={(e) => setTimeout(() => setUserName(e.target.value.trim()), 800)}
        />
      </div>
      <div className="SearchContainer">
        <>
          {friends && friends?.FriendsData?.map((friend) => {
            // console.log("friend ----", friend);
            return (
              friend.userName
                .toLowerCase()
                .startsWith(userName.toLowerCase()) && <Friend key={friend.id} value={friend} />
            );
          })}
        </>

        <>
          {friends?.InvitsData?.map((invit) => {
            return (
              invit.sender.userName
                .toLowerCase()
                .startsWith(userName.toLowerCase()) && <Invit key={invit.id} value={invit} />
            );
          })}
        </>

        <>
          {!isLoading && sentInvits && sentInvits.length ? (
            sentInvits?.map((invit: SentInvitsType) => {
              return (
                invit.receiver.userName
                  .toLowerCase()
                  .startsWith(userName.toLowerCase()) && (
                  <SentInvits key={invit.id} invit={invit} />
                )
              );
            })
          ) : (
            <></>
          )}
        </>

        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            {users.map(
              (user, index) =>
                user.userName
                  .toLowerCase()
                  .startsWith(userName.toLowerCase()) && (
                  <User
                    key={index}
                    id={user.id}
                    image={user.image}
                    userName={user.userName}
                  />
                )
            )}
          </>
        )}

        {userNotFound && (
          <div className="min-w-[600px] h-[600px] text-white2 flex flex-col justify-center items-center bg-[#030824]">
            <Image
              src={"./iconsProfile/not-found.png"}
              width={200}
              height={100}
              alt="img"
              className="mb-14"
            />
            <h1 className="text-white">No Result Found</h1>
            <p className="text-[#8A99E9] text-[14px]">
              We can't find any item matching your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
