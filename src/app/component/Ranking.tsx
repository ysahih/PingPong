"use client";
import axios from "axios";
import { Console } from "console";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NoHistoy } from "../App";
import { CircularProgress } from "@mui/material";
import { boolean } from "yup";
import { useRouter } from "next/navigation";




const UserRank  :React.FC<{data : rankingdata }> = ( Props ) => {
	const router = useRouter();
	return (

		<div className=" w-[90%]   m-auto flex justify-between  items-center  bg-[#1B1A55] rounded-full border-t-[1px] border-[#535C91] mt-[14px]">
			<div className="  RankBlock h-[45px] w-[90%] m-auto   flex justify-between  items-center  ">
				<div className="flex justify-start items-center w-[20%] gap-[10px]   ">
					<Image  className="rounded-full  w-[40px] h-[40px]" 
					onClick={() => {
						router.push(`/users?userName=${Props.data.userName}`);
					  }}
					src={ Props.data.image?  Props.data.image : "./homeImages/memeber1.svg"} width={40} height={40} alt="profile"/>
					<p   className="truncate "> {Props.data.userName}</p>

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

	const TopPlayers :React.FC< {data: rankingdata[] | undefined ,reciveresponse : | boolean }  >  =  (Props)=>{

		const router = useRouter();
		return (
			<div className="first-3">
				{ !Props.reciveresponse  ?  <div className="w-[100%] h-[100%]  flex items-center justify-center ">  <CircularProgress  />  </div>  :
					<>
						{
							  Array.isArray(Props.data) && Props.data && Props.data.length > 1  ?
							<div className="secondPlace">
								<Image src="./homeImages/firstplace.svg" width={18} height={7} alt="profile"/>
								<Image  className="rounded-full w-[43px] h-[43px] " 	
								src={ Props.data[1].image?  Props.data[1].image : "./homeImages/memeber1.svg"}
								onClick={() => {
									if (Props.data)
									router.push(`/users?userName=${   Props.data[1].userName}`);
								  }}

								 width={43} height={43} alt="profile"/>
								<p>{Props.data[1].userName} </p>
							</div> : <></>

						}

						{
							 Array.isArray(Props.data) && Props.data && Props.data.length > 0  ?
							<div className="firstPlace">
								<Image src="./homeImages/firstplace.svg" width={30} height={16} alt="profile"/>
								<Image  className="rounded-full w-[43px] h-[43px] "  
								src={ Props.data[0].image?  Props.data[0].image : "./homeImages/memeber1.svg"}
								 width={60} height={60} alt="profile"
								 onClick={() => {
									if (Props.data)
									router.push(`/users?userName=${   Props.data[0].userName}`);
								  }}
								 />
								<p>{Props.data[0].userName}</p>
						
							</div>: <></>
						}
						{
								Array.isArray(Props.data) && Props.data && Props.data.length > 2  ?
									<div className="thirdPlace">
									<Image src="./homeImages/firstplace.svg" width={18} height={7} alt="profile"/>
									<Image  className="rounded-full w-[43px] h-[43px] " 
									src={ Props.data[2].image?  Props.data[2].image : "./homeImages/memeber1.svg"}
										width={43} height={43} alt="profile"
										onClick={() => {
										if (Props.data)
										router.push(`/users?userName=${   Props.data[2].userName}`);
										}} />
									<p>{Props.data[2].userName}</p>
									</div> 
								: <></>
						}
					</>
			}
			</div>

		);
	}

const Ranking = ()=>{
	const [rankingData, setRankingData] = useState<rankingdata[]>()
	const [reciveresponse ,setreciveresponse] = useState<boolean>(false); 
	useEffect(() => {
		const data = async ( )=>{
			const ranking = await axios.get(process.env.NEST_API + "/user/rankingHistory", {
				withCredentials: true,
			});
			if (ranking.data){

				setRankingData(ranking.data )

			}
			console.log(rankingData, "--", ranking.data);
				setreciveresponse(true);
		}
		data();
	}, [])




	return(
		<div className="ranking ">
				< TopPlayers  data={rankingData} reciveresponse={reciveresponse} />
				<div className="ranking-head  w-[83%] flex justify-between m-auto text-[#8A99E9] mt-6 ">
					<p className="w-[20%]" >Username</p>
					<p  >Wins</p>
					<p >Loses</p>
					<p  >Level</p>
					<p >Rank</p>
				</div>
				<div className="overflow-auto  bg-[var(--bg-color)] pb-[20px] max-h-[80vh]">
				{ !reciveresponse  ?  <div className="w-[100%] h-[100%]  flex items-center justify-center ">  <CircularProgress  />  </div>  : 	 
					 Array.isArray(rankingData)  && rankingData.length > 0  ? rankingData?.map((data: rankingdata, idx: number) => {
							return <UserRank key={data.userName + idx} data={data}/> })
						: <NoHistoy />
						}
				</div>
		</div> 
	);
}

export default Ranking






// if the user isn't in top 10  doens't appear the ranking data if he apprears he has wrong data 