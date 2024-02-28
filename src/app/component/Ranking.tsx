import Image from "next/image";


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

export default Ranking