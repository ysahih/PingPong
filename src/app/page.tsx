"use client";
import Image from "next/image";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import Chat from "./component/Chat";
import Games from "./component/Games";

import { Carousel, Typography, Button } from "@material-tailwind/react";

const Tables = ()=>{
	return (
		<Carousel className="tables rounded-lg">
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
    	<div className=" lighttable relative h-full w-full">
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
			</div>
		</>
	);
}


const Home = () => {
	return (
		<div className="homepage">
			{/* <Games/>
			<div className="chatholder visible xl:invisible">
				<Chat/>
			</div> */}
			<div className="home">
				<Tables/>

				<Statistics/>
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


	// 	

	);
}

