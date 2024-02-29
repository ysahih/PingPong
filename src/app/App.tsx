// import UserDataContext, { UserData } from "@/components/context/context";
// import {useContext } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import axios from "axios";


// export default function Home() {
//     const data: UserData | null = useContext(UserDataContext);
//     const router = useRouter();

//     async function Logout()
//     {
//         try{
//             const res = await axios.get(process.env.NEST_API + '/logout', {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 withCredentials: true,
//             })
//             if(res.data){
//                 // //console.log('Success:', data);
               
//                     router.push('/login');
//             }
//         }
//         catch (error) {
//             //console.error('Error:', error);
//         };
//     }
    
//     return <>
        
//         <div>

//             <h1>Home</h1>
//             <div>
//                 <h1>{data?.userName}</h1>
//                 <h1>{data?.email}</h1>
//                 <h1>{data?.online.toString()}</h1>
//                 <Image
//                     src={data?.image?.toString() ?? './defaultImg.svg'}
//                     alt="profile"
//                     priority={true}
//                     width={100}
//                     height={100}
//                     style={{
//                         maxWidth: "100%",
//                         height: "auto"
//                     }} />
//             </div>
//             <button onClick={() => {Logout()}}>Logout</button>
//         </div>
//     </>;
// }


import { useState } from "react";
import Image from "next/image";
import Navbar from "./component/Navbar";
import Ranking from "./component/Ranking";
import Sidebar from "./component/Sidebar";
import Chat from "./component/Chat";
import Search from "./component/Search"
import Games from "./component/Games";
import "./globals.css";
import { Carousel, Typography, Button } from "@material-tailwind/react";

const Tables = ()=>{
	return (
		<Carousel 
			className="tables rounded-lg"
		>
    		<div className=" darktable relative h-1/2 w-full">
    	  		<Image
    	    		src="/homeImages/darkvalley.svg"
    	    		alt="image 1"
					width={200} height={100}
    	    		className="h-full w-full object-cover"
    	  		/>
    	  		<div className="playdarknow absolute inset-0 grid h-full w-full place-items-center ">
    	    		<div className="w-3/4 text-center md:w-2/4">
    	      			<Typography
    	    		 	   variant="h2"
    	    		 	   color="white"
    	    			    className="typo"
    	    			>
    	        			Dark Valley
    	      			</Typography>
    	      			<div className="flex">
    	        			<Button
								className="playnow" 
							 	color="blue">
    	        			  	Play Now
    	        			</Button>
    	  		    	</div>
    	  		  </div>
    	  		</div>
    	</div>
    	<div className="lighttable relative h-full w-full">
    		<img
    	    	src="/homeImages/frozenarena.svg"
    	    	alt="image 2"
    	    	className="h-full w-full object-cover"
    	  	/>
    		<div className="playlightnow absolute inset-0 grid h-full w-full place-items-center ">
    	    	<div className=" w-3/4 text-center md:w-2/4">
    	      		<Typography
    	        		variant="h2"
    	        		color="white"
    	        		className="typo"
    	      		>
						Frozen Areana
    	      		</Typography>

    	     	 	<div className="flex text-sm">
    	      		  <Button
					  		className="playnow"
							color="white">
    	      	  	 	Play Now
    	      	  	</Button>
    	      		</div>
    	    	</div>
    	  </div>
    	</div>
    
    	</Carousel>

	);
}

const Match = () => {
	return (
		<div className="match">
			<div className="opponent">
				<Image src="/homeImages/member0.svg" alt="profile" width={26} height={26}/>
				<p>UcefSahih</p>
			</div>
			<div className="level">
				<p> 10 </p>
			</div>
			<div className="w-l">
				<p> W </p>
			</div>
		</div>
	);
}

const Statistics = ()=>{
	return (
		<>
			<div className="statistics-line flex items-center">
				<hr className="line"/>
				<span className="px-4">Statistics</span>
				<hr className="line"/>
			</div>
			<div className="Statistics">
				<div className="Statistics-head">
					<div>
						<p>Opponent</p>
					</div>

					<div>
						<p>Level</p>
					</div>

					<div>
						<p>W/L</p>
					</div>

				</div>
				<div className="matches">
					<Match/>
					<Match/>
					<Match/>
					<Match/>
					<Match/>
					<Match/>
					<Match/>
					<Match/>
					<Match/>
					<Match/>
				</div>
			</div>
		</>
	);
}


const BackGround = ()=> {
    return (
        <div className='bg'>
            <Image
                src="/homeImages/Backgroundimage.svg"
                alt="background"
                priority={true}
                fill
				className="bgimage"
                sizes="100vw"
                style={{
                    objectFit: "cover",
                }} />
         </div>
    );
}



const Home = ({active}) => {
	return (
		<div className="homepage">
			{active === 1 && <div className="home">
				<Tables/>
				<Statistics/>
			</div>}
			{active === 2 && <Games />}
			{active === 3 && <Ranking/>}
			{active === 4 && <Search/>}
			{active === 5 && <div className="chatholder visible xl:invisible">
				<Chat/>
			</div>}


		</div>

	);
}

const Body = () => {
	
	const [activeComponent, setActiveComponent] = useState(1);

	const handleButtonClick = (componentNumber: number) => {
	  setActiveComponent(componentNumber);
	};

	return (
		<div className="body">
			<Sidebar ButtonClick={handleButtonClick} />
			<Home active={activeComponent}/>
			<div className="chatdiv hidden xl:block">
				<Chat/>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<div>
			<BackGround/>
			<Navbar/>
			<Body/>
		</div>

	// 	

	);
}
