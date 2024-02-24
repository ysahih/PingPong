import Image from "next/image";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import Chat from "./component/Chat";
import Games from "./component/Games";


const Home = () => {
	return (
		<div className="home">
			{/* <Games/> */}
			<div className="chatholder visible xl:invisible">
				<Chat/>
			</div>
		</div>

	);
}

export default function App() {
	return (
		<div>
			<Navbar/>
			<div className="body">
				<Sidebar/>
				<Home/>
				<div className="chatdiv hidden xl:block">
					<Chat/>
				</div>
			</div>
		</div>
	);
}

