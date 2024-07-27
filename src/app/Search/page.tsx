"use client";
import { useState } from "react";
import Search from "../component/Search";
import { CiSearch } from "react-icons/ci";
import JoinRoom from "../joinRoom/joinRoom";
import './search.css';

const SearchPage = () => {
  const [userName, setUserName] = useState<string>("");
  const [state, setsate] = useState<boolean>(false);

  return (
    <div>
      <div className="search flex flex-col items-center w-full p-2 pt-8">
        <div className="bg-[#030824] InputSearch w-[300px] flex pl-[10px] items-center gap-2 mb-[20px]">
          <CiSearch className="w-[30px] h-[30px] text-white" />
          <input
            type="search"
            autoComplete="off"
            name="search"
            placeholder="Search"
            className=" bg-transparent border-none focus:border-none focus:outline-none w-[240px] h-[40px] text-white text-[16px]"
            onChange={(e) =>
              setTimeout(() => setUserName(e.target.value.trim()), 800)
            }
          />
        </div>
        <div className="text-white flex gap-5">
            <button onClick={()=> setsate(false)} className={!state ? "clicked" : ""} >User</button>
            <button onClick={()=> setsate(true)} className={state ? "clicked" : ""} >Room</button>
        </div>
        {!state ?  <Search searchData={userName}/> : <JoinRoom searchDat={userName} />}

      </div>
    </div>
  );
};

export default SearchPage;
