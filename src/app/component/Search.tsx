import { CiSearch } from "react-icons/ci";
import { IoMdPersonAdd } from "react-icons/io";
import Image from "next/image";
import { use, useContext, useEffect, useState } from "react";
import axios from "axios";
import SocketContext from "@/components/context/socket";
import { Socket } from "socket.io-client";

type UserProps = {
  id: number;
  image: string;
  userName: string;
};

// const sendUInvitation = async (id: number) => {
//   try {
//     // socket?.emit("NewInvit", "sdgjshhdjlgsdkdlgls");
//     const dataInvitation = await axios.post(
//       "http://localhost:3000/user/sendinvit?id=" + id,
//       {},
//       {
//         withCredentials: true,
//       }
//     );
//     console.log(dataInvitation);
//   } catch (error) {
//     console.log(error);
//   }
// };

const User = (props: UserProps) => {
  const socket = useContext(SocketContext);
  return (
    <div className="m-4 bg-[#8A99E9] text-white gap-4  min-w-[200px] bg-[#00000] min-h-[200px] m-[20px] flex flex-col items-center p-[10px]">
      <Image src={props.image || "./re"} alt="profile" width={46} height={46} />
      <h3>{props.userName}</h3>
      <IoMdPersonAdd
        className="w-[30px] h-[30px]"
        onClick={() => socket?.emit("NewInvit", { id: props.id })}
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
          "http://localhost:3000/user/search?userName=" + userName,
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
    <div className="search">
      <div className="input flex items-center gap-1">
        <CiSearch className="w-[30px] h-[30px]" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent border-none"
        />
      </div>
      <div className=" w-[100%] h-[240px] justify-evenly grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 2xl:grid-cols-3 gap-8 overflow-y-scroll overflow-x-hidden">
        {users.map((user) => (
          <User
            key={user.id}
            id={user.id}
            image={user.image}
            userName={user.userName}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
