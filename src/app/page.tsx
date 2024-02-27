"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import Chat from "./component/Chat";
import Games from "./component/Games";

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
				className="filter brightness-50"
                sizes="100vw"
                style={{
                    objectFit: "cover",
                }} />
         </div>
    );
}

const Ranking = ()=>{
	return(
		<div className="ranking">
				<div className="first-3">
					<div className="secondPlace">
						<Image src="/homeImages/firstplace.svg" width={18} height={7} alt="profile"/>
						<Image src="/homeImages/memeber1.svg" width={43} height={43} alt="profile"/>
						<p>Username</p>
					</div>
					<div className="firstPlace">
						<Image src="/homeImages/firstplace.svg" width={30} height={16} alt="profile"/>
						<Image src="/homeImages/memeber1.svg" width={60} height={60} alt="profile"/>
						<p>Username</p>
					</div>
					<div className="thirdPlace">
						<Image src="/homeImages/firstplace.svg" width={18} height={7} alt="profile"/>
						<Image src="/homeImages/memeber1.svg" width={43} height={43} alt="profile"/>
						<p>Username</p>
					</div>
				</div>
				<div className="ranking-head">

				</div>
				<div className="">

				</div>
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

