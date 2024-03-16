import { CiSearch } from "react-icons/ci";
import { IoMdPersonAdd } from "react-icons/io";
import Image from "next/image";
import { use, useContext, useEffect, useState } from "react";
import axios from "axios";
import SocketContext from "@/components/context/socket";
import { Socket } from "socket.io-client";
import UserDataContext from "@/components/context/context";

type UserProps = {
  id: number;
  image: string;
  userName: string;
};

const User = (props: UserProps) => {
  const socket = useContext(SocketContext);
  const user = useContext(UserDataContext);
  
  return (
    <div className="m-4 bg-[#8A99E9] text-white gap-4  min-w-[200px] bg-[#00000] h-[200px] m-[20px] flex flex-col items-center p-[10px]">
      <Image src={props.image || "./re"} alt="profile" width={46} height={46} />
      <h3>{props.userName}</h3>
      <IoMdPersonAdd
        className="w-[30px] h-[30px]"
        onClick={() => socket?.emit("NewInvit", { id: props.id, userId: user?.id })}
      />
    </div>
  );
};

const Search = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const search = async () => {
      try {
        const dataSearch = await axios.get(
          process.env.NEST_API + "/user/search?userName=" + userName,
          {
            withCredentials: true,
          }
        );
        console.log("Search ::", dataSearch);
        if (dataSearch.data) setUsers(dataSearch.data);
      } catch (error) {
        console.log(error);
      }
    };
    search();
  }, []);

  return (
    <div className="search flex flex-col items-center w-full p-8">
      <div className="input flex  items-center gap-2">
        <CiSearch className="w-[30px] h-[30px]" />
        <input
          type="search"
          placeholder="Search"
          className="bg-transparent border-none focus:border-none focus:outline-none w-[224px] h-[40px] text-white text-[16px]"
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 overflow-scroll">
        {users.map((user) => (
          user.userName.startsWith(userName) && (
          <User
            key={user.id}
            id={user.id}
            image={user.image}
            userName={user.userName}
          />)
        ))}
      </div>
    </div>
  );
};

export default Search;
