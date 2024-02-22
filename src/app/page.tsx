import Image from "next/image";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";

export default function Home() {
  return (
    <div>
      <Sidebar/>
      <Navbar/>
      <Chat>
        
      </Chat>
    </div>
  );
}

