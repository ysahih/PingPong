import Image from "next/image";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import Chat from "./component/Chat";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <div className="body">
        <Sidebar/>
        <div className="home"></div>
        <Chat/>
      </div>
    </div>
  );
}

