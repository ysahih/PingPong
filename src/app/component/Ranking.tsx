"use client";
import axios from "axios";
import { Console } from "console";
import Image from "next/image";
import { useEffect, useState } from "react";



const UserRank  :React.FC<{data : rankingdata }> = ( Props ) => {
	
	return (
		<div className=" w-[90%]  m-auto flex justify-between  items-center  bg-[#1B1A55] rounded-full border-t-2 border-[#0064FB] mt-[12px]">
			<div className="RankBlock h-[50px] w-[90%] m-auto   flex justify-between  items-center  ">
				<div className="flex justify-between items-center w-[20%]    ">
					<Image src={ Props.data.image?  Props.data.image : "/homeImages/memeber1.svg"} width={40} height={40} alt="profile"/>
					<p> {Props.data.userName}</p>
				</div>
				<p >{Props.data.winCounter}</p>
				<p >{Props.data.lossCounter}</p>
				<p >{Props.data.level }</p>
				<p  >{Props.data.rank}</p>	
			</div>
		</div>
	);
}





type rankingdata = {


	rank : number ,
	userName: string,
	image: string,
	level: number,
	winCounter: number,
	lossCounter: number
	
}

const Ranking = ()=>{
	const [rankingData, setRankingData] = useState<rankingdata >()
	
	useEffect(() => {
		const data = async ( )=>{
			const ranking = await axios.get(process.env.NEST_API + "/user/rankingHistory", {
				withCredentials: true,
			});
			if (ranking.data){
				setRankingData(ranking.data)
			}
			console.log(rankingData, "--", ranking.data);
		}
		data();
	}, [])





	return(
		<div className="ranking">
				<div className="first-3">
					<div className="secondPlace">
						<Image src="./homeImages/firstplace.svg" width={18} height={7} alt="profile"/>
						<Image src="./homeImages/memeber1.svg" width={43} height={43} alt="profile"/>
						<p>Username</p>
					</div>
					<div className="firstPlace">
						<Image src="./homeImages/firstplace.svg" width={30} height={16} alt="profile"/>
						<Image src="./homeImages/memeber1.svg" width={60} height={60} alt="profile"/>
						<p>Username</p>
					</div>
					<div className="thirdPlace">
						<Image src="./homeImages/firstplace.svg" width={18} height={7} alt="profile"/>
						<Image src="./homeImages/memeber1.svg" width={43} height={43} alt="profile"/>
						<p>Username</p>
					</div>
				</div>
				<div className="ranking-head  w-[83%] flex justify-between m-auto text-[#8A99E9] mt-6 ">
					<p className="w-[20%]" >Username</p>
					<p  >Wins</p>
					<p >Loses</p>
					<p  >Level</p>
					<p >Rank</p>
				</div>
				<div className="ranking-body h-[78%]  overflow-auto   ">
				{	
					 Array.isArray(rankingData) && rankingData?.map((data: rankingdata, idx: number) => {
							return <UserRank key={data.userName + idx} data={data}/>;
						})
						}
				</div>
		</div> 
	);
}

export default Ranking