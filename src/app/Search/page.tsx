"use client";
import { useState } from "react";
import Search from "../component/Search";
import { CiSearch } from "react-icons/ci";
import JoinRoom from "../joinRoom/joinRoom";

const SearchPage = () => {
  const [userName, setUserName] = useState<string>("");
  const [state, setsate] = useState<string>("search")

  return (
    <div>
      <div className="search flex flex-col items-center w-full p-2 pt-8">
        <div className="bg-[#030824] InputSearch w-[300px] flex pl-[10px] items-center gap-2 mb-[20px] max-w-full">
          <CiSearch className="w-[30px] h-[30px] text-white" />
          <input
            type="search"
            autoComplete="off"
            name="search"
            placeholder="Search"
            className=" bg-transparent  border-none focus:border-none focus:outline-none w-[240px] max-w-full h-[40px] text-white text-[16px]"
            onChange={(e) =>
              setTimeout(() => setUserName(e.target.value.trim()), 800)
            }
          />
        </div>
        <div className="text-white flex gap-10">
            <button onClick={()=> setsate("search")}>search</button>
            <button onClick={()=> setsate("rooms")}>rooms</button>
        </div>
        {state == "search"?  <Search searchData={userName}/> : <JoinRoom/>}

      </div>
    </div>
  );
};

export default SearchPage;
